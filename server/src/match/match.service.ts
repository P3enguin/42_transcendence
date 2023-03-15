import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaService } from 'src/prisma/prisma.service';
import { MatchDto } from './dto/match.dto';

@Injectable()
export class MatchService {
	constructor(private prisma: PrismaService) {}

	async saveGame(dto: MatchDto) {
		// console.log({
		// 	dto,
		// })
		try{
			const match = await this.prisma.matchs.create({
				data: {
					winner: dto.winner,
					loser: dto.loser,
					scoor: dto.scoor,
					...dto,
				},
				include: {
					loserId: true,
					winnerId: true,
				}
			});
			return match;
		}catch (error) {
			if (
			  error instanceof
			  PrismaClientKnownRequestError
			) {
			  if (error.code === 'P2002') {
				throw new ForbiddenException (
				  'Credentials taken',
				);
			  }
			}
			throw error;
		  }
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
