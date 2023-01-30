import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { Auth42Strategy } from "./auth.strategy";

@Module({
    controllers: [AuthController],
    providers: [AuthService,Auth42Strategy],
    
})

export class AuthModule{}