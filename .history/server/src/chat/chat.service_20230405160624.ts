import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ChatService {
    constructor(
        private jwt:    JwtService,
        private prisma: PrismaService,
    ) {}


    // check if the receiver blocked, the player can send to anyone else
    SendPrivMessage(friendId: string, message: string)
    {
       return ('SendPrivMessage');
    }
    
    SendPublicMessage(channelId: number, message: string)
    {
        return ('SendPublicMessage');
    }
    
    GetPrivMessage(friendId: number)
    {
        return ('GetPrivMessage');
    }
    
    GetChannelMessage(channelId: number)
    {
        return ('GetChannelMessage');
    }
    JoinPrivateChat(player)
}
