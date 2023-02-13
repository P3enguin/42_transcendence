import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlayerModule } from './player/player.module';
import { MatchModule } from './match/match.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PlayerModule, MatchModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
