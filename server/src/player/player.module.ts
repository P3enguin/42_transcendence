import { Module } from '@nestjs/common';
import { PlayerService } from './player.service';
import { PlayerController } from './player.controller';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { PlayerGateway } from './player.gateway';

@Module({
  providers: [PlayerService, JwtService, PrismaService, PlayerGateway],
  controllers: [PlayerController],
})
export class PlayerModule {}
