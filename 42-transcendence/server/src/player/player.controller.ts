import { Controller, Get } from '@nestjs/common';

@Controller('player')
export class PlayerController {

	@Get('me')
	getMe() {
		return 'i am a player';
	}
}
