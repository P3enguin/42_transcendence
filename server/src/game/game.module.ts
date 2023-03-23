import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { GameGateway } from './game.gateway';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtGuard } from 'src/auth/guard';

@Module({
  providers: [GameService, JwtService, JwtGuard, PrismaService, GameGateway],
  controllers: [GameController],
})
export class GameModule {}
