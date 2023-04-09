import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { GetPlayer } from 'src/auth/decorator';
import { Request, Response } from 'express';
import { Player } from '@prisma/client';

@Controller('chat')
export class ChatController {
	constructor(
		private chatService: ChatService,
	) {}

	@Post('sendMessage')
	SendPrivMessage(friendId: string, message: string)
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
		return this.chatService.GetPrivMessage(player, req.query.friendId);
	}

	@Get('channelMessages')
	GetChannelMessage(channelId: number)
	{
		return this.chatService.GetChannelMessage(channelId);
	}

	@Get('getChat')
	GetChat

}
