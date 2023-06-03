export interface Level {
  player: {
    nickname: string;
    avatar: string;
  };
  level: number;
  XP: number;
}

export interface Rank {
  status: {
    player: {
      nickname: string;
      avatar: string;
    };
  };
  rank: {
    name: string;
  };
}

export interface LeaderBoard {
  rank: Rank[];
}
