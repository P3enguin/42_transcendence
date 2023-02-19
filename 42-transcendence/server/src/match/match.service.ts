import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { match } from 'assert';
import { PrismaService } from 'src/prisma/prisma.service';
import { MatchDto } from './dto/match.dto';

@Injectable()
export class MatchService {
	constructor(private prisma: PrismaService) {}

	async saveGame(dto: MatchDto) {

		try{
			const match = await this.prisma.matchs.create({
				data: {
					winner: dto.winner,
					loser: dto.loser,
					scoor: dto.scoor,
				},
			});
		}catch (error) {
			if (
			  error instanceof
			  PrismaClientKnownRequestError
			) {
			  if (error.code === 'P2002') {
				throw new ForbiddenException(
				  'Credentials taken',
				);
			  }
			}
			throw error;
		  }
		  console.log({
			"=> " :
			match,
		  })
		return match;
	}

	async loadGame(email: string) {
		const player = await this.prisma.player.findUnique({
			where: {
				email
			},
			include: {
				wins: true,
				loss: true,
			}
		   });
		let matchs = player.loss.concat(player.wins);
		return matchs.sort((a, b) => a.id - b.id);
	}
}
