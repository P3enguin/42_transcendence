import { Controller,Post,Get,Redirect,Res,Req,UseGuards} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
    constructor(private readonly AuthService: AuthService ) {}

    @Get ('login')
    @UseGuards(AuthGuard('42'))
    async login(@Req() req) {
        // console.log(req);
    }

    @Get ('callback')
    @UseGuards(AuthGuard('42'))
    loginRedirect(@Req() req) {
        console.log(req.user);
        return this.AuthService.login(req)
    }
}
