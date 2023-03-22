import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { Player } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Response
 } from 'express';
import { AuthDto } from 'src/prisma/dto';
import * as argon2 from "argon2"
@Injectable()
export class PlayerService {
	constructor(private jwt :JwtService, private prisma: PrismaService) {}

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