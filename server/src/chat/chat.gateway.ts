import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { Socket, Server } from 'socket.io';
import { Body } from '@nestjs/common';
import {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from './inteface';
import { Player } from '@prisma/client';
import { JwtGuard } from 'src/auth/guard';
import { GetPlayer } from 'src/game/decorator';
import { PrismaService } from 'src/prisma/prisma.service';

export interface LogPlayer extends Player {
  socketId?: string;
}

@WebSocketGateway({
  namespace: 'chat',
  cors: {
    origin: process.env.FRONTEND_HOST,
  },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private chatservice: ChatService,
    private jwt: JwtGuard,
    private prisma: PrismaService,
  ) {}

  @WebSocketServer() server: Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >;

  afterInit(server: Server) {
    // console.log(server);
  }

  handleDisconnect(client: Socket) {
    console.log(`Disconnected: ${client.id}`);
  }

  async handleConnection(client: Socket) {
    const player = (await this.jwt.verifyToken(
      client.handshake.auth.token,
    )) as LogPlayer;
    if (!player) {
      client.disconnect(true);
      return;
    }
    player.socketId = client.id;
    client.handshake.query.user = JSON.stringify(player);
    client.join(player.nickname);
    console.log('player connected:', player.nickname, player.socketId);
    this.server.to(client.id).emit('connected', 'Hello world!');
  }

  @SubscribeMessage('joinChat')
  handleJoinChat(
    @GetPlayer() player: LogPlayer,
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ) {
    if (!player) {
      client.disconnect(true);
      return;
    }
    // console.log(payload);
    client.join(data.id);
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @GetPlayer() player: LogPlayer,
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ) {
    if (!player) {
      client.disconnect(true);
      return;
    }
    var time = new Date();
    const receivedTime = time.getHours() + ':' + time.getMinutes();
    let BlockedBY: string[] = [];

    const room = await this.prisma.room.findUnique({
      where: {
        channelId: data.id,
      },
      include: {
        mutes: true,
        members: true,
      },
    });
    if (room) {
      if (room.isChannel) {
        if (!room.members.find((m) => m.id === player.id)) return;

        for (let i = 0; i < room.mutes.length; i++) {
          if (room.mutes[i].playerId === player.id) {
            client.emit('muted', 'You are muted');
            return;
          }
        }
      }
    }

    const blockerList = await this.prisma.player.findMany({
      where: {
        block: {
          some: {
            id: player.id,
          },
        },
      },
    });

    const blockedList = await this.prisma.player.findUnique({
      where: {
        id: player.id,
      },
      include: {
        block: true,
      },
    });

    for (let i = 0; i < blockerList.length; i++) {
      BlockedBY.push(blockerList[i].nickname);
    }
    for (let i = 0; i < blockedList.block.length; i++) {
      BlockedBY.push(blockedList.block[i].nickname);
    }

    const messageInfo = {
      sender: player.nickname,
      senderAvatar: player.avatar,
      time: receivedTime,
      message: data.message,
    };

    this.server.to(data.id).except(BlockedBY).emit('message', messageInfo);
    this.chatservice.saveMessage(messageInfo, data.id);
  }
}
