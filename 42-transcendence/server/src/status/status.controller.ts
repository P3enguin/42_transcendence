import { Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { Player } from '@prisma/client';
import { GetPlayer } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';

@UseGuards(JwtGuard)
@Controller('status')
export class StatusController {
	constructor() {}

	@Post()
	linkStatus() {}

	@Patch(':id')
	UpdateStatus() {}

	@Get('my_status')
	loadStatus(@GetPlayer() player: Player) {
		return "player's Status . . ."
	}
}
