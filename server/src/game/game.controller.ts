import {
  Body,
  Controller,
  Post,
  Get,
  UseGuards,
  Req,
  Res,
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
    console.log(player);
    
    return res.status(200).json(player);
  }
}
