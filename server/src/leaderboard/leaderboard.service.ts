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
          XP: true,
          rank: {
            select: {
              rank: true,
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
            XP: 'desc',
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
          XP: true,
          rank: {
            select: { 
              
            }
          }
        },
        take: limit,
      });

      return res.status(200).json(data);
    } catch (error) {
      return res.status(400).json({ error: 'An Error has occurred' });
    }
  }
}