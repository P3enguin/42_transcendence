export interface Player {
  id: number;
  nickname: string;
  avatar: string;
  score: number;
}

export interface Game {
  id: string;
  players: [Player, Player];
  type: string;
  createdAt: Date;
  updatedAt: Date;
}
