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
import {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from './inteface';
import { JwtGuard } from 'src/auth/guard';
import { GetPlayer } from './decorator/get-player.decorator';
import { Player } from '@prisma/client';
import { Game, Player as gamePlayer } from './interfaces';

export interface connectedPlayer extends Player {
  socketId?: string;
  gameId?: string;
}

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
    const player = (await this.jwt.verifyToken(
      client.handshake.auth.token,
    )) as connectedPlayer;
    player.socketId = client.id;
    client.handshake.query.user = JSON.stringify(player);
    console.log('player connected:', player.nickname, player.socketId);
    this.server.to(client.id).emit('connected', 'Hello world!');
  }

  handleDisconnect(client: Socket) {
    const player = JSON.parse(
      client.handshake.query.user as string,
    ) as connectedPlayer;
    console.log('client disconnected:', client.id);
    this.gameService.removePlayerFromGame(player.gameId, player.nickname);
  }

  @SubscribeMessage('joinGame')
  handleMessage(
    @GetPlayer() player: connectedPlayer,
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ): string {
    const game = this.gameService.getGameById(data.gameId);
    if (game) {
      if (!game.isFull()) {
        if (game.isPlayer(player.nickname)) {
          game.connectPlayer(player.nickname, client.id);
          client.join(data.gameId);
          player.gameId = data.gameId;
          client.handshake.query.user = JSON.stringify(player);
          this.server
            .to(data.gameId)
            .emit('joined', `${player.nickname} joined the game`);
        }
      }
      if (game.isFull()) {
        if (game.isPlayer(player.nickname)) {
          this.server.to(game.players[0].socketId).emit('startGame', {
            position: 'Bottom',
          });
          this.server.to(game.players[1].socketId).emit('startGame', {
            position: 'Top',
          });
          setTimeout(() => {
            this.startGame(game.id);
          }, 1000);
        } else {
          game.addSpectator(
            new gamePlayer(player.id, player.nickname, client.id),
          );
          // player.gameId = data.gameId;
          this.server
            .to(data.gameId)
            .emit('joined', `${player.nickname} is spectating`);
          client.join(data.gameId);
          this.server
            .to(client.id)
            .emit('startGame', { position: 'spectator' });
        }
      }
    } else {
      this.server.to(client.id).emit('joined', 'Game not found');
    }
    return 'Joining game';
  }

  @SubscribeMessage('move')
  handleMove(@GetPlayer() player: connectedPlayer, @MessageBody() data: any) {
    // console.log('move', data, player.gameId);
    this.gameService
      .getGameById(player.gameId)
      .movePaddle(data.position, data.x);
    // this.server.to(player.gameId).emit('move it', data);
  }

  startGame(gameId: string) {
    const game: Game = this.gameService.getGameById(gameId);
    game.inteval = setInterval(() => {
      const gamepos = game.updateGame();
      console.log('update', gamepos);
      this.server.to(gameId).emit('moveBall', gamepos.ball);
      this.server.to(gameId).emit('movePaddle', {
        bottomPaddle: gamepos.bottomPaddle,
        topPaddle: gamepos.topPaddle,
      });
    }, 1000/60);
  }
}
