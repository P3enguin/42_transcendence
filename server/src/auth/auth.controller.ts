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
import { AuthDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  

  @Get('42-callback')
  @UseGuards(AuthGuard('42'))
  async Auth42(@Req() req:any , @Res() res:any) {
    return this.authService.checkUser(req,res,"42");
  }

  @Get('google-callback')
  @UseGuards(AuthGuard('google'))
  async AuthGoogle(@Req() req:any, @Res() res:any){
    return this.authService.checkUser(req,res,"google");
  }

  @Post("signup")
  signup(@Req() req:Request, @Res() res:any , @Body() dto:AuthDto) {
    return this.authService.signup(req,res,dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  signin(@Body() dto: AuthDto) {
    return this.authService.signin(dto);
  }

  @Get('user')
  getUser(@Query() query: {email: string}):object {
     return this.authService.getUser(query.email);
  }

}
