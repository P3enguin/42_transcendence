import {
  Body,
  Controller,
  Post,
  Get,
  UseGuards,
  Req,
  Res,
  Patch,
  Query,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthDto, signDTO } from './dto';
import { JwtSessionGuard, JwtGuard, Jwt2FAGuard } from 'src/auth/guard';
import { playerStrat, Token2FAQuery } from './Interfaces/Interface';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('42-callback')
  @UseGuards(AuthGuard('42'))
  async Auth42(@Req() req: Request, @Res() res: Response) {
    return this.authService.checkUser(req.user as playerStrat, res);
  }

  @Get('google-callback')
  @UseGuards(AuthGuard('google'))
  async AuthGoogle(@Req() req: Request, @Res() res: Response) {
    return this.authService.checkUser(req.user as playerStrat, res);
  }

  @Post('signup')
  @UseGuards(JwtSessionGuard)
  signup(@Req() req: Request, @Res() res: Response, @Body() dto: AuthDto) {
    return this.authService.signup(req, res, dto);
  }

  @Post('signin')
  signin(@Res() res: Response, @Body() dto: signDTO) {
    return this.authService.signin(res, dto);
  }

  @Get('verifytoken')
  @UseGuards(JwtGuard)
  verifyToken(@Req() req: Request, @Res() res: Response) {
    return res.status(200).json(req.body.user);
  }

  @Get('verifysession')
  @UseGuards(JwtSessionGuard)
  verifySession(@Req() req: Request, @Res() res: Response) {
    return res.status(200).json(req.body.user);
  }
  // same as verifyToken and verifysession
  @Get('token2FA')
  @UseGuards(Jwt2FAGuard)
  verify2FASession(@Req() req: Request, @Res() res: Response) {
    return res.status(200).json(req.body.user);
  }
  // @Get('user')
  // getUser(@Query() query: {email: string}):object {
  //    return this.authService.getUser(query.email);
  // }

  @Post('logout')
  @UseGuards(JwtGuard)
  logout(@Req() req: Request, @Res() res: Response) {
    return this.authService.logout(req, res);
  }

  @Get('enable2FA')
  @UseGuards(JwtGuard)
  enable2FA(@Req() req: Request, @Res() res: Response) {
    return this.authService.enable2FA(req.body.user, res);
  }

  @Patch('confirm2FA')
  @UseGuards(JwtGuard)
  confirm2FA(@Req() req: Request, @Res() res: Response) {
    return this.authService.confirm2FA(req.body.user, req.body.token, res);
  }

  @Patch('deactivate2FA')
  @UseGuards(JwtGuard)
  deactivate2FA(@Req() req: Request, @Res() res: Response) {
    return this.authService.deactivate2FA(
      req.body.user,
      req.body.password,
      res,
    );
  }

  @Get('verify2FA')
  @UseGuards(Jwt2FAGuard)
  verify2FA(
    @Req() req: Request,
    @Res() res: Response,
    @Query() query: Token2FAQuery,
  ) {
    return this.authService.verify2FA(req.body.user, res, query.token);
  }
}
