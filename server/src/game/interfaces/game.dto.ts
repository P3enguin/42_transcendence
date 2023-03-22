import { Socket } from 'socket.io';

export class Player {
  id : number;
  nickname: string;
  socket?: Socket;
}

export class Game {
  id: string;
  players: [Player?, Player?];
  // viewer: Player[];
  score: [number, number];
  createdAt: Date;
  updatedAt: Date;
}
