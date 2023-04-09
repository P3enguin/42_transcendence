import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { Player } from '@prisma/client';
import { jwtData,user,decodedTokenInterface } from '../Interfaces/Interface';
@Injectable()
export class JwtSessionGuard extends AuthGuard('jwt_session') {
  constructor(private jwt: JwtService) {
    super();
  }

  verifySession(req: Request): jwtData {
    const token: string = req.cookies['jwt_session'];
    if (!token) return { decoded: null, authorized: false };
    const secret: string = process.env.JWT_SESSION;
    try {
      const decoded: decodedTokenInterface = this.jwt.verify(token, { secret });
      return { decoded: decoded, authorized: true };
    } catch (err) {
      return { decoded: null, authorized: true };
    }
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req: Request = context.switchToHttp().getRequest();
    const res: Response = context.switchToHttp().getResponse();

    const data: jwtData = this.verifySession(req);

    if (data.authorized) {
      req.body.user = { jwtDecoded: data.decoded };
      return true;
    } else return false;
  }
}

@Injectable()
export class JwtGuard extends AuthGuard('jwt_token') {
  constructor(private jwt: JwtService, private prisma: PrismaService) {
    super();
  }
  async verifyToken(token: string): Promise<Player> {
    if (!token) return null;
    const secret: string = process.env.JWT_SECRET;
    try {
      const isInvalidToken = await this.prisma.invalidToken.findUnique({
        where: { token },
      });
      if (isInvalidToken) throw new Error('Error: invalid token');
      const decoded: decodedTokenInterface = this.jwt.verify(token, { secret });
      const user: user = await this.prisma.player.findUnique({
        where: {
          id: decoded['id'],
          include :{
            
          }
        },
      });
      if (!user) throw new Error('Error: invalid token');
      delete user.password;
      user.jwt = { exp: decoded['exp'], iat: decoded['iat'] };
      return user;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();
    const res: Response = context.switchToHttp().getResponse();
    const token: string = req.cookies['jwt_token'];
    if (!token) return false;
    req.body.user = await this.verifyToken(token);
    if (req.body.user) {
      return true;
    } else {
      return false;
    }
    // return this.verifyToken(token);
  }
}
  @Injectable()
  export class Jwt2FAGuard extends AuthGuard('jwt_2FA') {
    constructor(private jwt: JwtService, private prisma: PrismaService) {
      super();
    }
  
    async verifyToken(token: string): Promise<Player> {
      if (!token) return null;
      const secret: string = process.env.JWT_2FA;
      try {
        const isInvalidToken = await this.prisma.invalidToken.findUnique({
          where: { token },
        });
        if (isInvalidToken) throw new Error('Error: invalid token');
        const decoded: decodedTokenInterface = this.jwt.verify(token, { secret });
        console.log(decoded);
        const user: user = await this.prisma.player.findUnique({
          where: {
            id: decoded['id'],
          },
        });
        if (!user) throw new Error('Error: invalid token');
        delete user.password;
        user.jwt = { exp: decoded['exp'], iat: decoded['iat'] };
        return user;
      } catch (err) {
        console.log(err);
        return null;
      }
    }
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const req: Request = context.switchToHttp().getRequest();
      const res: Response = context.switchToHttp().getResponse();
      const token: string = req.cookies['jwt_2FA'];
      if (!token) return false;
      req.body.user = await this.verifyToken(token);
      console.log(req.body.user);
      if (req.body.user) {
        return true;
      } else {
        return false;
      }
    }
  
}
