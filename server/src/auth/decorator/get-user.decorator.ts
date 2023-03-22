import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetPlayer = createParamDecorator(
  (data: string | undefined, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();
    console.log(req.body.user);
    if (data) return req.body.user[data];
    return req.body.user;
  },
);
