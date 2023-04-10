import { Injectable, Req, Res } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Player } from '@prisma/client';
import { Request, Response } from 'express';
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

    async CreateRoom(player: Player, room: any) {
        const shortid = require('shortid');
        const roomId  = shortid.generate();
        console.log(room);
        try {
         await this.prisma.room.create({
          data: {
            channelId: roomId,
            name: room.name,
            Topic: room.Topic,
            Key: room.Key,
            memberLimit: room.memberLimit,
            stats: room.stats,
            IsChannel: true,
            adminId: player.id,
          },
        });
        console.log("room created");
        return roomId; 
        }catch(e){
            console.log("error while creating new room");
            return "no Room";
            }
            
        // return "not even closed";
        }
}
