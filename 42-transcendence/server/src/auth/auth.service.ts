import { Injectable } from "@nestjs/common";
import { PrismaClient } from "prisma/client";

export class AuthService {

    prisma = new PrismaClient();
    // getUser(){
    //     return this.prisma.player.
    // }
    async createUser() {
        const user = await this.prisma.player.create({
            data: {
                nickname:'ypencel',
                email: 'hh@mok.com',
            }
        })
        return user;
    }
}