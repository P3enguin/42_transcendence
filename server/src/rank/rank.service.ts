import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as fs from 'fs';
@Injectable()
export class RankService {
  constructor(private prisma: PrismaService, private readonly logger: Logger) {
    this.logger = new Logger(RankService.name, { timestamp: true });
  }

  async fillRanks() {
    this.logger.log('Filling ranks');
    const fileContent = await fs.readFileSync(
      'resources/ranks/ranks.json',
      'utf-8',
    );
    const jsonData = JSON.parse(fileContent);
    for (const item of jsonData) {
      try {
        await this.prisma.rank.create({
          data: {
            id: item.id,
            name: item.name,
            points: item.points,
            avatar: item.avatar,
          },
        });
      } catch (err) {
        if (err.code === 'P2002') {
          this.logger.warn(`Ranks already exists`);
          return;
        }
        this.logger.error(err.message);
      }
    }
    return 'Done !';
  }

  async assignRanks(statusId: number) {
    await this.prisma.rank_status.create({
      data: {
        statusId: statusId,
      },
    });
  }
}
