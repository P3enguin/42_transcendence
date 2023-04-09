import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Player } from '@prisma/client';
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
    
    GetPrivMessage(player: Player, friendId: any)
    {
        return ('7oet_d9Z');
    }
    
    GetChannelMessage(channelId: number)
    {
        return ('GetChannelMessage');
    }
    
    GetChatById(id: string) {

    }

    GetChat(player: Player) {
        
    }
}
