import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export const GetPlayer = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {

    const request = ctx.switchToHttp().getRequest();
    const user = request.body.jwtDecoded;
    console.log({
      user,
    });
    return data ? user?.[data] : user;
  },
);