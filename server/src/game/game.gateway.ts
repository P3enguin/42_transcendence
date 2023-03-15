import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { GameService } from './game.service';
import { Server, Socket } from 'socket.io';
import { LoggerService } from '@nestjs/common';
import { ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData } from './inteface';

@WebSocketGateway({
  namespace: 'game',
  cors: {
    origin: '*',
  },
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;
  constructor(
    private gameService: GameService,
  ) // private logger: LoggerService,
  {}

  handleConnection(client: Socket) {
    // this.logger.log('Client connected to game namespace:', client.id);
  }
  handleDisconnect(client: Socket) {
    // this.logger.log('Client disconnected from game namespace:', client.id);
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: any): string {
    return 'Hello world!';
  }
}
