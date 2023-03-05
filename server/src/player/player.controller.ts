import { Controller, Get, UseGuards } from '@nestjs/common';
import { Player } from '@prisma/client'
import { JwtGuard } from 'src/auth/guard';
import { PlayerService } from './player.service';
import { GetPlayer } from 'src/auth/decorator';

@UseGuards(JwtGuard)
@Controller('players')
export class PlayerController {

	constructor(private playerService: PlayerService) {}

	@Get('me')
	getMe(@GetPlayer() player: Player) {
		return player
	}
}
