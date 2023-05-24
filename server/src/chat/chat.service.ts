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

@Injectable()
export class ChatService {
  constructor(private jwt: JwtService, private prisma: PrismaService) {}

  async getMessages(channelId: string, player: Player) {
    const messageInfo : MessageInfo[]=[];
    try{
      const result = await this.prisma.room.findUnique({
        where: { channelId: channelId},
        select: 
          {
            messages: {
              select: {
                sender: true,
                sendAt: true,
                message: true,
              },
              orderBy: {
                sendAt: 'desc',
              },
            },
          },
      });
      const blocked = await this.prisma.player.findUnique({
        where: {
          id: player.id
        },
        select: {
          block:true,
        },
      });
      for (const element of result.messages) {
        const sender = await  this.prisma.player.findUnique({
          where: {
            id: element.sender,
          },
          select:{
            nickname: true,
            avatar: true,
          },
        });
        let found = false;
        for (const findSender of blocked.block){
          if (sender.nickname === findSender.nickname)
            found = true;
        }
        if (!found){
          const msg: MessageInfo = {
          sender: sender.nickname,
          senderAvatar: sender.avatar,
          time: element.sendAt.getHours() + ":" + element.sendAt.getMinutes(),
          message: element.message,
        };
        messageInfo.push(msg);
      };
    }// <----- empty
      return {
        status : 201,
        data: messageInfo,
      };
    }catch (e) {
      console.error(e);
      throw new Error("Error retrieving messages");
    }
  }

  async getAllChat(_player: Player, page: number) {
    const player = await this.prisma.player.findUnique({
      where: {
        id: _player.id,
      },
      select: {
        rooms: {
          select: {
            channelId: true,
            name: true,
            privacy: true,
            avatar: true,
            messages: {
              select: {
                sender: true,
                message: true,
                sendAt: true,
              },
              orderBy: {
                sendAt: 'desc',
              },
              take: 1,
            },
          },
          skip: 12 * page,
          take: 12,
        },
      },
    });
    // console.log('Player Rooms Messages:');
    player.rooms.forEach((room) => {
      // console.log(room.messages);
    });
    if (!player)
      return {
        status: 404,
        data: { error: 'Invalid' },
      };
    return {
      status: 201,
      data: player,
    };
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
        !channel.members.find((member) => member.nickname === player.nickname))
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
          memberLimit: channel.memberLimit,
          membersCount: channel.members.length,
        },
      };
    }

    if (!channel.admins.find((admin) => admin.nickname === player.nickname)) {
      delete channel.mutes;
      delete channel.bans;
    }

    return {
      status: 200,
      data: channel,
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
        key: true,
        memberLimit: true,
        members: true,
        bans: {
          where: { playerId: player.id },
        },
      },
    });

    if (!channel) {
      return {
        status: 404,
        data: { error: 'Unknown Channel' },
      };
    }

    if (channel.key && key !== channel.key) {
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
        members: { disconnect: { id: player.id } },
      },
    });

    await this.prisma.player.update({
      where: { id: player.id },
      data: {
        rooms: { disconnect: { channelId: channelId } },
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
        status: 401,
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
        status: 401,
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
        status: 401,
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
        status: 401,
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
      where:{
        channelId: channelId,
      },
      select :{
        id: true,
        owner: true,
        admins: true,
        members: true,
        invited: true,
      },
    });

    if (!channel ){
      return {
      status: 403,
      data: {error : "Unkown Channel"},
      };
    }
    if (!channel.admins.find((channelAdmin)=> channelAdmin.id === player.id)) {
      return {
        status: 403,
        data: { error: "You don't have permissions to invite users" },
      };
    }
    const member  =await this.prisma.player.findUnique({
      where :{
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
    if (channel.members.find((channelMember) => channelMember.id === member.id)) {
      return {
        status: 404,
        data: { error: 'User is already a member of the channel' },
      };
  }
  if (channel.invited.find((channelInvites) => channelInvites.id === member.id)) {
    return {
      status: 404,
      data: { error: 'User is already a Invited' },
    };
  }
  const invite = await this.prisma.invite.create({
    data: {
      channel:{
        connect: {id: channel.id},
      },
      player: {
        connect :{ id : member.id },
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
    status : 200,
    data: {msg : 'invitation sent successfully'},
  }
}

  async cancelInvites(player, invited) {
    const { channelId, playerNickname } = invited;
    const channel = await this.prisma.room.findUnique({
      where:{
        channelId: channelId,
      },
      select :{
        id: true,
        owner: true,
        admins: true,
        members: true,
        invited: true,
      },
    });

    if (!channel ){
      return {
      status: 403,
      data: {error : "Unkown Channel"},
      };
    }
    if (!channel.admins.find((channelAdmin)=> channelAdmin.id === player.id)) {
      return {
        status: 403,
        data: { error: "You don't have permissions to invite users" },
      };
    }
    const member  =await this.prisma.player.findUnique({
      where :{
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
    if (channel.members.find((channelMember) => channelMember.id === member.id)) {
      return {
        status: 404,
        data: { error: 'User is already a member of the channel' },
      };
    }
    if (!channel.invited.find((channelInvites) => channelInvites.id === member.id)) {
      return {
        status: 404,
        data: { error: 'User is not invited' },
      };
    }

    const canceled = await this.prisma.invite.deleteMany({
      where:{
        channelId: channel.id,
        playerId: member.id,
      }
    })
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

  async saveMessage(messageInfo: any, roomId: string) {
    try {
      const sender = await this.prisma.player.findUnique({
        where: {
          nickname: messageInfo.sender,
        },
        select: {
          id: true,
        },
      });

      const msg = await this.prisma.message.create({
        data: {
          sender: sender.id,
          message: messageInfo.message,
          roomId: roomId,
        },
      });

      const channel = await this.prisma.room.update({
        where: {
          channelId: roomId,
        },
        data: {
          messages: {
            connect: {
              MsgId: msg.MsgId,
            },
          },
        },
      });
    } catch (err) {
      console.log('cant create message', err.message);
    }
  }
}
