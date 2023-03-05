import { Injectable } from '@nestjs/common';
import { PrismaClient, Status } from '@prisma/client'
import { ConfigService } from '@nestjs/config';

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

}
