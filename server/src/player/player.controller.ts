import { Controller, Get, UseGuards,Post,UploadedFile,UseInterceptors,Req,Res, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Player } from '@prisma/client'
import { JwtGuard } from 'src/auth/guard';
import { PlayerService } from './player.service';
import { GetPlayer } from 'src/auth/decorator';
import { diskStorage } from 'multer';
import { extname } from  'path';
import { v4 as uuidv4 } from 'uuid';
import { Request,Response } from 'express';


@UseGuards(JwtGuard)
@Controller('players')
export class PlayerController {
	
	constructor(private playerService: PlayerService) {}
	
	@Get('me')
	getMe(@Req() req: Request) {
		return req.body.jwtDecoded;
	}
	

	@Get('data')
	getData(@Req() req:Request,@Res() res:Response){
		return this.playerService.getDataForProfile(req.body.jwtDecoded.nickname as string,res)
	}

	@Post('avatar')
	@UseInterceptors(FileInterceptor('file',
		{storage: diskStorage({
		destination: process.cwd() + "/uploads/avatars/",
		filename: (req, file, cb) => {
			const randomName = uuidv4();
			 cb(null, `${randomName}${extname(file.originalname)}`)
		  }
		}),
		limits: {
			fieldSize:2
		}}))
		uploadProfile(@Req() req: Request, @UploadedFile() file: Express.Multer.File){
		return this.playerService.updatePFP(req,file.filename);
	}

	@Post('wallpaper')
	@UseInterceptors(FileInterceptor('file',
		{storage: diskStorage({
		destination: process.cwd() + "/uploads/wallpapers/",
		filename: (req, file, cb) => {
			const randomName = uuidv4();
			cb(null, `${randomName}${extname(file.originalname)}`)
		  }
		}),
		limits: {
			fieldSize:2
		}}))
	  uploadBackGround(@Req() req :Request, @UploadedFile() file: Express.Multer.File){
		return this.playerService.updateWallpaper(req,file.filename);
	}

	@Get('avatar')
	GetProfileImage(@Query() query,@Res() res:Response)
	{
		const fileName = query.pfp;
		return res.sendFile(process.cwd() + "/uploads/avatars/"  + fileName);
	}

	@Get('wallpaper')
	GetWallPaperImage(@Query() query,@Res() res:Response)
	{
		const fileName = query.wp;
		return res.sendFile(process.cwd() + "/uploads/wallpapers/" + fileName);
	}
}
