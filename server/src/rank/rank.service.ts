import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as fs from 'fs';
@Injectable()
export class RankService {
  constructor(private prisma: PrismaService) {}

  async fillRanks() {
    const fileContent = await fs.promises.readFile(
      'resources/ranks/ranks.json',
      'utf-8',
    );
    const jsonData = JSON.parse(fileContent);
    for (const item of jsonData) {
      try {
        await this.prisma.ranks.create({
          data: {
            name: item.name,
            points: Number(item.points),
            avatar: item.avatar,
          },
        });
      } catch (error) {
        console.log(error);
      }
    }
    return 'Done !';
  }

  async assignRanks(statusId: number) {
    const ranks = await this.prisma.ranks.findMany({});
    for (let rank of ranks) {
      await this.prisma.ranks_status.create({
        data: {
          rankId: rank.id,
          statusId: statusId,
        },
      });
    }
  }
}
