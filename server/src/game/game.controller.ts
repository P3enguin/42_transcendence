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

@Controller('game')
export class GameController {
  constructor(private gameService: GameService) {}

  @Get('join')
  @UseGuards(JwtGuard)
  joinGame(@Req() req: Request, @Res() res: Response) {
    console.log(req.body.jwtDecoded);
    
    // return res.status(200).json(req.body.jwtDecoded);
  }
}
