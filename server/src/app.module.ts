import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { PlayerModule } from './player/player.module';
import { PrismaModule } from './prisma/prisma.module';
import { MatchModule } from './match/match.module';

import { AppService } from './app.service';
import { AppController } from './app.controller';
import { StatusModule } from './status/status.module';
import { AchivementModule } from './achivement/achivement.module';
import { TitleModule } from './title/title.module';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { RoomModule } from './room/room.module';
import { GameModule } from './game/game.module';

import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

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
    MatchModule,
    PrismaModule,
    StatusModule,
    TitleModule,
    ChatModule,
    RoomModule,
    GameModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
