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
import { Request, Response, query } from 'express';
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
    @GetPlayer() player: any,
    @Query() query: queryParam,
    @Res() res: Response,
  ) {
    if (query.nickname) {
      if (player.nickname === query.nickname)
        return res.status(200).json({ IsThePlayer: true });
      return this.playerService.getDataNickname(
        player.id,
        query.nickname as string,
        res,
      );
    } else return this.playerService.getDataID(player.id as number, res);
  }

  @Patch('data')
  changeData(@Req() req: Request, @Res() res: Response) {
    return this.playerService.changeData(req.body, res);
  }

  @Patch('password')
  changePassword(@Req() req: Request, @Res() res: Response) {
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

  @Get('requests')
  GetRequests(@GetPlayer() player: Player, @Res() res: Response) {
    return this.playerService.GetRequests(player.id, res);
  }

  @Post('addRequest')
  AddRequest(
    @GetPlayer() player: Player,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    this.playerService.AddRequest(player, req.body.receiver, res);
  }

  @Post('cancelRequest')
  CancelRequest(
    @GetPlayer() player: Player,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.playerService.CancelRequest(res, player, req.body.requestId);
  }

  @Post('AcceptRequest')
  AcceptRequest(
    @GetPlayer() player: Player,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.playerService.AcceptRequest(
      player,
      req.body.senderId,
      req.body.requestId,
      res,
    );
  }

  @Post('RejectRequest')
  rejectRequest(
    @GetPlayer() player: Player,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.playerService.rejectRequest(
      player,
      req.body.senderId,
      req.body.requestId,
      res,
    );
  }

  @Get('friends')
  GetFriends(
    @Req() req: Request,
    @Res() res: Response,
    @Query() query :queryParam,
  ) {
    return this.playerService.GetFriends(req, res, query.nickname);
  }

  @Patch('block')
  BlockFriend(
    @Res() res: Response,
    @GetPlayer() player: Player,
    @Req() req: Request,
  ) {
    return this.playerService.BlockFriend(player, req.body.nickname,res);
  }
  @Get('blocked')
  GetBlockedFriends(@Res() res: Response, @Query() query: queryParam) {
    return this.playerService.GetBlockedFriends(query.nickname,res);
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
    return this.playerService.getDataSearch(res, query.search);
  }

  //----------------------------------{Games}------------------------------

  @Get('games')
  getGamesPlayer(@Res() res: Response, @Query() query: querySearchParam) {
    return this.playerService.getGamesPlayed(res, query.search);
  }

  @Get('ranked')
  getRankedGames(@Res() res: Response, @Query() query: querySearchParam) {
    return this.playerService.getRankedGames(res, query.search);
  }

  @Get('rankStat')
  getRankStats(@Res() res: Response, @Query() query: querySearchParam) {
    return this.playerService.getRankStats(res, query.search);
  }

  //----------------------------------{LeaderBoard}------------------------------

  @Get('leaderboard')
  getLeaderBoardByLevel(@Res() res: Response, @Query('limit') limit: number) {
    return this.playerService.getLeaderBoardByLevel(res, limit);
  }
}
