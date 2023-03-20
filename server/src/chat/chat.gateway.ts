import { 
    WebSocketGateway,
    WebSocketServer,
    OnGatewayInit,
    OnGatewayConnection 
        } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class ChatGateway implements OnGatewayInit, OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    console.log('WebSocket server initialized');
  }

  handleConnection(client: any, ...args: any[]) {
    console.log(`Client connected: ${client.id}`);
    this.server.emit('message', 'Welcome to the chat room!');
  }
}