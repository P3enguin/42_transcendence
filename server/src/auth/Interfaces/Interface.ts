import { Player } from "@prisma/client";

export interface playerStrat {
    email: string;
    firstName: string;
    lastName: string;
    picture: string;
    coins: number;
    accessToken: string;
  }

export interface UserToken {
  id : number;
}

export interface jwtData {
  decoded: any;
  authorized: boolean;
}

export interface user extends Player {
  jwt?: {
    exp: number;
    iat: number;
  };
}
