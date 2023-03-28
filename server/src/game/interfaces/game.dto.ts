import { randomUUID } from 'crypto';
import { Socket } from 'socket.io';

export class Player {
  score: number;
  id: number;
  nickname: string;
  socketId: string;
  constructor(id: number, nickname: string) {
    this.id = id;
    this.nickname = nickname;
    this.score = 0;
    this.socketId = null;
  }
}

export enum GameType {
  'RANKED',
  'NORMAL',
  'INVITE',
}
export class Game {
  id: string;
  players: [Player?, Player?];
  type: GameType;
  spectator: Player[];
  createdAt: Date;
  updatedAt: Date;

  constructor(gameType: GameType) {
    this.id = randomUUID();
    this.players = [];
    this.type = gameType;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}
