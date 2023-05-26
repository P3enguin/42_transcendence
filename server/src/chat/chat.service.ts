import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Player } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateChannelDto,
  JoinChannelDto,
  KickMemberDto,
  BanMemberDto,
  MuteMemberDto,
  UnmuteMemberDto,
  UnbanMemberDto,
  MessageInfo,
  invitedMember,
} from './dto';
import { generate } from 'shortid';
import { Response } from 'express';
import * as fs from 'fs';

@Injectable()
export class ChatService {
  constructor(private jwt: JwtService, private prisma: PrismaService) {}

  async getMessages(player: Player, channelId: string) {
    const messageInfo: MessageInfo[] = [];

    const channel = await this.prisma.room.findUnique({
      where: { channelId: channelId },
      select: {
        messages: {
          select: {
            sender: {
              select: {
                nickname: true,
                avatar: true,
              },
            },
            message: true,
            sentAt: true,
          },
          orderBy: {
            sentAt: 'desc',
          },
        },
      },
    });

    const user = await this.prisma.player.findUnique({
      where: {
        id: player.id,
      },
      select: {
        block: {
          select: {
            nickname: true,
          },
        },
      },
    });

    for (const message of channel.messages) {
      if (
        !user.block.find(
          (blocedUser) => blocedUser.nickname == message.sender.nickname,
        )
      ) {
        const msg: MessageInfo = {
          sender: message.sender.nickname,
          senderAvatar: message.sender.avatar,
          time:
            message.sentAt.getHours().toString().padStart(2, '0') +
            ':' +
            message.sentAt.getMinutes().toString().padStart(2, '0'),
          message: message.message,
        };
        messageInfo.push(msg);
      }
    }

    return {
      status: 200,
      data: messageInfo,
    };
  }

  async saveMessage(messageInfo: any, roomId: string) {
    try {
      const channel = await this.prisma.room.findUnique({
        where: {
          channelId: roomId,
        },
        select: {
          id: true,
        },
      });

      if (!channel) {
        console.log("Couldn't save message: channel not found.");
        return;
      }

      const sender = await this.prisma.player.findUnique({
        where: {
          nickname: messageInfo.sender,
        },
        select: {
          id: true,
        },
      });

      if (!channel) {
        console.log("Couldn't save message: sender not found.");
        return;
      }

      const msg = await this.prisma.message.create({
        data: {
          channel: {
            connect: { id: channel.id },
          },
          sender: {
            connect: { id: sender.id },
          },
          message: messageInfo.message,
        },
      });

      if (!msg) {
        console.log("Couldn't save message.");
        return;
      }

      await this.prisma.room.update({
        where: {
          channelId: roomId,
        },
        data: {
          messages: {
            connect: {
              id: msg.id,
            },
          },
        },
      });
    } catch (err) {
      console.log('cant create message', err.message);
    }
  }

  async createChannel(player: Player, createChannelDto: CreateChannelDto) {
    const { name, topic, key, memberLimit, privacy } = createChannelDto;

    const channel = await this.prisma.room.create({
      select: {
        channelId: true,
        name: true,
        topic: true,
        memberLimit: true,
        privacy: true,
        ownerId: true,
      },
      data: {
        channelId: generate(),
        name,
        topic,
        key,
        memberLimit,
        privacy,
        isChannel: true,
        owner: {
          connect: { id: player.id },
        },
        admins: {
          connect: { id: player.id },
        },
        members: {
          connect: { id: player.id },
        },
      },
    });

    return {
      status: 201,
      data: channel,
    };
  }

  async deleteChannel(player: Player, channelId: string) {
    const channel = await this.prisma.room.findUnique({
      select: {
        owner: true,
      },
      where: {
        channelId,
      },
    });

    if (!channel) {
      return {
        status: 404,
        data: { error: 'Unknown Channel' },
      };
    }

    if (channel.owner.id !== player.id) {
      return {
        status: 403,
        data: { error: "You don't have permissions to delete this channel" },
      };
    }

    await this.prisma.room.delete({
      where: {
        channelId,
      },
    });

    return {
      status: 204,
      data: { message: 'Successfully deleted the channel' },
    };
  }

  async getChannel(player: Player, channelId: string) {
    let channel = await this.prisma.room.findFirst({
      select: {
        channelId: true,
        name: true,
        topic: true,
        avatar: true,
        memberLimit: true,
        privacy: true,
        isChannel: true,
        key: true,
        owner: {
          select: {
            nickname: true,
            avatar: true,
            firstname: true,
            lastname: true,
            joinAt: true,
          },
        },
        admins: {
          select: {
            nickname: true,
            avatar: true,
            firstname: true,
            lastname: true,
            joinAt: true,
          },
        },
        members: {
          select: {
            id: true,
            nickname: true,
            avatar: true,
            firstname: true,
            lastname: true,
            joinAt: true,
          },
        },
        mutes: {
          select: {
            id: true,
            player: {
              select: {
                nickname: true,
                avatar: true,
                firstname: true,
                lastname: true,
                joinAt: true,
              },
            },
            expirationDate: true,
          },
        },
        bans: {
          select: {
            player: {
              select: {
                nickname: true,
                avatar: true,
                firstname: true,
                lastname: true,
                joinAt: true,
              },
            },
            reason: true,
          },
        },
        invited: {
          select: {
            player: {
              select: {
                nickname: true,
                avatar: true,
                firstname: true,
                lastname: true,
                joinAt: true,
              },
            },
          },
        },
        createdAt: true,
      },
      where: {
        channelId,
      },
    });

    if (
      (!channel.isChannel &&
        !channel.members.find(
          (member) => member.nickname === player.nickname,
        )) ||
      !channel ||
      (channel.privacy === 'secret' &&
        !channel.members.find(
          (member) => member.nickname === player.nickname,
        ) &&
        !channel.invited.find(
          (member) => member.player.nickname === player.nickname,
        ))
    ) {
      return {
        status: 404,
        data: { error: 'Unknown Channel' },
      };
    }

    if (!channel.isChannel) {
      return {
        status: 200,
        data: {
          channelId: channel.channelId,
          members: channel.members,
          isChannel: channel.isChannel,
        },
      };
    }

    if (
      !channel.members.find((member) => member.nickname === player.nickname)
    ) {
      return {
        status: 403,
        data: {
          channelId: channel.channelId,
          name: channel.name,
          topic: channel.topic,
          avatar: channel.avatar,
          privacy: channel.privacy,
          isChannel: channel.isChannel,
          memberLimit: channel.memberLimit,
          membersCount: channel.members.length,
        },
      };
    }

    channel.mutes.forEach(async (mute) => {
      console.log(new Date(mute.expirationDate).getTime());
      console.log(new Date().getTime());

      if (new Date(mute.expirationDate).getTime() <= new Date().getTime()) {
        channel.mutes = channel.mutes.filter((m) => m.id !== mute.id);
        await this.prisma.mute.delete({
          where: {
            id: mute.id,
          },
        });
      }
    });
    if (!channel.admins.find((admin) => admin.nickname === player.nickname)) {
      delete channel.key;
      delete channel.mutes;
      delete channel.bans;
    }

    return {
      status: 200,
      data: channel,
    };
  }

  async getRecentChat(player: Player, page: number) {
    if (page < 0) {
      return {
        status: 400,
        data: { error: 'Invalid page' },
      };
    }

    const user = await this.prisma.player.findUnique({
      where: {
        id: player.id,
      },
      select: {
        rooms: {
          select: {
            channelId: true,
            name: true,
            topic: true,
            avatar: true,
            memberLimit: true,
            privacy: true,
            isChannel: true,
            key: true,
            messages: {
              select: {
                sender: {
                  select: {
                    nickname: true,
                    avatar: true,
                    firstname: true,
                    lastname: true,
                    joinAt: true,
                  },
                },
                message: true,
                sentAt: true,
              },
              orderBy: {
                sentAt: 'desc',
              },
              take: 1,
            },
            owner: {
              select: {
                nickname: true,
                avatar: true,
                firstname: true,
                lastname: true,
                joinAt: true,
              },
            },
            admins: {
              select: {
                nickname: true,
                avatar: true,
                firstname: true,
                lastname: true,
                joinAt: true,
              },
            },
            members: {
              select: {
                id: true,
                nickname: true,
                avatar: true,
                firstname: true,
                lastname: true,
                joinAt: true,
              },
            },
            mutes: {
              select: {
                player: {
                  select: {
                    nickname: true,
                    avatar: true,
                    firstname: true,
                    lastname: true,
                    joinAt: true,
                  },
                },
              },
            },
            bans: {
              select: {
                player: {
                  select: {
                    nickname: true,
                    avatar: true,
                    firstname: true,
                    lastname: true,
                    joinAt: true,
                  },
                },
                reason: true,
              },
            },
            createdAt: true,
          },
          skip: 12 * page,
          take: 12,
        },
      },
    });

    if (!user) {
      return {
        status: 404,
        data: { error: 'User not found' },
      };
    }

    if (!user.rooms) {
      return {
        status: 404,
        data: { error: 'Channels not found' },
      };
    }

    return {
      status: 200,
      data: user.rooms,
    };
  }

  async getDM(player: Player, nickname: string) {
    if (nickname === player.nickname) {
      return {
        status: 405,
        data: { error: 'Method Not Allowed' },
      };
    }

    const existingDM = await this.prisma.room.findFirst({
      select: {
        channelId: true,
        members: {
          select: {
            nickname: true,
            avatar: true,
          },
        },
      },
      where: {
        isChannel: false,
        memberLimit: 2,
        privacy: 'secret',
        members: {
          every: {
            OR: [{ nickname: player.nickname }, { nickname: nickname }],
          },
        },
      },
    });

    if (existingDM && existingDM.members.length === 2) {
      return {
        status: 200,
        data: existingDM,
      };
    }

    const dm = await this.prisma.room.create({
      select: {
        channelId: true,
        members: {
          select: {
            nickname: true,
            avatar: true,
            firstname: true,
            lastname: true,
            joinAt: true,
          },
        },
      },
      data: {
        channelId: generate(),
        isChannel: false,
        privacy: 'secret',
        memberLimit: 2,
        owner: {
          connect: { id: player.id },
        },
        members: {
          connect: [{ nickname: player.nickname }, { nickname }],
        },
      },
    });

    return {
      status: 201,
      data: dm,
    };
  }

  async joinChannel(player: Player, JoinChannelDto: JoinChannelDto) {
    const { channelId, key } = JoinChannelDto;

    const channel = await this.prisma.room.findUnique({
      where: { channelId: channelId },
      select: {
        channelId: true,
        privacy: true,
        key: true,
        memberLimit: true,
        members: true,
        bans: {
          where: { playerId: player.id },
        },
        invited: true,
      },
    });

    if (
      !channel ||
      (channel.privacy === 'secret' &&
        !channel.members.find((member) => member.id === player.id) &&
        !channel.invited.find((member) => member.playerId === player.id))
    ) {
      return {
        status: 404,
        data: { error: 'Unknown Channel' },
      };
    }

    if (channel.privacy === 'private' && key !== channel.key) {
      return {
        status: 403,
        data: { error: 'Invalid key' },
      };
    }

    if (channel.bans.length > 0) {
      return {
        status: 403,
        data: { error: 'You are banned from this channel' },
      };
    }

    if (
      channel.memberLimit &&
      channel.members.length + 1 > channel.memberLimit
    ) {
      return {
        status: 403,
        data: { error: 'Channel is full' },
      };
    }

    const updatedRoom = await this.prisma.room.update({
      select: {
        channelId: true,
        name: true,
        topic: true,
        memberLimit: true,
        privacy: true,
        avatar: true,
      },
      where: { channelId: channelId },
      data: {
        members: { connect: { id: player.id } },
      },
    });

    await this.prisma.invite.deleteMany({
      where: {
        channel: {
          channelId,
        },
        playerId: player.id,
      },
    });

    await this.prisma.player.update({
      where: { id: player.id },
      data: {
        rooms: { connect: { channelId: channelId } },
      },
    });

    return {
      status: 200,
      data: updatedRoom,
    };
  }

  async leaveChannel(player: Player, channelId: string) {
    const room = await this.prisma.room.findFirst({
      where: {
        channelId: channelId,
        isChannel: true,
        members: {
          some: {
            id: player.id,
          },
        },
      },
    });

    if (!room) {
      return {
        status: 404,
        data: { error: 'Unknown Channel' },
      };
    }

    await this.prisma.room.update({
      where: { channelId: channelId },
      data: {
        admins: { disconnect: { id: player.id } },
        members: { disconnect: { id: player.id } },
      },
    });

    if (room.ownerId === player.id) {
      await this.prisma.room.update({
        where: { channelId: channelId },
        data: {
          owner: { disconnect: true },
        },
      });
    }

    await this.prisma.player.update({
      where: { id: player.id },
      data: {
        rooms: { disconnect: { channelId: channelId } },
        ownedRooms: { disconnect: { channelId: channelId } },
        admins: { disconnect: { channelId: channelId } },
      },
    });

    return {
      status: 204,
      data: { error: 'Successfully left the channel' },
    };
  }

  async kickMember(player: Player, kickMemberDto: KickMemberDto) {
    const { channelId, memberNickname } = kickMemberDto;

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
        data: { error: "You don't have permissions to kick users" },
      };
    }

    // Find if the user to kick exists
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

    // Prevent admins from kicking owner and other admins
    if (
      channel.owner.id === member.id ||
      (channel.owner.id !== player.id &&
        channel.admins.find((channelAdmin) => channelAdmin.id === member.id))
    ) {
      return {
        status: 403,
        data: { error: "You don't have permissions to kick this user" },
      };
    }

    // Remove user from the room
    await this.prisma.room.update({
      where: { channelId: channelId },
      data: {
        admins: { disconnect: { id: member.id } },
        members: { disconnect: { id: member.id } },
      },
    });

    await this.prisma.player.update({
      where: { id: member.id },
      data: {
        rooms: { disconnect: { channelId: channelId } },
        ownedRooms: { disconnect: { channelId: channelId } },
        admins: { disconnect: { channelId: channelId } },
      },
    });

    return {
      status: 204,
      data: { message: 'Successfully kicked member from the channel' },
    };
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
      select: {
        id: true,
        bans: true,
      },
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

    // Check if the user is already banned
    if (member.bans.find((mute) => mute.channelId === channel.id)) {
      return {
        status: 403,
        data: { error: 'Member is already banned' },
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
        status: 400,
        data: { error: 'An error occurred while banning the member' },
      };
    }

    // Remove user from the room
    await this.prisma.room.update({
      where: { channelId: channelId },
      data: {
        admins: { disconnect: { id: member.id } },
        members: { disconnect: { id: member.id } },
      },
    });

    await this.prisma.player.update({
      where: { id: member.id },
      data: {
        rooms: { disconnect: { channelId: channelId } },
        ownedRooms: { disconnect: { channelId: channelId } },
        admins: { disconnect: { channelId: channelId } },
      },
    });

    return {
      status: 204,
      data: { message: 'Successfully banned member from the channel' },
    };
  }

  async unbanMember(player: Player, unbanMemberDto: UnbanMemberDto) {
    const { channelId, memberNickname } = unbanMemberDto;

    // Find if room exists
    const channel = await this.prisma.room.findUnique({
      select: {
        id: true,
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
        data: { error: "You don't have permissions to unban users" },
      };
    }

    // Find if the user to unban exists
    const member = await this.prisma.player.findUnique({
      select: {
        id: true,
        bans: true,
      },
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

    // Check if the member is not banned
    if (!member.bans.find((mute) => mute.channelId === channel.id)) {
      return {
        status: 403,
        data: { error: 'Member is not banned' },
      };
    }

    // Performing the unban on the channel member
    const unban = await this.prisma.ban.deleteMany({
      where: {
        channelId: channel.id,
        playerId: member.id,
      },
    });

    if (!unban || !unban.count) {
      return {
        status: 400,
        data: { error: 'An error occurred while unbanning the member' },
      };
    }

    return {
      status: 204,
      data: { message: 'Successfully unbanned member from the channel' },
    };
  }

  async muteMember(player: Player, muteMemberDto: MuteMemberDto) {
    const { channelId, memberNickname, duration } = muteMemberDto;

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
        data: { error: "You don't have permissions to mute users" },
      };
    }

    // Find if the user to mute exists
    const member = await this.prisma.player.findUnique({
      select: {
        id: true,
        mutes: true,
      },
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

    // Check if the user is already muted
    if (member.mutes.find((mute) => mute.channelId === channel.id)) {
      return {
        status: 403,
        data: { error: 'Member is already muted' },
      };
    }

    // Prevent admins from muting owner and other admins
    if (
      channel.owner.id === member.id ||
      (channel.owner.id !== player.id &&
        channel.admins.find((channelAdmin) => channelAdmin.id === member.id))
    ) {
      return {
        status: 403,
        data: { error: "You don't have permissions to mute this user" },
      };
    }

    // Performing the mute on the channel member
    const mute = await this.prisma.mute.create({
      data: {
        channel: {
          connect: { id: channel.id },
        },
        player: {
          connect: { id: member.id },
        },
        expirationDate: new Date(Date.now() + duration),
      },
    });

    if (!mute) {
      return {
        status: 400,
        data: { error: 'An error occurred while muting the member' },
      };
    }
    return {
      status: 204,
      data: { message: 'Successfully muted member from the channel' },
    };
  }

  async unmuteMember(player: Player, unmuteMemberDto: UnmuteMemberDto) {
    const { channelId, memberNickname } = unmuteMemberDto;

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
        data: { error: "You don't have permissions to unmute users" },
      };
    }

    // Find if the user to unmute exists
    const member = await this.prisma.player.findUnique({
      select: {
        id: true,
        mutes: true,
      },
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

    // Check if the member is not muted
    if (!member.mutes.find((mute) => mute.channelId === channel.id)) {
      return {
        status: 403,
        data: { error: 'Member is not muted' },
      };
    }

    // Performing the unmute on the channel member
    const unmute = await this.prisma.mute.deleteMany({
      where: {
        channelId: channel.id,
        playerId: member.id,
      },
    });

    if (!unmute || !unmute.count) {
      return {
        status: 400,
        data: { error: 'An error occurred while unmuting the member' },
      };
    }

    return {
      status: 204,
      data: { message: 'Successfully unmuted member from the channel' },
    };
  }

  async inviteMember(player: Player, invitedMember: invitedMember) {
    const { channelId, playerNickname } = invitedMember;

    const channel = await this.prisma.room.findUnique({
      where: {
        channelId: channelId,
      },
      select: {
        id: true,
        owner: true,
        admins: true,
        members: true,
        invited: true,
      },
    });

    if (!channel) {
      return {
        status: 403,
        data: { error: 'Unkown Channel' },
      };
    }
    if (!channel.admins.find((channelAdmin) => channelAdmin.id === player.id)) {
      return {
        status: 403,
        data: { error: "You don't have permissions to invite users" },
      };
    }
    const member = await this.prisma.player.findUnique({
      where: {
        nickname: playerNickname,
      },
      select: {
        id: true,
        invited: true,
      },
    });
    if (!member) {
      return {
        status: 404,
        data: { error: 'User not found' },
      };
    }
    if (
      channel.members.find((channelMember) => channelMember.id === member.id)
    ) {
      return {
        status: 404,
        data: { error: 'User is already a member of the channel' },
      };
    }
    if (
      channel.invited.find((channelInvites) => channelInvites.id === member.id)
    ) {
      return {
        status: 404,
        data: { error: 'User is already a Invited' },
      };
    }
    const invite = await this.prisma.invite.create({
      data: {
        channel: {
          connect: { id: channel.id },
        },
        player: {
          connect: { id: member.id },
        },
      },
    });
    if (!invite) {
      return {
        status: 400,
        data: { error: 'An error occurred while inviting the member' },
      };
    }
    return {
      status: 200,
      data: { msg: 'invitation sent successfully' },
    };
  }

  async cancelInvites(player, invited) {
    const { channelId, playerNickname } = invited;

    const channel = await this.prisma.room.findUnique({
      where: {
        channelId: channelId,
      },
      select: {
        id: true,
        owner: true,
        admins: true,
        members: true,
        invited: true,
      },
    });

    if (!channel) {
      return {
        status: 403,
        data: { error: 'Unknown Channel' },
      };
    }

    const member = await this.prisma.player.findUnique({
      where: {
        nickname: playerNickname,
      },
      select: {
        id: true,
        invited: true,
      },
    });

    if (!member) {
      return {
        status: 404,
        data: { error: 'User not found' },
      };
    }

    const canceled = await this.prisma.invite.deleteMany({
      where: {
        channelId: channel.id,
        playerId: member.id,
      },
    });

    return {
      status: 204,
      data: { message: 'Successfully canceled invite' },
    };
  }

  async updateChannel(
    player: Player,
    channelId: string,
    createChannelDto: CreateChannelDto,
  ) {
    const { name, topic, key, memberLimit, privacy } = createChannelDto;

    if (privacy === 'private' && (!key || !key.length)) {
      return {
        status: 400,
        data: {
          error: 'Key cannot be empty',
        },
      };
    }

    const updatedChannel = await this.prisma.room.update({
      select: {
        channelId: true,
        name: true,
        topic: true,
        memberLimit: true,
        privacy: true,
        owner: true,
        admins: true,
      },
      where: { channelId: channelId },
      data: {
        name,
        topic,
        key,
        memberLimit,
        privacy,
      },
    });

    if (
      updatedChannel.owner.nickname !== player.nickname &&
      !updatedChannel.admins.find((admin) => admin.nickname === player.nickname)
    ) {
      return {
        status: 403,
        data: {
          error: "You don't have permissions to update channel information",
        },
      };
    }

    delete updatedChannel.owner;
    delete updatedChannel.admins;

    return {
      status: 200,
      data: updatedChannel,
    };
  }

  async addAdmin(player: Player, channelId: string, nickname: string) {
    const user = await this.prisma.player.findUnique({
      select: {
        id: true,
      },
      where: {
        nickname: nickname,
      },
    });

    const channel = await this.prisma.room.findFirst({
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

    if (player.nickname !== channel.owner.nickname) {
      return {
        status: 403,
        data: { error: "You don't have permissions to manage channel admins" },
      };
    }

    if (!channel.members.find((member) => member.nickname !== nickname)) {
      return {
        status: 404,
        data: {
          error: 'User not found',
        },
      };
    }

    if (channel.admins.find((admin) => admin.nickname === nickname)) {
      return {
        status: 403,
        data: {
          error: 'User is already an administrator',
        },
      };
    }

    await this.prisma.room.update({
      where: {
        channelId,
      },
      data: {
        admins: {
          connect: { id: user.id },
        },
      },
    });

    return {
      status: 204,
      data: { message: 'Successfully added user to administrators' },
    };
  }

  async removeAdmin(player: Player, channelId: string, nickname: string) {
    const user = await this.prisma.player.findUnique({
      select: {
        id: true,
      },
      where: {
        nickname: nickname,
      },
    });

    const channel = await this.prisma.room.findFirst({
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

    if (player.nickname !== channel.owner.nickname) {
      return {
        status: 403,
        data: { error: "You don't have permissions to manage channel admins" },
      };
    }

    if (!channel.members.find((member) => member.nickname === nickname)) {
      return {
        status: 404,
        data: {
          error: 'User not found',
        },
      };
    }

    if (!channel.admins.find((admin) => admin.nickname === nickname)) {
      return {
        status: 403,
        data: {
          error: 'User is not an administrator',
        },
      };
    }

    await this.prisma.room.update({
      where: {
        channelId,
      },
      data: {
        admins: {
          disconnect: { id: user.id },
        },
      },
    });

    return {
      status: 204,
      data: { message: 'Successfully added user to administrators' },
    };
  }

  async getDiscoveredChannels() {
    let channels = await this.prisma.room.findMany({
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
          privacy: 'secret',
        },
      },
    });

    channels = channels.map((room) => ({
      ...room,
      memberCount: room.members.length,
    }));

    return {
      status: 200,
      data: channels,
    };
  }

  async updateChannelAvatar(
    channelId: string,
    fileName: string,
    res: Response,
  ) {
    try {
      const secret = process.env.JWT_SECRET;
      const channel = await this.prisma.room.findUnique({
        where: {
          channelId,
        },
        select: {
          avatar: true,
        },
      });
      if (channel.avatar != 'default.jpeg') {
        fs.unlink(
          process.cwd() + '/uploads/channels/' + channel.avatar,
          (error) => {
            if (error) {
              console.log(error);
            }
          },
        );
      }
      await this.prisma.room.update({
        where: {
          channelId,
        },
        data: {
          avatar: fileName,
        },
      });
      return res.status(200).json(fileName);
    } catch (err) {
      console.log(err.message);
      return res.status(401).json({ message: 'Can not upload avatar' });
    }
  }
  async getInvitations(player: Player) {
    const invitations = await this.prisma.invite.findMany({
      where: {
        playerId: player.id,
      },
      select: {
        channel: {
          select: {
            channelId: true,
            name: true,
          },
        },
      },
    });
    return {
      status: 200,
      data: {
        nickname: player.nickname,
        invitations,
      },
    };
  }
}
