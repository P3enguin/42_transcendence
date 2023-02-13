import { Body, Controller, Get, Post } from '@nestjs/common';
import { MatchDto } from './dto/match.dto';
import { MatchService } from './match.service';


@Controller('match')
export class MatchController {
	constructor (private matchservice: MatchService) {}

	@Get('loadGame')
	loadGame() {
		return this.matchservice.loadGame();
	}
	@Post('saveGame')
	saveGame(@Body() dto : MatchDto) {
		console.log(dto.players[5]);
		return this.matchservice.saveGame(dto);
	}
}
