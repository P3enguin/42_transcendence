import { Player } from "@prisma/client";

export interface playerStrat {
    email: string;
    firstName: string;
    lastName: string;
    picture: string;
    coins: number;
    accessToken: string;
  }

export interface decodedTokenInterface {
  id: number,
  nickname: string,
  iat: number,
  xp: number ,
}

export interface UserToken {
  id : number;
  email : string;
}

export interface jwtData {
  decoded: decodedTokenInterface;
  authorized: boolean;
}


export interface user extends Player {
  jwt?: {
    exp: number;
    iat: number;
  };
}


export interface Token2FAQuery  {
  token : string;
}