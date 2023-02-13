import { Injectable } from "@nestjs/common";
import { PrismaClient ,Prisma } from "prisma/client";
import { AuthDto } from "./dto/auth.dto";

export class AuthService {
    prisma = new PrismaClient();
    async getUser(userEmail: string){
        var user :object;
        try {
            user = await this.prisma.player.findUnique({
                where : {
                    email: userEmail,
                },
                select : {
                    nickname: true,
                    email: true,
                }
            })
        }
        catch(e) {
            console.log(e);
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                console.log(`code : ${e.code} , message : ${e.message}`);
            }
        }
        if (!user)
            return {
                nickname: null,
                email: null,
            }
        return user;
    }
    async createUser(dto:AuthDto) {
        var user: object ;
        try {
            user = await this.prisma.player.create({
                data: {
                    nickname:dto.nickname,
                    email: dto.email,
                }
            })
        }
        catch(e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                // The .code property can be accessed in a type-safe manner
                if (e.code === 'P2002') {
                  return {error:"error Nickname already exist",nickname:null}
                }
                else {
                    return {error:"An Error has occured"}
                }
        }}
        console.log(user);
        return user;
    }
}