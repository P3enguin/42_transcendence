import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { Player } from '@prisma/client';
@Injectable()
export class PlayerService {
	constructor(private jwt :JwtService, private prisma: PrismaService) {}

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
	
	Get_Player(req: Request) {
		const token = req.cookies["jwt_token"];
		try {
			const secret = process.env.JWT_SECRET;
			const decoded = this.jwt.verify(token,{secret});
			const player = this.prisma.player.findUnique({
				where: {
					id: decoded.sub,
				},
			});
			return decoded;
		}
		catch (err)
		{
			console.log (err);
		}
	}
	//-----------------------------------{ Add a fried }
	
	async AddFriend(req: Request, friendId: number) {
		const player = this.Get_Player(req);
		console.log({
			player,
		})
		const check_friend  = await this.prisma.player.findUnique({
			where: {
			  id: player.sub,
			},
			select: {
			  friends: {
				select: {
				  id: true,
				},
			  },
			  block: {
				select: {
					id: true,
				}
			  }
			},
		  });
		if (!check_friend.friends.some(f => f.id === friendId))
		{
			this.prisma.player.update({
				where: {
					id: player.sub,
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
			return "Friend added successfully"
		}
		else
		{
			console.log(friendId,"exist !");
			return "Friend already exist !";
		}

	}

	//-----------------------------------{ get the list if all friends }
	
	async GetFriends(req: Request) {
		const player = this.Get_Player(req);
		const FriendList =  await this.prisma.player.findUnique({
			where: {
				id: player.sub,
		},
		include: {
			friends: true,
		},
	});
	return FriendList;
}
//-----------------------------------{ Block }-----------------------------------\\
//-----------------------------------{ block a friends }

async BlockFriend(req: Request, friendId: number) {
		const player = this.Get_Player(req);
		const check_friend  = await this.prisma.player.findUnique({
			where: {
			  id: player.sub,
			},
			select: {
			  friends: {
				select: {
				  id: true,
				},
			  },
			},
		  });
		if (check_friend.friends.some(f => f.id === friendId)){
			try {
				await this.prisma.player.update({
					where: {
						id:player.sub,
					},
					data:{
						friends: {
							disconnect: {
								id: friendId,
							},
						},
						block: {
							connect:{
								id: friendId,
							}
						},
					},
				});
			}catch (err){
				console.log("friend doesn't exist!", err);
			}
			return" friend Blocked";
		}
		else
			return("friend doesn't exist!");

	}
		
	async GetBlockedFriends(req: Request) {
	const player = this.Get_Player(req);
	const BlockedList =  await this.prisma.player.findUnique({
				where: {
					id: player.sub,
			},
			include: {
				block: true,
			},
		});
		return BlockedList;
	}
}
		//-----------------------------------{  }