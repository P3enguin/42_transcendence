import {
  Body,
  Controller,
  Post,
  Get,
  UseGuards,
  Req,
  Res,
  Query,
  Param,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { GameService } from './game.service';
import { JwtGuard } from 'src/auth/guard';
import { GetPlayer } from 'src/auth/decorator';
import { Player } from '@prisma/client';

@Controller('game')
export class GameController {
  constructor(private gameService: GameService) {}

  @Get('join')
  @UseGuards(JwtGuard)
  joinGame(@GetPlayer() player: Player, @Res() res: Response) {
    const id = this.gameService.joinGame({
      id: player.id,
      nickname: player.nickname,
    });
    return res.status(200).json(id);
  }

  @Get(':id')
  getGame(@Req() req: Request, @Param('id') gameId, @Res() res: Response) {
    if (this.gameService.getGame(gameId)) {
      return res.status(200).json('0ki');
    }
    return res.status(400).json('Bad request');
  }
}
