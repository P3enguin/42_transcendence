import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { Server, Socket } from 'socket.io';
import { Body, LoggerService, UseGuards, ValidationPipe } from '@nestjs/common';
import {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from './inteface';
import { Player } from '@prisma/client';
import { JwtGuard } from 'src/auth/guard';
import { GetPlayer } from 'src/auth/decorator';

export interface LogPlayer extends Player {
  socketId?: string;
}

@WebSocketGateway({
  namespace: 'chat',
  cors: {
    origin: '*',
  },
})


export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >;
  players = new Map<string, string>;

  constructor(private chatService: ChatService,
              private jwt: JwtGuard) 
              {}
  async handleConnection(
    @ConnectedSocket() client: Socket,
    @Body() data: SocketData,
  ) {
    const player = (await this.jwt.verifyToken(
      client.handshake.auth.token,
    )) as LogPlayer;
    player.socketId = client.id;
    this.players.set(player.nickname ,client.id);
    console.log('client connected:', client.id, player.nickname);
    this.server.to(client.id).emit('connected', 'welcome to the Chat Server !');
  }
  async handleDisconnect(client: Socket) {
    const player = (await this.jwt.verifyToken(
      client.handshake.auth.token,
    )) as LogPlayer;
    this.chatService.removeFromChat(player.nickname);
  }

  @SubscribeMessage('message')
  handleMessage(
    @GetPlayer() player: LogPlayer,
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ): string {
      this.server.to(this.players.get(player.nickname)).emit('message', "received succ");
    return 'received !';
  }
}