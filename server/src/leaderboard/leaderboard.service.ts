import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Response } from 'express';

@Injectable()
export class LeaderBoardService {
  constructor(private prisma: PrismaService) {}

  async getLeaderBoardByLevel(res: Response, limit: number) {
    try {
      const data = await this.prisma.status.findMany({
        select: {
          player: {
            select: {
              id: true,
              nickname: true,
              avatar: true,
            },
          },
          level: true,
          experionPoints: true,
          rank: {
            select: {
              ranks: true,
              rankId: true,
            },
          },
        },
        take: limit,
        orderBy: [
          {
            level: 'desc',
          },
          {
            experionPoints: 'desc',
          },
        ],
      });

      return res.status(200).json(data);
    } catch (error) {
      return res.status(400).json({ error: 'An Error has occurred' });
    }
  }

  async getLeaderBoardByRank(res: Response, limit: number) {
    try {
      const data = await this.prisma.status.findMany({
        select: {
          player: {
            select: {
              id: true,
              nickname: true,
              avatar: true,
            },
          },
          level: true,
          experionPoints: true,
          rank: {
            orderBy: {
              current_points: 'desc',
            },
            select: {
              ranks: true,
              rankId: true,
              current_points: true,
            },
          },
        },
        take: limit,
        orderBy: {
          rank: {
            _count: 'desc',
          },
        },
      });

      return res.status(200).json(data);
    } catch (error) {
      return res.status(400).json({ error: 'An Error has occurred' });
    }
  }
}
