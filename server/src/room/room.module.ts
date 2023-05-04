import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [RoomService, JwtService],
  controllers: [RoomController],
})
export class RoomModule {}
