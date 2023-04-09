import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as fs from 'fs'
@Injectable()
export class RankService {
    constructor(
        private prisma: PrismaService,
    ) {}

    async fillRanks() {
        const fileContent = await fs.promises.readFile('resources/title/ranks.json', 'utf-8');
        const jsonData = JSON.parse(fileContent);

        for (const item of jsonData) {
            try {
                await this.prisma.ranks.create({
                    data: {
                        name: item.name,
                        points: item.points,
                        avatar: item.avatar,
                    },
                });
            }catch(error) {
                console.log(error);
            }
        }
        return "Done !";
    }
    async assignRanks(statusId: number){
		const rank = await this.prisma.titles.findMany({});

		for (let title of titles)	{
			await this.prisma.titles_status.create({
				data: {
				titleId: title.id,
				statusId: statusId,
				},
			});
    	}
	}
}
