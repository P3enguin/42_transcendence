import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetPlayer = createParamDecorator(
  (
    data: string | undefined, 
    context: ExecutionContext
  ) => {
    const ctx: Express.Request = context.switchToHttp().getRequest();
    console.log(ctx.user);
    if (data)
      return ctx.user[data]
    return ctx.user;
  },
);