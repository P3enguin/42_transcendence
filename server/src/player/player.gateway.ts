import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  namespace: 'player',
  cors: {
    origin: '*',
  },
})
export class PlayerGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  async handleConnection(client: Socket) {
    // console.log('Client connected: ' + client.id);
  }

  handleDisconnect(client: Socket) {
    // console.log('Client disconnected: ' + client.id);
  }

  @SubscribeMessage('route')
  handlerRoute(client: Socket, payload: any) {
    // console.log('route: ', payload);
  }
}
