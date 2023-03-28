import { IsNotEmpty, IsString } from 'class-validator';

export interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
  joined: (game: any) => void;
  startGame: (game: any) => void;
  connected: (message: string) => void;
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
