import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { PlayerModule } from './player/player.module';
import { PrismaModule } from './prisma/prisma.module';
import { MatchModule } from './match/match.module';

import { AppService } from './app.service';
import { AppController } from './app.controller';
import { StatusModule } from './status/status.module';
import { AchivementModule } from './achivement/achivement.module';
import { TitleModule } from './title/title.module';

@Module({
  imports: [
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
