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
import { Logger } from '@nestjs/common';

export interface connectedPlayer extends Player {
  socketId?: string;
  gameId?: string;
}

@WebSocketGateway({
  namespace: 'game',
  cors: {
    origin: [process.env.FRONTEND_HOST, process.env.FRONTEND_HOST0],
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
  constructor(
    private gameService: GameService,
    private readonly jwt: JwtGuard,
    private readonly logger: Logger,
  ) {
    this.logger = new Logger(GameGateway.name, { timestamp: true });
  }

  async handleConnection(client: Socket) {
    const player = (await this.jwt.verifyToken(
      client.handshake.auth.token,
    )) as connectedPlayer;
    if (!player) client.disconnect(true);
    player.socketId = client.id;
    client.handshake.query.user = JSON.stringify(player);
    this.logger.log(`player connected: ${player.nickname} ${player.socketId}`);
    this.server.to(client.id).emit('connected', 'Welcome, How may I help you!');
  }

  handleDisconnect(client: Socket) {
    const player = this.getPlayer(client);
    const game = this.gameService.getGameById(player.gameId);
    if (player && game) {
      if (game.gameOn) {
        game.playerLeft(player.nickname);
        this.server.to(player.gameId).emit('left', player.nickname);
      } else this.gameService.deleteGame(player.gameId);
    }
    this.logger.log(
      `player disconnected: ${player.nickname} ${player.socketId}`,
    );
  }

  @SubscribeMessage('GetLiveGames')
  handleGetLiveGames(@ConnectedSocket() client: Socket) {
    client.join('LiveGames');
    const games = this.gameService.getLiveGames();
    return games;
  }

  @SubscribeMessage('joinGame')
  handlejoinGame(
    @GetPlayer() player: connectedPlayer,
    @ConnectedSocket() client: Socket,
    @MessageBody() { gameId }: { gameId: string },
  ) {
    const game = this.gameService.getGameById(gameId);
    if (game) {
      if (game.isPlayer(player.nickname)) {
        if (!game.isActive()) {
          game.connectPlayer(player.nickname, client.id);
          player.gameId = gameId;
          client.handshake.query.user = JSON.stringify(player);
          client.join(gameId);
        }
        if (game.isActive()) {
          this.server.to(game.players[0].socketId).emit('startGame', {
            position: 'Bottom',
            info: game.getPlayersInfo(),
          });
          this.server.to(game.players[1].socketId).emit('startGame', {
            position: 'Top',
            info: game.getPlayersInfo(),
          });
          this.server.to(gameId).emit('joined', {
            isPlayer: true,
            message: `${player.nickname} has joined the game`,
          });
          this.server
            .to('LiveGames')
            .emit('newGame', this.gameService.getLiveGame(game));
          setTimeout(() => {
            this.startGame(game);
          }, 1000);
        }
        return { status: 200, message: 'Joined' };
      } else {
        return { status: 401, message: 'You are not a player in  this game' };
      }
    } else {
      return { status: 404, message: 'Game not found' };
    }
  }

  @SubscribeMessage('watchGame')
  handleWatchGame(
    @GetPlayer() player: connectedPlayer,
    @ConnectedSocket() client: Socket,
    @MessageBody() { gameId }: { gameId: string },
  ) {
    const game = this.gameService.getGameById(gameId);
    if (game) {
      if (game.gameOn) {
        game.addSpectator(
          new gamePlayer(player.id, player.nickname, player.avatar, client.id),
        );
        this.server.to(gameId).emit('joined', {
          isPlayer: false,
          message: `${player.nickname} is spectating`,
        });
        client.join(gameId);
        this.server.to(client.id).emit('startGame', {
          position: 'spectator',
          info: game.getPlayersInfo(),
        });
        return { status: 200, message: 'Spectating' };
      } else {
        client.join(gameId);
        return { status: 401, message: 'This game not satrted yet' };
      }
    }
  }

  @SubscribeMessage('move')
  handleMove(@GetPlayer() player: connectedPlayer, @MessageBody() data: any) {
    const game = this.gameService.getGameById(player.gameId);
    if (game) {
      const __player = game.isPlayer(player.nickname);
      if (__player) {
        game.movePaddle(__player, data.x);
      }
    }
  }

  startGame(game) {
    if (!game.gameOn) {
      game.start();
      game.interval = setInterval(() => {
        if (!game.paused) {
          game.ball.setNextPosition();
          // check if ball is colliding with Wall
          game.checkWallCollision();
          // check if ball is colliding with paddle
          game.checkPaddleCollision();
          // check if ball scored
          if (game.checkNewScore()) {
            this.server
              .to(game.id)
              .to('LiveGames')
              .emit('updateScore', game.getScore());
          }
          // check if the game reached 5 score
          if (game.checkWin()) {
            this.server
              .to(game.id)
              .to('LiveGames')
              .emit('gameOver', game.getScore());
            clearInterval(game.interval);
            this.gameService.saveGame(game);
          }
          // update ball position
          game.ball.updatePosition();
          this.server.to(game.id).emit('updateBall', game.getBallPos());
          this.server.to(game.id).emit('updatePaddle', game.getPaddlePos());
        }
      }, 1000 / 60);
    }
  }

  getPlayer(client: Socket): connectedPlayer | undefined {
    const player = JSON.parse(
      client.handshake.query.user as string,
    ) as connectedPlayer;
    return player;
  }
}
