import { IsNotEmpty, IsString } from 'class-validator';

export interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
  connected: (data: any) => void;
  message: (data: any) => void;
  NewLogIn: (data: any) => void;
  NewLogOut: (data: any) => void;
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
