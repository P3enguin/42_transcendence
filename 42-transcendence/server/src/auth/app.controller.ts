import { Body, Controller, Query } from "@nestjs/common";
import { Get,Post } from "@nestjs/common";
import { Req } from "@nestjs/common";
import { query } from "express";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto/auth.dto";

@Controller('auth')
export class AuthController {
    constructor(private authServ:AuthService){}

    @Get('user')
    getUser(@Query() query: {email: string}):object {
       return this.authServ.getUser(query.email);
    }
    
    @Post('user')
    postData(@Body() dto: AuthDto ):object{
        console.log(dto);
        return this.authServ.createUser(dto);
    }
    
}