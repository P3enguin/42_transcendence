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
import { JwtGuard } from 'src/auth/guard';

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
  players = new Map<string, Socket[]>;

  constructor(private chatService: ChatService) {}
  handleConnection(
    @ConnectedSocket() client: Socket,
    @Body() data: SocketData,
  ) {
    
    console.log('client connected:', client.id);
  }
  handleDisconnect(client: Socket) {
    console.log('client disconnected:', client.id);
  }

  @SubscribeMessage('message')
  handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: SocketData,
  ): string {
    // console.log('message:', data);
    return 'received !';
  }
}