import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';
import { Request,Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';


interface jwtData {
  decoded : any, authorized:boolean
}

@Injectable()
export class JwtSessionGuard extends AuthGuard('jwt_session') {
  constructor(private jwt : JwtService) {
    super();
  }

   verifySession (req:Request) : jwtData {
    const token : string = req.cookies["jwt_session"];
    if (!token)
     return {decoded : null,authorized:false}
    const secret :string = process.env.JWT_SECRET;
   try {
      const decoded :object = this.jwt.verify(token,{secret});
      return { decoded : decoded,authorized:true };
   }
   catch (err){
      return { decoded : null,authorized:true };
   }
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
      const req :Request = context.switchToHttp().getRequest();
      const res : Response = context.switchToHttp().getResponse();

      const data : jwtData   = this.verifySession(req);

      if (data.authorized)
      {
        req.body.jwtDecoded = ({jwtDecoded:data.decoded});
        return true;
      }
      else
        return false;
  }
}

@Injectable()
export class JwtGuard extends AuthGuard('jwt_token') {
  constructor(private jwt : JwtService,private prisma : PrismaService) {
    super();
  }

  async verifyToken (req:Request, res:Response) : Promise<boolean> {
    const token = req.cookies["jwt_token"];
    if (!token)
      return false;
    const secret :string = process.env.JWT_SECRET;
   try {
      const decoded = this.jwt.verify(token,{secret});
      const resp = await this.prisma.invalidToken.findUnique({
          where : {
            token:token,
          }
      })
      if (resp)
        throw new Error("Token is invalid")
       req.body.jwtDecoded = decoded;
       return true;
   }
   catch (err){
    return false;
   }
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
      const req :Request = context.switchToHttp().getRequest();
      const res : Response = context.switchToHttp().getResponse();

      return this.verifyToken(req,res);
  }
}
