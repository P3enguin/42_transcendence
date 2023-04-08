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
import { Player as PlayerDB } from '@prisma/client';
import { GameType, Player } from './interfaces';

@UseGuards(JwtGuard)
@Controller('game')
export class GameController {
  constructor(private gameService: GameService) {}

  @Get('join')
  joinGame(
    @GetPlayer() player: PlayerDB,
    @Res() res: Response,
    @Query('gametype') gametype: GameType,
  ) {
    const id = this.gameService.joinGame(
      new Player(player.id, player.nickname),
      gametype,
    );
    return res.status(200).json(id);
  }

  @Get(':id')
  getGame(
    @GetPlayer('nickname') player: string,
    @Param('id') gameId: string,
    @Res() res: Response,
  ) {
    if (this.gameService.getActiveGame(gameId)) {
      return res.status(200).json('0ki');
    } else if (this.gameService.getMyGame(gameId, player)) {
      return res.status(200).json('0ki');
    }
    return res.status(400).json('N0 game :P');
  }
}
