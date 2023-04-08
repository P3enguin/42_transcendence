import { randomUUID } from 'crypto';
import { Socket } from 'socket.io';

export class Player {
  score: number;
  id: number;
  nickname: string;
  socketId: string;
  constructor(id: number, nickname: string, socketId?: string) {
    this.id = id;
    this.nickname = nickname;
    this.score = 0;
    this.socketId = socketId || null;
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
    this.spectator = [];
    this.type = gameType;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  isFull() {
    // check if game is full and both players are connected
    return (
      this.players.length === 2 &&
      this.players[0].socketId &&
      this.players[1].socketId
    );
  }

  connectPlayer(nickname: string, socketId: string) {
    const player = this.players.find((p) => p.nickname === nickname);
    if (player) {
      player.socketId = socketId;
    }
  }

  isPlayer(nickname: string) {
    return this.players.find((p) => p.nickname === nickname);
  }

  addSpectator(player: Player) {
    this.spectator.push(player);
  }

  removePlayer(nickname: string) {
    this.players = this.players.filter((p) => p.nickname !== nickname) as [
      Player?,
      Player?,
    ];
  }

  getPlayerPosition(nickname: string) {
    const player = this.players.find((p) => p.nickname === nickname);
    return this.players.indexOf(player) === 0 ? 'Bottom' : 'Top';
  }
}
