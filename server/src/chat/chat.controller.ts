import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { GetPlayer } from 'src/auth/decorator';
import { Request, Response } from 'express';
import { Player } from '@prisma/client';
import { JwtGuard } from 'src/auth/guard';
import { BanMemberDto, CreateChannelDto, JoinChannelDto } from './dto';

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

  @Post('create')
  async createChannel(
    @GetPlayer() player: Player,
    @Body() createChannelDto: CreateChannelDto,
    @Res() res: Response,
  ) {
    try {
      const result = await this.chatService.createChannel(
        player,
        createChannelDto,
      );
      res.status(result.status).json(result.data);
    } catch (error) {
      return res.status(500).json({ error: 'An error has occurred' });
    }
  }

  @Get('channels/:id')
  async getChannel(
    @GetPlayer() player: Player,
    @Param('id') channelId: string,
    @Res() res: Response,
  ) {
    try {
      const result = await this.chatService.getChannel(player, channelId);
      res.status(result.status).json(result.data);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'An error has occurred' });
    }
  }

  @Post('create/dm')
  async createDM(
    @GetPlayer() player: Player,
    @Query('nickname') nickname: string,
    @Res() res: Response,
  ) {
    try {
      const result = await this.chatService.createDM(player, nickname);
      res.status(result.status).json(result.data);
    } catch (error) {
      return res.status(500).json({ error: 'An error has occurred' });
    }
  }

  @Get('dm')
  async getDM(
    @GetPlayer() player: Player,
    @Query('nickname') nickname: string,
    @Res() res: Response,
  ) {
    try {
      const result = await this.chatService.getDM(player, nickname);
      res.status(result.status).json(result.data);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'An error has occurred' });
    }
  }

  @Post('join')
  async joinChannel(
    @GetPlayer() player: Player,
    @Body() joinChannelDto: JoinChannelDto,
    @Res() res: Response,
  ) {
    try {
      const result = await this.chatService.joinChannel(player, joinChannelDto);
      res.status(result.status).json(result.data);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'An error has occurred' });
    }
  }

  @Delete('leave/:id')
  async leaveChannel(
    @GetPlayer() player: Player,
    @Param('id') channelId: string,
    @Res() res: Response,
  ) {
    try {
      const result = await this.chatService.leaveChannel(player, channelId);
      res.status(result.status).json(result.data);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'An error has occurred' });
    }
  }

  @Post('ban')
  async banMember(
    @GetPlayer() player: Player,
    @Body() banMemberDto: BanMemberDto,
    @Res() res: Response,
  ) {
    try {
      const result = await this.chatService.banMember(player, banMemberDto);
      res.status(result.status).json(result.data);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'An error has occurred' });
    }
  }

  @Get('discover')
  async getDiscoveredChannels(@Res() res: Response) {
    try {
      const result = await this.chatService.getDiscoveredChannels();
      res.status(result.status).json(result.data);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'An error has occurred' });
    }
  }
}
