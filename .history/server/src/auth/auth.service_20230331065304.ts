import {
  ForbiddenException,
  Injectable,
  UseGuards,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto,singDTO } from './dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AchivementService } from 'src/achivement/achivement.service';
import { TitleService } from 'src/title/title.service';
import { Request,Response } from 'express';
import * as argon2 from "argon2";

interface playerStrat {
  email: string,
  firstName: string,
  lastName: string,
  picture: string,
  coins: number,
  accessToken: string,
}



@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
    private achiv: AchivementService,
    private title: TitleService,
    // private rank: RankService,
  ) {}
  
  async checkUser( user:playerStrat,res:Response) {
    
    try {
        const player = await this.prisma.player.findUnique({
            where : {
                email: user.email,
            },
            select : {
                id : true,
                nickname: true,
                email: true,
                avatar: true,
            }
        })
        // the player not exist : create a short-live jwt and redirect to complete the profile
        if (!player)
        { 
          const secret = process.env.JWT_SECRET;
          const jwtSession = await this.jwt.signAsync(
          user,
          {
            expiresIn: '15m',
            secret: secret,
          })
          res.status(200).cookie('jwt_session',jwtSession,{ 
            httpOnly: true, 
            // secure: true, 
            maxAge: 1000 * 60 * 15 // expires after 15 min
          });   
          res.redirect(process.env.FRONTEND_HOST + "/login");
        }
        else
        {
          const jwtToken = await this.signToken(player.id, player.nickname);
          res.cookie('jwt_token', jwtToken.access_token, {
            httpOnly: true,
            // secure: true,
            maxAge: 1000 * 60 * 60 // expires after 1 hour, to change and check later hh 
          });
          res.redirect(process.env.FRONTEND_HOST + "/profile");
        }
    }
    catch(e) {
        console.log(e);
        if (e instanceof PrismaClientKnownRequestError) {
            console.log(`code : ${e.code} ,message : ${e.message}`);
        }
    } 
  }
  
  async signup(req:Request, res:Response,dto:AuthDto) {

    const secret :string = process.env.JWT_SECRET;
    try {
      await this.achiv.fillAvhievememt();
      await this.title.fillTitles();
      // await this.ra
      const hash = await argon2.hash(dto.password);
      const player = await this.prisma.player.create({
        data: {
          email: dto.email,
          nickname: dto.nickname,
          firstname: dto.firstname,
          lastname: dto.lastname,
          password: hash,
          coins:dto.coins,
          status:  {
            create: {
            },
          },
        },
      });
      await  this.achiv.assignAchiv(player.statusId);
      await  this.title.assignTitle(player.statusId);
      const jwtToken = await this.signToken(player.id, player.nickname);
      res.cookie('jwt_token', jwtToken.access_token, {
        httpOnly: true,
        // secure: true,
        maxAge: 1000 * 60 * 60 // expires after 1 hour, to change and check later hh 
      });
      res.clearCookie("jwt_session");
      res.status(201).send({ success: true });
    }  catch(e) {
      var error ;
      if (e instanceof PrismaClientKnownRequestError) {
          if (e.code === 'P2002') {
            error =  "Nickname already exist";
          }
          else {
            error = "An Error has occured";
          }
        }
        // error handling for invalid session token
          return res.status(401).send(JSON.stringify({error: error}));
        } 
  }

  
  async signin(res:Response, dto: singDTO) {
    try {
      const player =
      await this.prisma.player.findUnique({
        where: {
          nickname: dto.nickname,
        },
        select:{
          id : true,
          password:true,
          nickname:true,
        }
      });
      if (!player)
        throw new ForbiddenException(
          'Nickname Not found',
          );
      if (await argon2.verify(player.password,dto.password))
      {
        const token = await this.signToken(player.id, player.nickname);
        res.cookie('jwt_token', token.access_token, {
          httpOnly: true,
          // secure: true,
          maxAge: 1000 * 60 * 60
        });
        res.status(200).send({ success: true });
      }
      else {
        throw new ForbiddenException(
          'Password Incorrect',
        );
      }
    }
    catch (err)
    {
      console.log(err);
      res.status(401).json({error : err});
    }

  }

  // async getUser(userEmail: string){
  //   var user :object;
  //   try {
  //       user = await this.prisma.player.findUnique({
  //           where : {
  //               email: userEmail,
  //           },
  //           select : {
  //               nickname: true,
  //               email: true,
  //               firstname:true,
  //               lastname:true,
  //           }
  //       })
  //   }
  //   catch(e) {
  //       console.log(e);
  //       if (e instanceof PrismaClientKnownRequestError) {
  //           console.log(`code : ${e.code} , message : ${e.message}`);
  //       }
  //   }
  //   if (!user)
  //       return {
  //           nickname: null,
  //           error:"Error user not found"
  //       }
  //   return user;
  // }

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

  async logout(req:Request,res:Response) {
    const token = req.cookies["jwt_token"];
    try {
        await this.prisma.invalidToken.create ({
          data :
          {
            token : token,
            ExpireDate: new Date(req.body.jwtDecoded.exp * 1000),
          }
        })
        res.status(201).clearCookie('jwt_token').json({success:"logged out succesfully"});
      }
      catch (err){
        console.log(err);
        return res.status(401).json({error : err});
      }
  }
}
