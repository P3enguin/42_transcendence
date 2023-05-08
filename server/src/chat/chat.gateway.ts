import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
 } from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { Socket, Server } from 'socket.io';
import { Body } from '@nestjs/common';
import {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from './inteface';
import { Player } from '@prisma/client';
import { JwtGuard } from 'src/auth/guard';
import { GetPlayer } from 'src/auth/decorator';

export interface LogPlayer extends Player {
  socketId?: string;
}

@WebSocketGateway({
  namespace: 'chat',
  cors: {
    origin: '*',
  },
})

export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
 constructor(private chatservice: ChatService) {}
 
 @WebSocketServer() server: Server;
 
 @SubscribeMessage('sendMessage')
 async handleSendMessage(client: Socket, payload: string): Promise<void> {
   await this.chatservice.SendPrivMessage("wqeqwe", payload);
   this.server.emit('recMessage', payload);
 }
 
 afterInit(server: Server) {
   console.log(server);
   
 }
 
 handleDisconnect(client: Socket) {
   console.log(`Disconnected: ${client.id}`);
   
 }
 
 handleConnection(client: Socket, ...args: any[]) {
   console.log(`Connected ${client.id}`);
   
 }
}