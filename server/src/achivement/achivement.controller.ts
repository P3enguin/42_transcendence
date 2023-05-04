import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { Player } from '@prisma/client';
import { GetPlayer } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { AchivementService } from './achivement.service';

@UseGuards(JwtGuard)
@Controller('achivement')
export class AchivementController {
	constructor(private achievement: AchivementService) {}

	@Post('achiv')
	async fillAvhievememt() {
		return this.achievement.fillAvhievememt();
	}
}

