import { 
    WebSocketGateway,
    WebSocketServer,
    OnGatewayInit,
    OnGatewayConnection 
        } from '@nestjs/websockets';

import { Server } from 'socket.io';
import { JwtGuard } from 'src/auth/guard';

let players = new Map<number, string>();


@WebSocketGateway({
  namespace: 'chat',
  cors: {
    origin: '*',
  },
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  handleConnection(client: any, ...args: any[]) {
    const player = this.;
  }
}