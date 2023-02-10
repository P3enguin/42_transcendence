import { Module } from "@nestjs/common";
import { PrismaModule } from "prisma/prisma.module";
import { authController } from "./app.controller";


@Module ({
    controllers:[authController],
    providers:[],   
})

export class authModule {};