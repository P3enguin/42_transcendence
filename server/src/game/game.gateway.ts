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
import { GetPlayer } from './decorator/get-player.decorator';
import { Player } from '@prisma/client';

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
  constructor(private gameService: GameService, private jwt: JwtGuard) {}
  async handleConnection(client: Socket) {
    client.handshake.query.user = JSON.stringify(
      await this.jwt.verifyToken(client.handshake.auth.token),
    );
    console.log('client connected:', client.id);
    client.emit('connected', 'Hello world!');
  }
  handleDisconnect(client: Socket) {
    console.log('client disconnected:', client.id);
  }

  @SubscribeMessage('message')
  handleMessage(
    @GetPlayer() player: Player,
    @ConnectedSocket() client: Socket,
    @MessageBody() data: SocketData,
  ): string {
    console.log(player);
    console.log('message:', data.username);
    return 'Hello world!';
  }
}
