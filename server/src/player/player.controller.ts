import {
  Controller,
  Get,
  UseGuards,
  Post,
  UploadedFile,
  UseInterceptors,
  Req,
  Res,
  Query,
  Patch,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Player } from '@prisma/client';
import { JwtGuard } from 'src/auth/guard';
import { PlayerService } from './player.service';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { JwtService } from '@nestjs/jwt';
import { query, Request, Response } from 'express';
import { GetPlayer } from 'src/auth/decorator';

interface queryParam {
  nickname: string;
}

interface queryTitleParam {
  title: string;
}

interface querySearchParam {
  search: string;
}

@UseGuards(JwtGuard)
@Controller('players')
export class PlayerController {
  constructor(private playerService: PlayerService) {}

  @Get('me')
  getMe(@Req() req: Request) {
    return req.body.user;
  }

  //-------------------{ Fetching and Changing Data }-------------------------

  @Get('data')
  getData(
    @Req() req: Request,
    @Query() query: queryParam,
    @Res() res: Response,
  ) {
    if (query.nickname)
      return this.playerService.getDataNickname(query.nickname as string, res);
    else return this.playerService.getDataID(req.body.user.id as number, res);
  }

  @Patch('data')
  changeData(@Req() req: Request, @Res() res: Response) {
    console.log(req.body);
    return this.playerService.changeData(req.body, res);
  }

  @Patch('password')
  changePassword(@Req() req: Request, @Res() res: Response) {
    console.log(req.body);
    return this.playerService.changePassowrd(req.body, res);
  }

  //------------------------------{ Titles }----------------------------------

  @Get('title')
  getCurrentTitle(@Res() res: Response, @Query() query: queryParam) {
    return this.playerService.getCurrentTitle(res, query.nickname);
  }

  @Patch('title')
  updateCurrentTitle(
    @Req() req: Request,
    @Res() res: Response,
    @Query() query: queryTitleParam,
  ) {
    return this.playerService.updateCurrentTitle(req.user, res, query.title);
  }

  //------------------------------{ Friend }----------------------------------

  @Post('addRequest')
  AddRequest(@GetPlayer() player, @Req() req: Request) {
    // console.log("request received from ",req.body.);
    return this.playerService.AddRequest(player, req.body.user.id);
  }

  @Patch('AddFriend')
  AddFriend(@GetPlayer() player, @Req() req: Request) {
    return this.playerService.AddFriend(player, req.body.friend, req.body.requestId);
  }

  @Get('friends')
  GetFriends(
    @Req() req: Request,
    @Res() res: Response,
    @Query() query: queryParam,
  ) {
    return this.playerService.GetFriends(req, res, query.nickname);
  }

  @Patch('block')
  BlockFriend(@Req() req: Request, friendId: number) {
    return this.playerService.BlockFriend(req, 2);
  }
  @Get('blocked')
  GetBlockedFriends(@Req() req: Request) {
    return this.playerService.GetBlockedFriends(req);
  }

  //------------------------------{ Avatar and Wallpaper }----------------------------------

  @Post('avatar')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: process.cwd() + '/uploads/avatars/',
        filename: (req, file, cb) => {
          const randomName = uuidv4();
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
      limits: {
        fieldSize: 2,
      },
    }),
  )
  uploadProfile(
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.playerService.updatePFP(req, file.filename);
  }

  @Post('wallpaper')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: process.cwd() + '/uploads/wallpapers/',
        filename: (req, file, cb) => {
          const randomName = uuidv4();
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
      limits: {
        fieldSize: 2,
      },
    }),
  )
  uploadBackGround(
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.playerService.updateWallpaper(req, file.filename);
  }

  @Get('avatar')
  GetProfileImage(@Query() query, @Res() res: Response) {
    const fileName = query.pfp;
    return res.sendFile(process.cwd() + '/uploads/avatars/' + fileName);
  }

  @Get('wallpaper')
  GetWallPaperImage(@Query() query, @Res() res: Response) {
    const fileName = query.wp;
    return res.sendFile(process.cwd() + '/uploads/wallpapers/' + fileName);
  }

  //----------------------------------{Serching}------------------------------

  @Get('search')
  getDataSearch(@Res() res: Response, @Query() query: querySearchParam) {
    return this.playerService.getDataSearch(res,query.search)
  }
}
