import { IsNotEmpty, IsString } from 'class-validator';

export interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
  joined: (data: any) => void;
  left: (data: any) => void;
  startGame: (data: any) => void;
  connected: (data: any) => void;
  update: (data: any) => void;
  moveBall: (data: any) => void;
  movePaddle: (data: any) => void;
  updateScore: (data: any) => void;
  updateBall: (data: any) => void;
  updatePaddle: (data: any) => void;
  gameOver: (data: any) => void;
  newGame: (data: any) => void;
  LiveGames: (data: any) => void;
  gameRules: (data: any) => void;
}

export interface ClientToServerEvents {
  hello: () => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export class SocketData {
  @IsNotEmpty()
  @IsString()
  username: string;
}
