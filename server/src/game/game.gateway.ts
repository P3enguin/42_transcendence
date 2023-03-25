import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { GameService } from './game.service';
import { Server, Socket } from 'socket.io';
import { LoggerService, UseGuards, ValidationPipe } from '@nestjs/common';
import {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from './inteface';
import { JwtGuard } from 'src/auth/guard';

@WebSocketGateway({
  namespace: 'game',
  cors: {
    origin: '*',
  },
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >;
  constructor(private gameService: GameService) {}
  handleConnection(client: Socket) {
    // console.log(client.handshake.auth);

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
    console.log('message:', data.username);
    return 'Hello world!';
  }
}
