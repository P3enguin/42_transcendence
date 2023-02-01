import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { Auth42Strategy } from "./auth.strategy";
import { JwtModule } from '@nestjs/jwt';


@Module({
    imports: [JwtModule.register({secret: 'hh',signOptions: { expiresIn: '60s' }})],
    controllers: [AuthController],
    providers: [AuthService,Auth42Strategy],
    
})

export class AuthModule{}