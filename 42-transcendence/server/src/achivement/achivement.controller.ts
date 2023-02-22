import { Controller, Post } from '@nestjs/common';
import { AchivementService } from './achivement.service';

@Controller('achivement')
export class AchivementController {
	constructor(private achievement: AchivementService) {}

	@Post('achiv')
	async fillAvhievememt() {
		return this.achievement.fillAvhievememt();
	}
}

