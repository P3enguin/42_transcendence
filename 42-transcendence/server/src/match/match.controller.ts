import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { Player } from '@prisma/client';
import { GetPlayer } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { MatchDto } from './dto/match.dto';
import { MatchService } from './match.service';

@UseGuards(JwtGuard)
@Controller('match')
export class MatchController {
	constructor (private matchservice: MatchService) {}

	@Get('loadGame')
	loadGames(@GetPlayer() player: Player) {
		console.log("email", player);
		return this.matchservice.loadGame(
			player.email,
		);
	}

	@Post('saveGame')
	saveGame(@Body() dto : MatchDto) {
		return this.matchservice.saveGame(dto);
	}
}
