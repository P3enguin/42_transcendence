import { Injectable } from "@nestjs/common";
import { HttpService } from '@nestjs/axios';
import { JwtService } from '@nestjs/jwt';

@Injectable({})
export class AuthService {
    constructor(
        private jwtService: JwtService) {}
     
    login(req){
    if (!req.user) {
        return 'No user '
    }
    
    const payload = {login: req.user.login}
    return {
    // here if user exist I can do whatever I want with that user 
        acces_token: this.jwtService.sign(payload),
    }
}
}