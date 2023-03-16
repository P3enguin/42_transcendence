import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetPlayer = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    console.log({
      user,
    })

    return data ? user?.[data] : user;
  },
);