import { Injectable } from "@nestjs/common";
import { HttpService } from '@nestjs/axios';

@Injectable({})
export class AuthService{
    login(req){
        if (!req.user)
        {
            return 'No user '
        }
    return {
        // here if user exist I can do whatever I want with that user 
        message: 'User information from 42auth',
        user: req.user
      }
    }
}