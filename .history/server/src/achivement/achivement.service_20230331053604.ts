import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as fs from 'fs'

@Injectable()
export class AchivementService {
	constructor(
		private prisma: PrismaService,
	) {}

	async fillAvhievememt()
	{
		const fileContent = await fs.promises.readFile('resources/achievements/achiev.json', 'utf-8');
		const jsonData = JSON.parse(fileContent);

		for (const item of jsonData) {
			try{
				const achiv = await this.prisma.achivement.create({
					data: {
						name:			item.name,
						icon:			item.icon,
						description:	item.description,
						effect:			item.effect, 
					  },
				});
			}catch(error) {
        // console.log("achivement failed");
      }
		}
		// console.log("Achievement Loaded successefuly !");
		return jsonData;
	}

	async assignAchiv(statusId: number){
		const achiv = await this.prisma.achivement.findMany({});

		for (let achv of achiv)	{
      	await this.prisma.achivement_status.create({
        data: {
          achivId: achv.id,
          statusId: statusId,
        },
      });
    }
	}

}
