import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';

interface jwtData {
  decoded: any;
  authorized: boolean;
}

@Injectable()
export class JwtSessionGuard extends AuthGuard('jwt_session') {
  constructor(private jwt: JwtService) {
    super();
  }

  verifySession(req: Request): jwtData {
    const token: string = req.cookies['jwt_session'];
    if (!token) return { decoded: null, authorized: false };
    const secret: string = process.env.JWT_SECRET;
    try {
      const decoded: object = this.jwt.verify(token, { secret });
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
      req.body.jwtDecoded = { jwtDecoded: data.decoded };
      return true;
    } else return false;
  }
}

@Injectable()
export class JwtGuard extends AuthGuard('jwt_token') {
  constructor(private jwt: JwtService, private prisma: PrismaService) {
    super();
  }
  async verifyToken(token: string): Promise<object> {
    if (!token) return null;
    const secret: string = process.env.JWT_SECRET;
    try {
      const decoded: object = this.jwt.verify(token, { secret });
      const resp = await this.prisma.invalidToken.findUnique({
        where: {
          token: token,
        },
      });
      if (resp) throw new Error('Token is invalid');
      return decoded;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req: Request = context.switchToHttp().getRequest();
    const res: Response = context.switchToHttp().getResponse();
    const token = req.cookies['jwt_token'];

    req.body.jwtDecoded = this.jwt.decode(token);
    return req.body.jwtDecoded ? true : false;
  }
}
