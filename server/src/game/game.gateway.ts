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
    origin: process.env.FRONTEND_HOST,
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
    this.gameService.disconnectPlayer(player.gameId, player.nickname);
  }

  @SubscribeMessage('GetLiveGames')
  handleGetLiveGames(@ConnectedSocket() client: Socket) {
    client.join('LiveGames');
    const games = this.gameService.getLiveGames();
    this.server.to(client.id).emit('LiveGames', games);
  }

  @SubscribeMessage('joinGame')
  handleMessage(
    @GetPlayer() player: connectedPlayer,
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ): string {
    const game = this.gameService.getGameById(data.gameId);
    if (game) {
      if (!game.isActive()) {
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
      if (game.isActive()) {
        if (game.isPlayer(player.nickname)) {
          this.server.to(game.players[0].socketId).emit('startGame', {
            position: 'Bottom',
            P1: game.players[0].nickname,
            P2: game.players[1].nickname,
          });
          this.server.to(game.players[1].socketId).emit('startGame', {
            position: 'Top',
            P1: game.players[0].nickname,
            P2: game.players[1].nickname,
          });
          this.server.to('LiveGames').emit('newGame', {
            P1: game.players[0],
            P2: game.players[1],
            gameId: game.id,
          });
          setTimeout(() => {
            this.startGame(game.id);
          }, 1000);
        } else {
          game.addSpectator(
            new gamePlayer(
              player.id,
              player.nickname,
              player.avatar,
              client.id,
            ),
          );
          // player.gameId = data.gameId;
          this.server
            .to(data.gameId)
            .emit('joined', `${player.nickname} is spectating`);
          client.join(data.gameId);
          this.server.to(client.id).emit('startGame', {
            position: 'spectator',
            P1: game.players[0].nickname,
            P2: game.players[1].nickname,
          });
        }
      }
    } else {
      this.server.to(client.id).emit('joined', 'Game not found');
    }
    return 'Joining game';
  }

  @SubscribeMessage('move')
  handleMove(@GetPlayer() player: connectedPlayer, @MessageBody() data: any) {
    const game = this.gameService.getGameById(player.gameId);
    if (game) game.movePaddle(data.position, data.x);
  }

  startGame(gameId: string) {
    const game: Game = this.gameService.getGameById(gameId);
    game.start();
    game.inteval = setInterval(() => {
      game.ball.setNextPosition();
      // check if ball is colliding with Wall
      game.checkWallCollision();
      // check if ball is colliding with paddle
      game.checkPaddleCollision();
      // check if ball scored
      if (game.checkNewScore()) {
        this.server
          .to(gameId)
          .to('LiveGames')
          .emit('updateScore', game.getScore());
      }
      // check if the game reached 5 score
      if (game.checkWin()) {
        this.server.to(gameId).to('LiveGames').emit('gameOver', gameId);
        clearInterval(game.inteval);
        this.gameService.saveGame(gameId);
      }
      // update ball position
      game.ball.updatePosition();
      this.server.to(gameId).emit('updateBall', game.getBallPos());
      this.server.to(gameId).emit('updatePaddle', game.getPaddlePos());
    }, 1000 / 60);
  }
}
