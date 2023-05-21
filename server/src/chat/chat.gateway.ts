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
  constructor(private chatservice: ChatService, private jwt: JwtGuard) {}

  @WebSocketServer()   server: Server<
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
    if (client)
      player.socketId = client.id;
    client.handshake.query.user = JSON.stringify(player);
    console.log('player connected:', player.nickname, player.socketId);
    this.server.to(client.id).emit('connected', 'Hello world!');
  }

  @SubscribeMessage('joinChat')
  handleJoinChat(client: Socket, payload: any) {
    // console.log(payload);
    client.join(payload.id);
  }

  @SubscribeMessage('sendMessage')
  handleSendMessage(
    @GetPlayer() player: LogPlayer,
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ) {
    var time = new Date();
    const receivedTime = time.getHours() + ":" + time.getMinutes();
    // console.log(data.id);
    // console.log(player);

    const messageInfo= {
      sender: player.nickname,
      senderAvatar: player.avatar,
      time: receivedTime,
      message: data.message,
    };
  
    this.server.to(data.id).emit('message', messageInfo);
    this.chatservice.saveMessage(messageInfo, data.id)
  }

}
