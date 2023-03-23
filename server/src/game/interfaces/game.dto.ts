import { randomUUID } from 'crypto';
import { Socket } from 'socket.io';

export class Player {
  score: number | null;
  id: number;
  nickname: string;
  socket?: Socket;
  constructor(id: number, nickname: string) {
    this.id = id;
    this.nickname = nickname;
    this.score = 0;
  }
}

export enum GameType {
  'RANKED',
  'NORMAL',
}
export class Game {
  id: string;
  players: [Player?, Player?];
  type: GameType;
  viewer: Player[];
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
