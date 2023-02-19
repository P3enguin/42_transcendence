import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { PrismaService } from 'src/prisma/prisma.service';
import { MatchDto } from './dto/match.dto';

@Injectable()
export class MatchService {
	constructor(private prisma: PrismaService) {}

	async saveGame(dto: MatchDto) {
		console.log({
			"saving ":
			dto,
		})
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
		return 'Saved successfully !'
	}

	async loadGame(playerId: number) {
		console.log({
			"loading player ": playerId,
		})
		const matchs = await this.prisma.matchs.findMany({
			where: {OR: [{winner: playerId},{loser: playerId}]}
		});
		console.log({
			"match " :
			matchs,
		})
		return matchs;
	}
}
