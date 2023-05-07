import { Injectable, Req, Res } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Player } from '@prisma/client';
import { Request, Response } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private jwt: JwtService, private prisma: PrismaService) {}

  // check if the receiver blocked, the player can send to anyone else
  SendPrivMessage(friendId: string, message: string) {
    return 'SendPrivMessage';
  }

  SendPublicMessage(channelId: number, message: string) {
    return 'SendPublicMessage';
  }

  GetPrivMessage(player: Player, friendId: any) {
    return '7oet_d9Z';
  }

  GetChannelMessage(channelId: number) {
    return 'GetChannelMessage';
  }

  GetChatById(id: string) {}

  GetChat(player: Player) {}

  async getRoomInfo(roomId: string) {
    
  }

  async CreateRoom(room: any) {
    const check_room = await this.prisma.room.findUnique({
      where: {
        name: room.name,
      },
    });
    if (check_room)
      return check_room.channelId
    const shortid = require('shortid');
    const roomId = shortid.generate();
    const player = await this.prisma.player.findUnique({
      where: {
        nickname: room.creator,
      },
    });

    try {
      await this.prisma.room.create({
        data: {
          channelId: roomId,
          name: room.name,
          Topic: room.Topic,
          Key: room.Key,
          memberLimit: room.memberLimit,
          avatar:'BM.jpeg',
          stats: room.stats,
          IsChannel: true,
          adminId: player.id, // add null-check here
          member:{
            connect: [
              {id: player.id}
            ]
          }
        },
      });
      console.log('room created', roomId);
      return roomId.toString();
    } catch (e) {
      console.log('error while creating new room', e);
      return 'no Room';
    }
  }

  async getRoomByName(room: any) {
    const name1 = room.player1 + room.creator;
    const name2 = room.creator + room.player1;

    const checkRoom1 = await this.prisma.room.findFirst({
      where: {
        name: name1,
      },
    });
    const checkRoom2 = await this.prisma.room.findFirst({
      where: {
        name: name2,
      },
    });
    if (!checkRoom1 && !checkRoom2) 
      return this.CreatePrivateChat(room)
    if (checkRoom2)
      return checkRoom2.channelId;
    return checkRoom1.channelId;
    
  }

  async CreatePrivateChat(room: any) {
    const shortid = require('shortid');
    const roomId = shortid.generate();
    const name1 = room.player1 + room.creator;
    const name2 = room.creator + room.player1;

    const checkRoom1 = await this.prisma.room.findFirst({
      where: {
        name: name1,
      },
    });
    const checkRoom2 = await this.prisma.room.findFirst({
      where: {
        name: name2,
      },
    });
    if (!checkRoom1 && !checkRoom2) {
      console.log('new priv chat id', roomId);
      const player = await this.prisma.player.findUnique({
        where: {
          nickname: room.creator,
        },
      }); //<<---- get room first check if name exist  and quit
      if (player) {
        try {
          await this.prisma.room.create({
            data: {
              channelId: roomId,
              name: name1,
              Key: room.Key,
              memberLimit: room.memberLimit,
              stats: 'secret',
              IsChannel: false,
              avatar:'BL.jpeg',
              adminId: player.id, // add null-check here
              member: {
                connect: [
                  { nickname: room.player1 },
                  { nickname: room.creator },
                ],
              },
            },
          });
          console.log('room created');
          return roomId;
        } catch (e) {
          console.log('error while creating new room', e);
          return 'no Room';
        }
      } else return "can't create room for undefined user";
    }
    if (checkRoom1)
      return checkRoom1.channelId;
    return checkRoom2.channelId;
  }

  removeFromChat(nickname: string) {
    return 'removed From Chat';
  }

  async getDiscoveredRooms(res: Response) {
    try {
      let rooms = await this.prisma.room.findMany({
        select: {
          channelId: true,
          name: true,
          Topic: true,
          memberLimit: true,
          avatar: true,
          member: true,
        },
        where: {
          IsChannel: true,
          NOT: {
            stats: 'secret',
          },
        },
      });
      rooms = rooms.map((room) => ({
        ...room,
        memberCount: room.member.length,
      }));
      return res.status(200).json({ rooms });
    } catch (err) {
      console.log(err);
      return res.status(400).json({ error: err });
    }
  }
}
