import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { LeaderBoardService } from './leaderboard.service';
import { Response } from 'express';

interface queryLeaderBoardParam {
  limit: number;
}

@UseGuards(JwtGuard)
@Controller('leaderboard')
export class LeaderBoardController {
  constructor(private leaderBoardService: LeaderBoardService) {}

  @Get('level')
  getLeaderBoardByLevel(
    @Res() res: Response,
    @Query() query: queryLeaderBoardParam,
  ) {
    return this.leaderBoardService.getLeaderBoardByLevel(res, query.limit);
  }

  @Get('rank')
  getLeaderBoardByRank(
    @Res() res: Response,
    @Query() query: queryLeaderBoardParam,
  ) {
    return this.leaderBoardService.getLeaderBoardByRank(res, query.limit);
  }
}
