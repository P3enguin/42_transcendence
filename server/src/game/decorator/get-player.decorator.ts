import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetPlayer = createParamDecorator(
  (data: string | undefined, context: ExecutionContext) => {
    const user = JSON.parse(
      context.switchToWs().getClient().handshake.query.user,
    );
    // const user = JSON.parse(wsreq.handshake.query.user);
    return data ? user && user[data] : user;
  },
);
