import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { GetPlayer } from 'src/auth/decorator';
import { Request, Response } from 'express';
import { Player } from '@prisma/client';
import { JwtGuard } from 'src/auth/guard';

// @UseGuards(JwtGuard)
@Controller('chat')
export class ChatController {
	constructor(
		private chatService: ChatService,
	) {}

	@Post('sendMessage')
	SendPrivMessage(friendId: number, message: string)
	{
		return this.chatService.SendPrivMessage(friendId, message);
	}

	@Post('ChannelMessage')
	SendPublicMessage(channelId: number, message: string)
	{
		return this.chatService.SendPublicMessage(channelId, message);
	}

	@Get('privateMessages')
	GetPrivMessage(@GetPlayer() player: Player, @Req() req: Request, @Res() res: Response)
	{
		const message = this.chatService.GetPrivMessage(player, req.query.friendId);
		res.json(message);
	}

	@Get('channelMessages')
	GetChannelMessage(channelId: number)
	{
		return this.chatService.GetChannelMessage(channelId);
	}

	@Get('messages')
	GetChatById(id: string)
	{
		return this.chatService.GetChatById(id);
	}

	@Get('allChat')
	GetChat(@GetPlayer() player: Player)
	{
		return "full chat";
	}

	@Post('CreateRoom')
    CreateRoom(@Req() req: Request, @Res() res: Response) {
		const room = req.body;
		const roomId = this.chatService.CreateRoom(room);
		res.status(200).json(roomId);
    }

	@Post('CreatePrivateChat')
    CreatePrivateChat(@Req() req: Request, @Res() res: Response) {
		const room = req.body;
		const roomId = this.chatService.CreatePrivateChat(room);
		res.status(200).json(roomId);
    }
}
