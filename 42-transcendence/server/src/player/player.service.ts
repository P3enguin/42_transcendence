import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { EditPlayerDto } from './dto';

@Injectable()
export class PlayerService {
	constructor(private prisma: PrismaService) {}

	async editPlayer(
		id: number,
		dto: EditPlayerDto,
	) {
		const player = await this.prisma.player.update({
			where: {
				id: id,
			},
			data: {
				...dto,
			},
		});
		return player;
	}
}
