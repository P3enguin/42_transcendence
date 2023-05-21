import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PlayerModule } from './player/player.module';
import { PrismaModule } from './prisma/prisma.module';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { StatusModule } from './status/status.module';
import { AchivementModule } from './achivement/achivement.module';
import { TitleModule } from './title/title.module';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { GameModule } from './game/game.module';
// import { LeaderboardModule } from './leaderboard/leaderboard.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppGateway } from './app.gateway';
import { JwtGuard } from './auth/guard';
import { JwtService } from '@nestjs/jwt';
import { PlayerService } from './player/player.service';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AchivementModule,
    AuthModule,
    PlayerModule,
    PrismaModule,
    StatusModule,
    TitleModule,
    ChatModule,
    GameModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AppGateway,
    Logger,
    JwtGuard,
    JwtService,
    PlayerService,
  ],
})
export class AppModule {}
