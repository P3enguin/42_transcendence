import { Injectable } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";

export class AuthService {
    constructor(private prismaServ: PrismaService){}

    getUser(){
        return this.prisma
    }
}