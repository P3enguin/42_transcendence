import { Body, Controller, Get, Post } from '@nestjs/common';
import { MatchDto } from './dto/match.dto';
import { MatchService } from './match.service';


@Controller('match')
export class MatchController {
	constructor (private matchservice: MatchService) {}

	@Get('loadGame')
	loadGames() {
		return this.matchservice.loadGame();
	}

	@Get()
	loadGameById() {
		return this.matchservice.loadGamebyId();
	}

	@Post('saveGame')
	saveGame(@Body() dto : MatchDto) {
		return this.matchservice.saveGame(dto);
	}
}
