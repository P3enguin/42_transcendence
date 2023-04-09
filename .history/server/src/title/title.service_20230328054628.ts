import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as fs from 'fs'

@Injectable()
export class TitleService {
	constructor(
		private prisma: PrismaService,
	) {}

	async fillTitles() {
		const fileContent = await fs.promises.readFile('resources/title/title.json', 'utf-8');
		const jsonData = JSON.parse(fileContent);

		for (const item of jsonData) {
			try{
				const achiv = await this.prisma.titles.create({
					data: {
						name:			item.name,
						requirement:	item.requirement,
						description:	item.description,
						effect:			item.effect, 
					  },
				});

			}catch(error)
			{
				// console.log("titles");
			}
		}
		return "Done";
	}
	async asignTitle(statusId: number){
		const achiv = await this.prisma.achivement.findMany({});

		for (let achv of achiv)	{
      // console.log({"achivId": achv.id,})
      await this.prisma.achivement_status.create({
        data: {
          achivId: achv.id,
          statusId: statusId,
        },
      });
    }
	}
}
