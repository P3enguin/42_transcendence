import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetPlayer = createParamDecorator(
  (
    data: unknown, 
    context: ExecutionContext
  ) => {
    const ctx: Express.Request = context.switchToHttp().getRequest();
    return ctx.user;
  },
);