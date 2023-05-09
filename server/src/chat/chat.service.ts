import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Player } from '@prisma/client';
import { Response } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { BanMemberDto, JoinChannelDto } from './dto';

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
          topic: room.Topic,
          key: room.Key,
          memberLimit: room.memberLimit,
          stats: room.stats,
          isChannel: true,
          ownerId: player.id, // add null-check here
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
              key: room.Key,
              memberLimit: room.memberLimit,
              stats: 'private',
              isChannel: false,
              ownerId: player.id, // add null-check here
              members: {
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
        key: true,
        memberLimit: true,
        members: true,
        bans: {
          where: { playerId: player.id },
        },
      },
    });

    if (!channel) {
      throw new Error('Invalid channel');
    }

    if (channel.key && key !== channel.key) {
      throw new Error('Invalid key');
    }

    if (channel.bans.length > 0) {
      throw new Error('You are banned from this room');
    }

    if (
      channel.memberLimit &&
      channel.members.length + 1 > channel.memberLimit
    ) {
      throw new Error('Room is full');
    }

    const updatedRoom = await this.prisma.room.update({
      select: {
        channelId: true,
        name: true,
        topic: true,
        memberLimit: true,
        stats: true,
        avatar: true,
      },
      where: { channelId: channelId },
      data: {
        members: { connect: { id: player.id } },
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
        members: {
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
        members: { disconnect: { id: player.id } },
      },
    });

    await this.prisma.player.update({
      where: { id: player.id },
      data: {
        rooms: { disconnect: { channelId: channelId } },
      },
    });
  }

  async banMember(player: Player, banMemberDto: BanMemberDto) {
    const { channelId, memberNickname, reason } = banMemberDto;

    // Find if room exists
    const channel = await this.prisma.room.findUnique({
      select: {
        id: true,
        owner: true,
        admins: true,
        members: true,
      },
      where: {
        channelId: channelId,
      },
    });

    if (!channel) {
      return {
        status: 404,
        data: { error: 'Unknown Channel' },
      };
    }

    // Checking if user is an administrator
    if (!channel.admins.find((channelAdmin) => channelAdmin.id === player.id)) {
      return {
        status: 403,
        data: { error: "You don't have permissions to ban users" },
      };
    }

    // Find if the user to ban exists
    const member = await this.prisma.player.findUnique({
      where: {
        nickname: memberNickname,
      },
    });

    if (!member) {
      return {
        status: 404,
        data: { error: 'Unknown User' },
      };
    }

    // Check if the user is a member of the room
    if (
      !channel.members.find((channelMember) => channelMember.id === member.id)
    ) {
      return {
        status: 404,
        data: { error: 'User is not a member of the channel' },
      };
    }

    // Prevent admins from banning owner and other admins
    if (
      channel.owner.id === member.id ||
      (channel.owner.id !== player.id &&
        channel.admins.find((channelAdmin) => channelAdmin.id === member.id))
    ) {
      return {
        status: 403,
        data: { error: "You don't have permissions to ban this user" },
      };
    }

    // Performing the ban on the channel member
    const ban = await this.prisma.ban.create({
      data: {
        channel: {
          connect: { id: channel.id },
        },
        player: {
          connect: { id: member.id },
        },
        reason: reason,
      },
    });

    if (!ban) {
      return {
        status: 500,
        data: { error: 'An error occurred while banning the member' },
      };
    }

    // Remove user from the room
    await this.prisma.room.update({
      where: { channelId: channelId },
      data: {
        members: { disconnect: { id: member.id } },
      },
    });

    await this.prisma.player.update({
      where: { id: member.id },
      data: {
        rooms: { disconnect: { channelId: channelId } },
      },
    });

    return {
      status: 204,
      data: { message: 'Successfully banned member from the channel' },
    };
  }

  async getDiscoveredRooms(res: Response) {
    try {
      let rooms = await this.prisma.room.findMany({
        select: {
          channelId: true,
          name: true,
          topic: true,
          memberLimit: true,
          avatar: true,
          members: true,
        },
        where: {
          isChannel: true,
          NOT: {
            stats: 'secret',
          },
        },
      });
      rooms = rooms.map((room) => ({
        ...room,
        memberCount: room.members.length,
      }));
      return res.status(200).json({ rooms });
    } catch (err) {
      console.log(err);
      return res.status(400).json({ error: err });
    }
  }
}
