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

  @Get('allChat')
  async GetChat(
    @GetPlayer() player: Player,
    @Res() res: Response,
    @Query('page') page: number,
    ) {
    try {
      // console.log("Get All Chat");
      const allChat = await this.chatService.getAllChat(player, 0);     
      res.status(allChat.status).json(allChat);
    }catch (err) {
      console.log(err.message);
      return res.status(404).json({ error: 'An error has occurred' });
    }
  }

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
      console.log("create DM");
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
  // async saveMessage(
  //   @GetPlayer('id') id: number,
  //   messageInfo: any,
  //   roomId: string,
  // ) {
  //   try{
  //     const result = await this.chatService.saveMessage(messageInfo, roomId);
  //   }catch(error) {
  //     return  'An error has occurred';
  //   }
  // }
}