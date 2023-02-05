import { Module } from "@nestjs/common";
import { authController } from "./app.controller";

@Module ({
    controllers:[authController],
    providers:[],
})

export class authModule {};