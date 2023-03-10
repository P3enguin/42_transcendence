import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Get,
  Query,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import { Request,Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthDto, singDTO} from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  

  @Get('42-callback')
  @UseGuards(AuthGuard('42'))
  async Auth42(@Req() req:any , @Res() res:Response) {
    return this.authService.checkUser(req.user,res);
  }

  @Get('google-callback')
  @UseGuards(AuthGuard('google'))
  async AuthGoogle(@Req() req:any, @Res() res:Response){
    return this.authService.checkUser(req.user,res);
  }

  @Post("signup")
  signup(@Req() req:Request, @Res() res:Response , @Body() dto: AuthDto) {
    return this.authService.signup(req,res,dto);
  }

  @Post('signin')
  signin(@Res() res:Response,@Body() dto: singDTO) {
    return this.authService.signin(res,dto);
  }

  @Get('verifytoken')
  verifyToken(@Req() req:Request,@Res() res:Response){
    return this.authService.verifyToken(req,res);
  }

  @Get('verifysession')
  verifySession(@Req() req:Request,@Res() res:Response){
    return this.authService.verifySession(req,res);
  }

  @Get('user')
  getUser(@Query() query: {email: string}):object {
     return this.authService.getUser(query.email);
  }

  @Post('logout')
  logout(@Req() req:Request,@Res() res:Response)
  {
    return this.authService.logout(req,res);
  }

}
