import { Module } from '@nestjs/common';
import { LeaderBoardController } from './leaderboard.controller';
import { LeaderBoardService } from './leaderboard.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [LeaderBoardController],
  providers: [LeaderBoardService, JwtService],
})
export class LeaderboardModule {}
