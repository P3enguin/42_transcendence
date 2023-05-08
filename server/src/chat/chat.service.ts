import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Player } from '@prisma/client';
import { Response } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { JoinChannelDto } from './dto';

@Injectable()
export class ChatService {
  constructor(private jwt: JwtService, private prisma: PrismaService) {}

    // check if the receiver blocked, the player can send to anyone else
  SendPrivMessage(friendId: string, message: string)
  { 
      return ('SendPrivMessage');
  }
    
  SendPublicMessage(channelId: number, message: string)
  {
    return ('SendPublicMessage');
  }
    
  GetChannelMessage(channelId: number)
  {
      return ('GetChannelMessage');
  }
    
  GetPrivMessage(player: Player, friendId: any) {
    return '7oet_d9Z';
  }


  GetChatById(id: string) {}

  GetChat(player: Player) {}

  async CreateRoom(room: any) {
    const shortid = require('shortid');
    const roomId = shortid.generate();
    const player = await this.prisma.player.findUnique({
      where: {
        nickname: room.creator,
      },
    });
    console.log({ room });
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
      console.log('room created');
      return roomId;
    } catch (e) {
      console.log('error while creating new room', e);
      return 'no Room';
    }
  }

  async CreatePrivateChat(room: any) {
    const shortid = require('shortid');
    const roomId = shortid.generate();
    const name = room.player1 + room.creator;
    const checkRoom = await this.prisma.room.findFirst({
      where: {
        name: name,
      },
    });
    if (!checkRoom) {
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
              name: name,
              Key: room.Key,
              memberLimit: room.memberLimit,
              stats: 'private',
              IsChannel: false,
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
    return 'Room already existe';
  }

  async joinChannel(player: Player, JoinChannelDto: JoinChannelDto) {
    const { channelId, key } = JoinChannelDto;

    const channel = await this.prisma.room.findUnique({
      where: { channelId: channelId },
      select: {
        channelId: true,
        Key: true,
        memberLimit: true,
        member: true,
      },
    });

    if (!channel) {
      throw new Error('Invalid channel');
    }

    if (channel.Key && key !== channel.Key) {
      throw new Error('Invalid key');
    }

    if (
      channel.memberLimit &&
      channel.member.length + 1 > channel.memberLimit
    ) {
      throw new Error('Room is full');
    }

    const updatedRoom = await this.prisma.room.update({
      select: {
        channelId: true,
        name: true,
        Topic: true,
        memberLimit: true,
        stats: true,
        avatar: true,
      },
      where: { channelId: channelId },
      data: {
        member: { connect: { id: player.id } },
      },
    });

    await this.prisma.player.update({
      where: { id: player.id },
      data: {
        rooms: { connect: { channelId: channelId } },
      },
    });

    return updatedRoom;
  }

  async leaveChannel(player: Player, channelId: string) {
    const room = await this.prisma.room.findFirst({
      where: {
        channelId: channelId,
        member: {
          some: {
            id: player.id,
          },
        },
      },
    });

    if (!room) {
      throw new Error('Invalid room');
    }

    await this.prisma.room.update({
      where: { channelId: channelId },
      data: {
        member: { disconnect: { id: player.id } },
      },
    });

    await this.prisma.player.update({
      where: { id: player.id },
      data: {
        rooms: { disconnect: { channelId: channelId } },
      },
    });
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
