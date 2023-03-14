import { Injectable } from '@nestjs/common';
import { PrismaClient, Status } from '@prisma/client'
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs'

@Injectable()
export class PrismaService extends PrismaClient {
	constructor (
		private config: ConfigService,
	) {
		super ({
			datasources: {
				db: {
					url: config.get('DATABASE_URL')
				},
			},
		});
	}

	GetStatus(statusId: number): Promise<Status> {
		const status = this.status.findUnique({
			where :{
				id: statusId,
			},
		});
		console.log({
			status
		})
		return status;
	}

	/********* Achievement /*********/

	//--> auto fill the achievement : 

	async fillAvhievememt()
	{
		const fileContent = await fs.promises.readFile('resources/achievements/achiev.json', 'utf-8');
		const jsonData = JSON.parse(fileContent);

		for (const item of jsonData) {
			try{
				const achiv = await this.achivement.create({
					data: {
						name:			item.name,
						icon:			item.icon,
						description:	item.description,
						effect:			item.effect, 
					  },
				});
			}catch(error) {
				console.log("Failed to upload the achievements");
			}
		}
		console.log("Achievements uploaded successefuly !");
		return jsonData;
	}

	//--> Link achievement to player : 

	async asignAchivement(statusId: number) {
		const achiv = await this.achivement.findMany({});
		for (const achv of achiv) {
			await this.achivement_status.create({
				data: {
					achivId: achv.id,
					statusId: statusId,
				},
			});
		}
	}

	/********* Title *********/

	async fillTitles() {
		const fileContent = await fs.promises.readFile('resources/title/title.json', 'utf-8');
		const jsonData = JSON.parse(fileContent);

		for (const item of jsonData) {
			try{
				const achiv = await this.titles.create({
					data: {
						name:			item.name,
						requirement:	item.requirement,
						description:	item.description,
						effect:			item.effect, 
					  },
				});

			}catch(error)
			{
				console.log(" Failed to upload the Titles");
			}
		}
		return "Titles uploaded successefuly !";
	}

	//--> Link Titles to player : 

	async asignTitles(statusId: number) {
		const achiv = await this.achivement.findMany({});
		for (const achv of achiv) {
			await this.achivement_status.create({
				data: {
					achivId: achv.id,
					statusId: statusId,
				},
			});
		}
	}

}

