import { Controller, Get, UseGuards,Post,UploadedFile,UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Player } from '@prisma/client'
import { JwtGuard } from 'src/auth/guard';
import { PlayerService } from './player.service';
import { GetPlayer } from 'src/auth/decorator';
import { diskStorage } from 'multer';
import { extname } from  'path';
import { limits } from 'argon2';
import { v4 as uuidv4 } from 'uuid';


// @UseGuards(JwtGuard)
@Controller('players')
export class PlayerController {

	constructor(private playerService: PlayerService) {}

	@Get('me')
	getMe(@GetPlayer() player: Player) {
		return player
	}
	
	@Post('profile')
	@UseInterceptors(FileInterceptor('file',
		{storage: diskStorage({
		destination: process.env.PROFILE_UPLOADS_PATH,
		filename: (req, file, cb) => {
			const randomName = uuidv4();
			 cb(null, `${randomName}${extname(file.originalname)}`)
		  }
		}),
		limits: {
			fieldSize:2
		}}))
	  uploadProfile(@UploadedFile() file: Express.Multer.File){
		console.log(file);
	}

	@Post('wallpaper')
	@UseInterceptors(FileInterceptor('file',
		{storage: diskStorage({
		destination: process.env.WALLPAPER_UPLOADS_PATH,
		filename: (req, file, cb) => {
			const randomName = uuidv4();
			cb(null, `${randomName}${extname(file.originalname)}`)
		  }
		}),
		limits: {
			fieldSize:2
		}}))
	  uploadBackGround(@UploadedFile() file: Express.Multer.File){
		console.log(file);
	}


}
