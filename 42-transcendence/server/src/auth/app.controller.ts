import { Body, Controller, Query } from "@nestjs/common";
import { Get,Post } from "@nestjs/common";
import { Req } from "@nestjs/common";
import { query } from "express";


@Controller('auth')
export class authController {
    @Get('data')
    getAccessToken(@Query() query: {code: string}) {
        console.log(query);
        return  {
            hh:'hh'
        }
    }
    @Post('data')
    postData(@Body() bod:Object ):object{
        console.log(bod);
        return {hh:"welldone"};
    }
    
}