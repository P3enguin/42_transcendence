import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { EditPlayerDto } from './dto';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Response
 } from 'express';
import { AuthDto } from 'src/prisma/dto';
import * as argon2 from "argon2"
@Injectable()
export class PlayerService {
	constructor(private jwt :JwtService, private prisma: PrismaService) {}

	async editPlayer(
		id: number,
		dto: EditPlayerDto,
	) {
		const player = await this.prisma.player.update({
			where: {
				id: id,
			},
			data: {
				...dto,
			},
		});
		return player;
	}
	
	async getDataNickname(nickname:string,res:Response){
		try {
			const player = await this.prisma.player.findUnique({
				where : {
					nickname : nickname,
				},
				select : {
					id:true,
					nickname:true,
					firstname:true,
					lastname:true,
					coins:true,
					avatar:true,
					wallpaper:true,
					joinAt:true,
				}
			})
			return res.status(200).json({player});
		}
		catch(err)
		{
			console.log(err);
			return res.status(400).json({error : err})
		}
	}

	
	
	async getDataID(id:number,res:Response){
		try {
			const player = await this.prisma.player.findUnique({
				where : {
					id : id,
				},
				select : {
					id:true,
					nickname:true,
					firstname:true,
					lastname:true,
					coins:true,
					avatar:true,
					wallpaper:true,
					joinAt:true,
				}
			})
			return res.status(200).json({player});
		}
		catch(err)
		{
			console.log(err);
			return res.status(400).json({error : err})
		}
	}
	
	async changeData(data : any, res:Response){
		try {
			await this.prisma.player.update({
				where : {
					id : data.jwtDecoded.sub,
				},
				data : {
					nickname:data.nickname,
					firstname:data.firstname,
					lastname:data.lastname,
				}
			})
			return res.status(201).json({success:"Data has been changed"})
		}
		catch (e)
		{
			var error ;
			if (e instanceof PrismaClientKnownRequestError) {
				if (e.code === 'P2002') {
				  error =  "Nickname already exist";
				}
				else {
				  error = "An Error has occured";
				}
			  }
			  // error handling for invalid session token
			return res.status(400).send(JSON.stringify({error: error}));
		}
	}
	
	async changePassowrd(data : any ,res:Response){
		try {
			const hash = await argon2.hash(data.password);
			console.log(hash);
			await this.prisma.player.update({
				where : {
					id : data.jwtDecoded.sub,
				},
				data : {
					password:hash,
				}
			})
			return res.status(201).json({success:"Password changed successfully"});
		}
		catch(err)
		{
			console.log(err);
			return res.status(400).json({error : "An error has occured"})
		}
	}
	async updatePFP(req : Request,fileName: string) {
		const token = req.cookies["jwt_token"];
		/* not necessary , we already using auth guard
			 but protection is good , Highly recommended */
		try {
			const secret = process.env.JWT_SECRET;
			const decoded = this.jwt.verify(token,{secret});
			 await this.prisma.player.update({
				where : {
					id : decoded.sub,
				},
				data : {
					avatar : fileName,
				}
			})
		}
		catch (err)
		{
			console.log(err);
		}
	}

	async updateWallpaper(req : Request, fileName: string) {
		const token = req.cookies["jwt_token"];
		try {
			const secret = process.env.JWT_SECRET;
			const decoded = this.jwt.verify(token,{secret});
			 await this.prisma.player.update({
				where : {
					id : decoded.sub,
				},
				data : {
					wallpaper : fileName,
				}
			})
		}
		catch (err)
		{
			console.log (err);
		}
	}
}

