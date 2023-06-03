import { Controller, Get, Post, Query, Res } from '@nestjs/common';
import { RankService } from './rank.service';
import { Response } from 'express';

@Controller('rank')
export class RankController {
  constructor(private rankService: RankService) {}

  @Post('ranks')
  async fillRanks() {
    return this.rankService.fillRanks();
  }

  @Get('leaderboard')
  getLeaderBoardByRank(@Res() res: Response, @Query('limit') limit: number) {
    return this.rankService.getLeaderBoardByRank(res, limit);
  }
}
