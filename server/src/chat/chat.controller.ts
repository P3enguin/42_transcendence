import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { ChatService } from './chat.service';
import { GetPlayer } from 'src/auth/decorator';
import { Player } from '@prisma/client';
import { JwtGuard } from 'src/auth/guard';
import {
  CreateChannelDto,
  JoinChannelDto,
  KickMemberDto,
  BanMemberDto,
  UnbanMemberDto,
  MuteMemberDto,
  UnmuteMemberDto,
  invitedMember,
} from './dto';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { UploadedFile } from '@nestjs/common';
@UseGuards(JwtGuard)
@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get('msg/:id')
  async getMessages(
    @GetPlayer() player: Player,
    @Param('id') channelId: string,
    @Res() res: Response,
  ) {
    try {
      const result = await this.chatService.getMessages(player, channelId);
      res.status(result.status).json(result.data);
    } catch (error) {
      console.log(error);
      return res.status(400).json({ error: 'Unexpected error occurred' });
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
      console.log(error);
      return res.status(400).json({ error: 'Unexpected error occurred' });
    }
  }

  @Delete('channels/:id')
  async deleteChannel(
    @GetPlayer() player: Player,
    @Param('id') channelId: string,
    @Res() res: Response,
  ) {
    try {
      const result = await this.chatService.deleteChannel(player, channelId);
      res.status(result.status).json(result.data);
    } catch (error) {
      console.log(error);
      return res.status(400).json({ error: 'Unexpected error occurred' });
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
      return res.status(400).json({ error: 'Unexpected error occurred' });
    }
  }

  @Get('recentChat')
  async getRecentChat(
    @GetPlayer() player: Player,
    @Res() res: Response,
    @Query('page') page: number,
  ) {
    try {
      const result = await this.chatService.getRecentChat(player, page - 1);
      res.status(result.status).json(result.data);
    } catch (error) {
      console.log(error);
      return res.status(400).json({ error: 'Unexpected error occurred' });
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
      return res.status(400).json({ error: 'Unexpected error occurred' });
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
      return res.status(400).json({ error: 'Unexpected error occurred' });
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
      return res.status(400).json({ error: 'Unexpected error occurred' });
    }
  }

  @Delete('members')
  async kickMember(
    @GetPlayer() player: Player,
    @Body() kickMemberDto: KickMemberDto,
    @Res() res: Response,
  ) {
    try {
      const result = await this.chatService.kickMember(player, kickMemberDto);
      res.status(result.status).json(result.data);
    } catch (error) {
      console.log(error);
      return res.status(400).json({ error: 'Unexpected error occurred' });
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
      return res.status(400).json({ error: 'Unexpected error occurred' });
    }
  }

  @Delete('ban')
  async unbanMember(
    @GetPlayer() player: Player,
    @Body() unbanMemberDto: UnbanMemberDto,
    @Res() res: Response,
  ) {
    try {
      const result = await this.chatService.unbanMember(player, unbanMemberDto);
      res.status(result.status).json(result.data);
    } catch (error) {
      console.log(error);
      return res.status(400).json({ error: 'Unexpected error occurred' });
    }
  }

  @Post('mute')
  async muteMember(
    @GetPlayer() player: Player,
    @Body() muteMemberDto: MuteMemberDto,
    @Res() res: Response,
  ) {
    try {
      const result = await this.chatService.muteMember(player, muteMemberDto);
      res.status(result.status).json(result.data);
    } catch (error) {
      console.log(error);
      return res.status(400).json({ error: 'Unexpected error occurred' });
    }
  }

  @Delete('mute')
  async unmuteMember(
    @GetPlayer() player: Player,
    @Body() unmuteMemberDto: UnmuteMemberDto,
    @Res() res: Response,
  ) {
    try {
      const result = await this.chatService.unmuteMember(
        player,
        unmuteMemberDto,
      );
      res.status(result.status).json(result.data);
    } catch (error) {
      console.log(error);
      return res.status(400).json({ error: 'Unexpected error occurred' });
    }
  }

  @Post('invite')
  async inviteMember(
    @GetPlayer() player: Player,
    @Body() invitedMember: invitedMember,
    @Res() res: Response,
  ) {
    try {
      console.log(invitedMember);
      const result = await this.chatService.inviteMember(player, invitedMember);
      res.status(result.status).json(result.data);
    } catch (err) {
      return res
        .status(400)
        .json({ error: 'Unexpected error occurred while inviting player' });
    }
  }

  @Post('cancelInvite')
  async cancelInvite(
    @GetPlayer() player: Player,
    @Body() invited: invitedMember,
    @Res() res: Response,
  ) {
    try {
      const result = await this.chatService.cancelInvites(player, invited);
      res.status(result.status).json(result.data);
    } catch (error) {
      return res.status(400).json({
        error: 'Unexpected error occurred while canceling the invitation',
      });
    }
  }

  @Patch('update/:id')
  async updateChannel(
    @GetPlayer() player: Player,
    @Body() createChannelDto: CreateChannelDto,
    @Param('id') channelId: string,
    @Res() res: Response,
  ) {
    try {
      const result = await this.chatService.updateChannel(
        player,
        channelId,
        createChannelDto,
      );
      res.status(result.status).json(result.data);
    } catch (error) {
      console.log(error);
      return res.status(400).json({ error: 'Unexpected error occurred' });
    }
  }

  @Post('promote/:id')
  async addAdmin(
    @GetPlayer() player: Player,
    @Param('id') channelId: string,
    @Query('nickname') nickname: string,
    @Res() res: Response,
  ) {
    try {
      const result = await this.chatService.addAdmin(
        player,
        channelId,
        nickname,
      );
      res.status(result.status).json(result.data);
    } catch (error) {
      console.log(error);
      return res.status(400).json({ error: 'Unexpected error occurred' });
    }
  }

  @Delete('promote/:id')
  async removeAdmin(
    @GetPlayer() player: Player,
    @Param('id') channelId: string,
    @Query('nickname') nickname: string,
    @Res() res: Response,
  ) {
    try {
      const result = await this.chatService.removeAdmin(
        player,
        channelId,
        nickname,
      );
      res.status(result.status).json(result.data);
    } catch (error) {
      console.log(error);
      return res.status(400).json({ error: 'Unexpected error occurred' });
    }
  }

  @Get('discover')
  async getDiscoveredChannels(@Res() res: Response) {
    try {
      const result = await this.chatService.getDiscoveredChannels();
      res.status(result.status).json(result.data);
    } catch (error) {
      console.log(error);
      return res.status(400).json({ error: 'Unexpected error occurred' });
    }
  }

  @Post('avatar/:id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: process.cwd() + '/uploads/channels/',
        filename: (req, file, cb) => {
          const randomName = uuidv4();
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  uploadProfile(
    @Param('id') channelId: string,
    @Res() res: Response,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.chatService.updateChannelAvatar(channelId, file.filename, res);
  }

  @Get('invitations')
  async getInvitations(@GetPlayer() player: Player, @Res() res: Response) {
    try {
      const result = await this.chatService.getInvitations(player);
      res.status(result.status).json(result.data);
    } catch (err) {
      return res
        .status(400)
        .json({ error: 'Unexpected error occurred while getting invitations' });
    }
  }
}
