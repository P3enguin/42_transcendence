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
    this.server.to(client.id).emit('connected', 'Hello world!');
  }

  handleDisconnect(client: Socket) {
    const player = JSON.parse(client.handshake.query.user as string) as Player;
    const gameId = client.handshake.query.gameId;
    console.log('client disconnected:', client.id);
    console.log(client.rooms, client.id); 
    this.gameService.removePlayerFromGame(gameId as string, player.nickname);
  }
  

  @SubscribeMessage('joinGame')
  handleMessage(
    @GetPlayer() player: Player,
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ): string {
    const game = this.gameService.getGameById(data.gameId);
    if (game) {
      client.handshake.query.gameId = data.gameId;
      this.gameService.playerConnect(game.id, client.id, player.nickname);
      client.join(game.id);
      this.server
      .to(game.id)
      .emit('joined', `${player.nickname} has joined this game!`);
      console.log(client.rooms);
    } else console.log('no game');
    return 'Hello world!';
  }
}
