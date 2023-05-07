import { Body, 
  Controller, Get, Post, Query, Req, Res,
  UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { GetPlayer } from 'src/auth/decorator';
import { Request, Response } from 'express';
import { Player } from '@prisma/client';
import { JwtGuard } from 'src/auth/guard';
import { ChatDto } from './dto';

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

  @Get('getRoomInfo')
  async getRoomInfo(
    @Req() req: Request,
    @Res() res: Response,
    @Query() roomId: string,
  ) {
    const roomInfo = await this.chatService.getRoomInfo(roomId);
    res.status(200).json(roomInfo);
  }

  @Get('getRoom')
  async getRoom(
  @Req() req: Request,
  @Res() res: Response,
  @Query() room: any,
) {
    const roomId = await this.chatService.getRoomByName(room);
    res.status(200).json(roomId);
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
  async CreateRoom(@Req() req: Request, @Res() res: Response) {
    const room = req.body;
    const roomId = await this.chatService.CreateRoom(room);
    console.log(roomId)
    res.status(200).json(roomId);
  }
  

  @Post('CreatePrivateChat')
  async CreatePrivateChat(@Req() req: Request, @Res() res: Response) {
    const room = req.body;
    const roomId = await this.chatService.CreatePrivateChat(room);
    console.log(roomId)
    res.status(200).json(roomId);
  }

  @Get('discover')
  getDiscoveredRooms(@Res() res: Response) {
    return this.chatService.getDiscoveredRooms(res);
  }
}
