import { createParamDecorator, ExecutionContext, Logger } from '@nestjs/common';
import { Socket } from 'socket.io';

export const GetPlayer = createParamDecorator(
  (data: string | undefined, context: ExecutionContext) => {
    const client: Socket = context.switchToWs().getClient();
    const user = client.handshake.query.user as string;
    if (user) {
      const player = JSON.parse(user);
      return data ? player && player[data] : player;
    }
    else return null;
    // try {
    // } catch (e) {
    //   console.log(user);
      
    //   Logger.error(e, 'GetPlayer');
    //   return null;
    // }
    // const user = JSON.parse(wsreq.handshake.query.user);
  },
);
