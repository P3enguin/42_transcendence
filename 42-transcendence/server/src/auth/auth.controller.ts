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
  async checkUser(@Req() req:any , @Res() res:any) {
      return this.authService.checkUser(req,res);
  }


  @Post("signup")
  signup(@Req() req:Request,  @Body() dto:AuthDto) {
    console.log(req.cookies['42access_token']);
    return this.authService.signup(req,dto);
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
