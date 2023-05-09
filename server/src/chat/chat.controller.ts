import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { GetPlayer } from 'src/auth/decorator';
import { Request, Response } from 'express';
import { Player } from '@prisma/client';
import { JwtGuard } from 'src/auth/guard';
import { BanMemberDto, JoinChannelDto } from './dto';

@UseGuards(JwtGuard)
@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Post('sendMessage')
  SendPrivMessage(friendId: string, message: string) {
    return this.chatService.SendPrivMessage(friendId, message);
  }

  @Post('ChannelMessage')
  SendPublicMessage(channelId: number, message: string) {
    return this.chatService.SendPublicMessage(channelId, message);
  }

  @Get('privateMessages')
  GetPrivMessage(
    @GetPlayer() player: Player,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.chatService.GetPrivMessage(player, req.query.friendId);
  }

  @Get('channelMessages')
  GetChannelMessage(channelId: number) {
    return this.chatService.GetChannelMessage(channelId);
  }

  @Get('messages')
  GetChatById(id: string) {
    return this.chatService.GetChatById(id);
  }

  @Get('allChat')
  GetChat(@GetPlayer() player: Player) {}

  @Post('CreateRoom')
  CreateRoom(@Req() req: Request, @Res() res: Response) {
    const room = req.body;
    const roomId = this.chatService.CreateRoom(room);
    res.status(200).json(roomId);
  }

  @Post('CreatePrivateChat')
  CreatePrivateChat(@Req() req: Request, @Res() res: Response) {
    const room = req.body;
    const roomId = this.chatService.CreatePrivateChat(room);
    res.status(200).json(roomId);
  }

  @Post('join')
  async joinChannel(
    @GetPlayer() player: Player,
    @Body() joinChannelDto: JoinChannelDto,
    @Res() res: Response,
  ) {
    try {
      const channel = await this.chatService.joinChannel(
        player,
        joinChannelDto,
      );
      res.status(200).json(channel);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  @Delete('leave/:id')
  async leaveChannel(
    @GetPlayer() player: Player,
    @Param('id') channelId: string,
    @Res() res: Response,
  ) {
    try {
      await this.chatService.leaveChannel(player, channelId);
      res.status(200).json({ message: 'Successfully left the room' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  @Post('ban')
  async banMember(
    @GetPlayer() player: Player,
    @Body() banMemberDto: BanMemberDto,
    @Res() res: Response,
  ) {
    const result = await this.chatService.banMember(player, banMemberDto);
    res.status(result.status).json(result.data);
  }

  @Get('discover')
  getDiscoveredRooms(@Res() res: Response) {
    return this.chatService.getDiscoveredRooms(res);
  }
}
