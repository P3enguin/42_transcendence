import { Module } from '@nestjs/common';
import { PlayerService } from './player.service';
import { PlayerController } from './player.controller';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [PlayerService, JwtService, PrismaService],
  controllers: [PlayerController],
})
export class PlayerModule {}
