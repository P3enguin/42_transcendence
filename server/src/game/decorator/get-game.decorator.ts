import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetGameId = createParamDecorator(
  (context: ExecutionContext) => {
    const gameId = JSON.parse(
      context.switchToWs().getClient().handshake.query.gameId,
    );
    return gameId;
  },
);
