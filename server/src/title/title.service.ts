import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as fs from 'fs';

@Injectable()
export class TitleService {
  constructor(private prisma: PrismaService) {}

    async fillTitles() {
    const fileContent = await fs.promises.readFile(
      'resources/title/title.json',
      'utf-8',
    );
    const jsonData = JSON.parse(fileContent);

    for (const item of jsonData) {
      try {
        const title = await this.prisma.titles.create({
          data: {
            name: item.name,
            requirement: item.requirement,
            description: item.description,
            effect: item.effect,
          },
        });
      } catch (error) {
        // console.log(error);
      }
    }
    return 'Done';
  }
  async assignTitle(statusId: number) {
    const titles = await this.prisma.titles.findMany({});

    for (let title of titles) {
      await this.prisma.titles_status.create({
        data: {
          titleId: title.id,
          statusId: statusId,
        },
      });
    }
  }
}
