export interface LeaderBoard {
  level: {
    player: {
      id: number;
      nickname: string;
      avatar: string;
    };
    level: number;
    rank: {
      ranks: {
        id: number;
        name: string;
        points: number;
        avatar: string;
      };
    }[];
  }[];
  rank: {
    player: {
      id: number;
      nickname: string;
      avatar: string;
    };
    level: number;
    rank: {
      ranks: {
        id: number;
        name: string;
        points: number;
        avatar: string;
      };
    }[];
  }[];
}
