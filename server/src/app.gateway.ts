import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { AppService, UserStatus } from './app.service';
import { Logger, ValidationPipe } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { JwtGuard } from './auth/guard';
import { GetPlayer } from './game/decorator';
import { Player } from '@prisma/client';
import { PlayerService } from './player/player.service';
import { PrismaService } from './prisma/prisma.service';
import { isArray } from 'class-validator';
import { on } from 'events';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_HOST,
  },
})
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(
    private appService: AppService,
    private readonly jwt: JwtGuard,
    private playerService: PlayerService,
    // private prisma: PrismaService,
    private readonly logger: Logger,
  ) {
    this.logger = new Logger(AppGateway.name, { timestamp: true });
  }

  async handleConnection(client: Socket) {
    const user = await this.jwt.verifyToken(client.handshake.auth.token);
    if (!user) {
      client.disconnect(true);
      return;
    }
    client.handshake.query.user = JSON.stringify(user);
    this.logger.log(`${user.nickname} connected: ${client.id}`);
    this.appService.socketStatus.set(client.id, UserStatus.ONLINE);
    client.leave(client.id);
    client.join(user.nickname);
    // this.server.to(client.id).emit('connected', 'Welcome, How may I help you!');
    // since we have kicked out the client from the default room, we need to emit to the client directly
    client.emit('connected', 'Welcome, How may I help you!');
    this.server.to(`${user.id}_status`).emit('statusChange', {
      friend: {
        id: user.id,
        nickname: user.nickname,
        avatar: user.avatar,
      },
      status: this.userStatus(user.nickname),
    });
  }

  handleDisconnect(client: Socket) {
    let user: Player;
    if (client.handshake.query.user as string)
      user = JSON.parse(client.handshake.query.user as string);
    if (!user) {
      client.disconnect();
      return;
    }
    this.logger.log(`${user.nickname} disconnected: ${client.id}`);
    if (this.userStatus(user.nickname) === UserStatus.OFFLINE)
      this.appService.socketStatus.delete(client.id);
    this.server.to(`${user.id}_status`).emit('statusChange', {
      friend: {
        id: user.id,
        nickname: user.nickname,
        avatar: user.avatar,
      },
      status: this.userStatus(user.nickname),
    });
  }

  @SubscribeMessage('away')
  handleAway(
    @GetPlayer() user: Player,
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ) {
    if (!user) {
      client.disconnect();
      return;
    }
    // this.logger.log(`${player.nickname} is away`);
    this.appService.socketStatus.set(client.id, UserStatus.AWAY);
    this.server.to(`${user.id}_status`).emit('statusChange', {
      friend: {
        id: user.id,
        nickname: user.nickname,
        avatar: user.avatar,
      },
      status: this.userStatus(user.nickname),
    });
  }

  @SubscribeMessage('inGame')
  handleInGame(
    @GetPlayer() user: Player,
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ) {
    if (!user) {
      client.disconnect();
      return;
    }
    // this.logger.log(`${player.nickname} is away`);
    this.appService.socketStatus.set(client.id, UserStatus.IN_GAME);
    this.server.to(`${user.id}_status`).emit('statusChange', {
      friend: {
        id: user.id,
        nickname: user.nickname,
        avatar: user.avatar,
      },
      status: this.userStatus(user.nickname),
    });
  }

  @SubscribeMessage('online')
  handleOnline(
    @GetPlayer() user: Player,
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ) {
    if (!user) {
      client.disconnect();
      return;
    }
    // this.logger.log(`${Player.nickname} is online`);
    this.appService.socketStatus.set(client.id, UserStatus.ONLINE);
    this.server.to(`${user.id}_status`).emit('statusChange', {
      friend: {
        id: user.id,
        nickname: user.nickname,
        avatar: user.avatar,
      },
      status: this.userStatus(user.nickname),
    });
  }

  @SubscribeMessage('getOnlineFriends')
  async handleGetOnlineFriends(
    @GetPlayer() user: Player,
    @ConnectedSocket() client: Socket,
  ) {
    if (!user) {
      client.disconnect();
      return;
    }
    // console.log('getOnlineFriends', player.nickname);
    const friends = await this.playerService.GetFriendsIds(user.nickname, true);
    if (isArray(friends)) {
      const onlineFirends = [];
      friends.forEach((friend) => {
        client.join(`${friend.id}_status`);
        onlineFirends.push({
          friend: friend,
          status: this.userStatus(friend.nickname),
        });
      });
      // console.log(onlineFirends);
      return onlineFirends;
    }
  }

  @SubscribeMessage('gameInvite')
  handleGameInvite(
    @GetPlayer() user: Player,
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ) {
    if (!user) {
      client.disconnect();
      return;
    }
    console.log('gameInvite', data);
    this.server.to(data.user.nickname).emit('gameInvite', {
      user: {
        id: user.id,
        nickname: user.nickname,
        avatar: user.avatar,
      },
      gameType: data.gameType,
      gameId: data.gameId,
    });
  }

  @SubscribeMessage('denyInvitation')
  habdleDenyInvitation(
    @GetPlayer() user: Player,
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ) {
    if (!user) {
      client.disconnect();
      return;
    }
    // console.log('denyInvitation', data);

    this.server.to(data.user.nickname).emit('denyInvitation', {
      user: {
        id: user.id,
        nickname: user.nickname,
        avatar: user.avatar,
      },
      gameType: data.gameType,
      gameId: data.gameId,
    });
  }

  userStatus(nickname: string) {
    const room = this.server.sockets.adapter.rooms.get(nickname);
    let online = 0;
    let away = 0;
    let inGame = 0;
    if (room) {
      room.forEach((id) => {
        if (this.appService.socketStatus.get(id) === UserStatus.IN_GAME)
          inGame++;
        else if (this.appService.socketStatus.get(id) === UserStatus.ONLINE)
          online++;
        else if (this.appService.socketStatus.get(id) === UserStatus.AWAY)
          away++;
      });
      if (inGame > 0) return UserStatus.IN_GAME;
      else if (online > 0) return UserStatus.ONLINE;
      else if (away > 0) return UserStatus.AWAY;
      else return UserStatus.OFFLINE;
    } else return UserStatus.OFFLINE;
  }
}
