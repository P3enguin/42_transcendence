import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { EditPlayerDto } from './dto';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { Response
 } from 'express';
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
	
	async getDataForProfile(id:number,res:Response){
		try {
			const prisma = await this.prisma.player.findUnique({
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
		}
		catch(err)
		{
			return res.status(400).json({error : err})
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

