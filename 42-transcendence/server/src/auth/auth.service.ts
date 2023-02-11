import { Injectable } from "@nestjs/common";
import { PrismaClient } from "prisma/client";
import { AuthDto } from "./dto/auth.dto";
export class AuthService {

    prisma = new PrismaClient();
    async getUser(userEmail: string){
        const user = await this.prisma.player.findUnique({
            where : {
                email: userEmail,
            },
            select : {
                nickname: true,
                email: true,
            }
        })
        if (!user)
            return {
                nickname: null,
                email: null,
            }
        return user;
    }
    async createUser(dto:AuthDto) {
        const user = await this.prisma.player.create({
            data: {
                nickname:dto.nickname,
                email: dto.email,
            }
        })
        return user;
    }
}