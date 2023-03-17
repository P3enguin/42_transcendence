import { Controller, Get, Post } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
    constructor(
        private chatService: ChatService,
    ) {}
    
    @Post('sendMessage')
    SendPrivMessage(friendId: string, message: string)
    {
        return this.chatService.sendPrivMessage(friendId, message);
    }

    @Post('ChannelMessage')
    SendPublicMessage(channelId: number, message: string)
    {
        return this.chatService.sendPublicMessage(channelId, message);
    }

    @Get('privateMessages')
    GetPrivMessage(friendId: number)
    {
        return this.chatService.getPrivateMessage(friendId);
    }

    @Get('channelMessages')
    GetChannelMessage(channelId: number)
    {
        return this.chatService.getChannelMessage(channelId);
    }
}
