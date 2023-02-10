import { Body, Controller, Query } from "@nestjs/common";
import { Get,Post } from "@nestjs/common";
import { Req } from "@nestjs/common";
import { query } from "express";


@Controller('auth')
export class authController {
    @Get('user')
    getUser(@Query() query: {code: string}) {
        console.log(query);
        return  this.
    }
    @Post('user')
    postData(@Body() bod:Object ):object{
        console.log(bod);
        return {hh:"welldone"};
    }
    
}