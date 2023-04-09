import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { GetPlayer } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { Player } from '@prisma/client';
import { Response } from 'express';

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
	GetPrivMessage(@Param('nickname') nickname)
	{
		console.log("======>",nickname);
		return this.chatService.GetPrivMessage(2);
	}

	@Get('channelMessages')
	GetChannelMessage(channelId: number)
	{
		return this.chatService.GetChannelMessage(channelId);
	}

}
