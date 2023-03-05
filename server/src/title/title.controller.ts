import { Controller, Post } from '@nestjs/common';
import { TitleService } from './title.service';

@Controller('title')
export class TitleController {
	constructor(private title: TitleService) {}
	
	@Post('title')
	async fillTitles() {
		return this.title.fillTitles();
	}
}
