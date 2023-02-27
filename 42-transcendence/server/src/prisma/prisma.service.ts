import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaClient, Status } from '@prisma/client'
import { AuthDto } from './dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { AchivementService } from 'src/achivement/achivement.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class PrismaService extends PrismaClient {
	constructor (
		private achiv: AchivementService,
		private jwt: JwtService,
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

	async createPlayer(dto: AuthDto) {		
		try{
			const achive = await this.achiv.fillAvhievememt();
			const player = await this.player.create({
				data: {
					email: dto.email,
					nickname:	dto.nickname,
					status: {
						create: {
							achivement: achive,
						},
					},
				},
			});
			return this.signToken(player.id, player.email);
		}catch(err){
			if (err instanceof PrismaClientKnownRequestError) {
				if (err.code === 'P2002') {
					throw new ForbiddenException('Players information incorrect');
				}
			}
			throw err;
		}
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


	async signToken(
		playerId: number,
		email: string,
	  ): Promise<{ access_token: string }> {
		const payload = {
		  sub: playerId,
		  email,
		};
		const secret = this.config.get('JWT_SECRET');
	
		const token = await this.jwt.signAsync(
		  payload,
		  {
			expiresIn: '15m',
			secret: secret,
		  },
		);
		return {
		  access_token: token,
		};
	  }


}
