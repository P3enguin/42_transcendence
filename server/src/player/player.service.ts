import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { EditPlayerDto } from './dto';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
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
		console.log(token);
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


	//-----------------------------------{ FRIEND }-----------------------------------\\
	//-----------------------------------{ Add a fried }
	
	AddFriend(playerId :number, friendId: number) {
		const check_friend = this.prisma.player.findUnique({
			where: {
				id: friendId,
			},
		});
		if (!check_friend)
		{
			return this.prisma.player.update({
				where: {
					id: playerId,
				},
				data:{
					friends: {
						connect: {
							id: friendId,
						},
					},
				},
			});
			console.log("Friend added !", friendId);
		}
		else
			console.log(friendId,"exist !");

	}

	//-----------------------------------{ get the list if all friends }
	
	async GetFriends(playerId: number) {
		const FriendList =  await this.prisma.player.findUnique({
			where: {
				id: playerId,
		},
		include: {
			friends: true,
		},
	});
	return FriendList;
}
//-----------------------------------{ Block }-----------------------------------\\
//-----------------------------------{ block a friends }

BanFriend(playerId: number, friendId: number) {
	const friend = this.prisma.player.findFirst({
		where: {
			id: playerId,
			friends: {
				some: {
					id: friendId,
				},
			},
		},
	});
		if (!friend)
			console.log("No friend!");
			return this.prisma.player.update({
				where: {
					id:playerId,
				},
				data:{
					block: {
						connect:{
							id: friendId,
						}
					},
				},
			});
		}
	}

	//-----------------------------------{  }