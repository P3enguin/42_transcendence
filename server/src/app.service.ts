import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io-client';

export enum UserStatus {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
  AWAY = 'AWAY',
  IN_GAME = 'IN_GAME',
}


@Injectable()
export class AppService {
  // socket.id -> userStatus
  socketStatus: Map<string, UserStatus> = new Map();

  getHello(): string {
    return 'Hello there! From the Server of Ponginator!';
  }

}
