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
    SendPrivMessage(friendId: number, message: string)
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

    async CreateRoom(room: any) {
        const shortid = require('shortid');
        const roomId  = shortid.generate();
        const player = await this.prisma.player.findUnique({
          where:{
            nickname: room.creator,
          },
        });
        console.log({room});
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
              adminId: player.id, // add null-check here
            },
          });
          console.log("room created");
          return roomId; 
        } catch(e) {
          console.log("error while creating new room", e);
          return "no Room";
        }
      }
    async CreatePrivateChat(room: any) {
        const shortid = require('shortid');
        const roomId  = shortid.generate();
        const name = room.player1+room.creator;
        const checkRoom = await this.prisma.room.findFirst({
          where:{
            name: name,
          }
        });
        if (!checkRoom)
        {
          console.log("new priv chat id",roomId);
          const player = await this.prisma.player.findUnique({
            where:{
            nickname: room.creator,
          },
        }); //<<---- get room first check if name exist  and quit
        if (player)
        {
          try {
            await this.prisma.room.create({
             data: {
               channelId: roomId,
                name: name,
                Key: room.Key,
                memberLimit: room.memberLimit,
                stats: "private",
                IsChannel: false,
                adminId: player.id, // add null-check here
                member: {
                connect: [
                  { nickname: room.player1 },
                  { nickname: room.creator },
                ],
              }
            },
          });
          console.log("room created");
          return roomId; 
        } catch(e) {
          console.log("error while creating new room", e);
          return "no Room";
        }
        }else
        return ("can't create room for undefined user")
      }
      return "Room already existe";
    }

  removeFromChat(nickname : string) {
         return "removed From Chat";
  }
}
