import { Injectable, Req } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Response } from 'express';

@Injectable()
export class RoomService {
  constructor(private prisma: PrismaService) {}

  async getDiscoveredRooms(res: Response) {
    try {
      let rooms = await this.prisma.room.findMany({
        select: {
          channelId: true,
          name: true,
          Topic: true,
          memberLimit: true,
          stats: true,
          avatar: true,
          member: true,
        },
      });
      rooms = rooms.map((room) => ({
        ...room,
        memberCount: room.member.length,
      }));
      return res.status(200).json({ rooms });
    } catch (err) {
      console.log(err);
      return res.status(400).json({ error: err });
    }
  }
}
