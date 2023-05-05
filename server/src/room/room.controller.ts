import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { RoomService } from './room.service';
import { Request, Response } from 'express';

@UseGuards(JwtGuard)
@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Get('discover')
  getDiscoveredRooms(@Res() res: Response) {
    return this.roomService.getDiscoveredRooms(res);
  }
}
