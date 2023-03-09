import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AchivementService } from 'src/achivement/achivement.service';
import { TitleService } from 'src/title/title.service';
import { Request,Response } from 'express';
import { endWith } from 'rxjs';
import * as argon2 from "argon2";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
    private achiv: AchivementService,
    private title: TitleService,
  ) {}


  async checkUser( req:any,res:any,AuthMethod:string) {

    console.log(req.user);
    var userEmail = req.user.email;
    const accessTokenObj = {AuthMethod: AuthMethod, accessToken: req.user.accessToken};
    try {
        const player = await this.prisma.player.findUnique({
            where : {
                email: userEmail,
            },
            select : {
                id : true,
                nickname: true,
                email: true,
                avatar: true,

            }
        })
        if (!player)
        {
          res.status(200).cookie('access_token', JSON.stringify(accessTokenObj), { httpOnly: true, secure: true });
          res.redirect(process.env.SESSION_AUTH_REDIRECTION);
        }
        else
        {
          const jwtToken = await this.signToken(player.id, player.nickname);
          res.cookie('jwt_token', jwtToken.access_token, {
            httpOnly: true,
            secure: true,
            maxAge: 1000 * 60 * 60 // expires after 1 hour, to change and check later hh 
          });
          res.redirect(process.env.FULL_AUTH_REDIRECTION);
        }
    }
    catch(e) {
        console.log(e);
        if (e instanceof PrismaClientKnownRequestError) {
            console.log(`code : ${e.code} ,message : ${e.message}`);
        }
    } 
  }
  

  async signup(req:Request, res:any,dto:AuthDto) {
    const session = req.cookies["access_token"]
    // useless method , should be changed , checked by a real authguard or something !! ! ! !
    if (!session)
      return {Error : "Unauthorized to put data !"}
    
    try {
      await this.achiv.fillAvhievememt();
      await this.title.fillTitles();
      const hash = await argon2.hash(dto.password);
      const player = await this.prisma.player.create({
        data: {
          email: dto.email,
          nickname: dto.nickname,
          firstname: dto.firstname,
          lastname: dto.lastname,
          password: hash,
          // add and hash password
          status:  {
            create: {
            },
          },
        },
      });
      await  this.achiv.asignAchiv(player.statusId);
      const jwtToken = await this.signToken(player.id, player.nickname);
      res.cookie('jwt_token', jwtToken.access_token, {
        httpOnly: true,
        secure: true,
        maxAge: 1000 * 60 * 60 // expires after 1 hour, to change and check later hh 
      });
      res.status(201).send({ success: true });
    }  catch(e) {
      if (e instanceof PrismaClientKnownRequestError) {
          // The .code property can be accessed in a type-safe manner
          if (e.code === 'P2002') {
            return {error:"error Nickname already exist",nickname:null}
          }
          else {
              return {error:"An Error has occured"}
          }
    }} 
  }

  
  async signin(dto: AuthDto) {
    const player =
      await this.prisma.player.findUnique({
        where: {
          nickname: dto.nickname,
        },
      });
    if (!player)
      throw new ForbiddenException(
        'Credentials incorrect',
      );

    return this.signToken(player.id, player.email);
  }

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
                firstname:true,
                lastname:true,
            }
        })
    }
    catch(e) {
        console.log(e);
        if (e instanceof PrismaClientKnownRequestError) {
            console.log(`code : ${e.code} , message : ${e.message}`);
        }
    }
    if (!user)
        return {
            nickname: null,
            error:"Error user not found"
        }
    return user;
  }


  async signToken(
    playerId: number,
    nickname: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: playerId,
      nickname,
    };
    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwt.signAsync(
      payload,
      {
        expiresIn: '60m',
        secret: secret,
      },
    );
    return {
      access_token: token,
    };
  }
}
