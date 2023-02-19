import { Body, Controller, Get, Post } from '@nestjs/common';
import { GetPlayer } from 'src/auth/decorator';
import { MatchDto } from './dto/match.dto';
import { MatchService } from './match.service';


@Controller('match')
export class MatchController {
	constructor (private matchservice: MatchService) {}

	@Get()
	loadGames(@GetPlayer() playerId: number) {
		return this.matchservice.loadGame(
			playerId,
		);
	}

	@Post('saveGame')
	saveGame(@Body() dto : MatchDto) {
		return this.matchservice.saveGame(dto);
	}
}
