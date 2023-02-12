import { Body, Controller, Get, Post } from '@nestjs/common';
import { MatchService } from './match.service';

@Controller('match')
export class MatchController {
	constructor(private matchService: MatchService) {}

	@Get('loadGame')
	loadGame() {
		//history : 
		return 'leading Game . . .'
	}

	@Post('saveGame')
	saveGame(@Body() dto: any) {
		// add game :
		return 'saving Game . . .'
	}

}
