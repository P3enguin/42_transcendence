import { Body, Controller, Query } from "@nestjs/common";
import { Get,Post } from "@nestjs/common";
import { Req } from "@nestjs/common";
import { query } from "express";
import { AuthService } from "./auth.service";

@Controller('auth')
export class AuthController {
    constructor(private authServ:AuthService){}

    @Get('user')
    getUser(@Query() query: {code: string}) {
        console.log(query);
    }
    @Post('user')
    postData(@Body() bod:Object ):object{
        console.log(bod);
        return this.authServ.createUser();
    }
    
}