import { Module } from "@nestjs/common";
import { AuthController } from "./app.controller";
import { AuthService } from "./auth.service";


@Module ({
    controllers:[AuthController],
    providers:[AuthService],   
})

export class AuthModule {};