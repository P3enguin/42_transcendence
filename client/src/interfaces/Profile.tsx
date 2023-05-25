export interface GameType {
  isPlayerLoser: boolean;
  isPlayerWinner: boolean;
  loserId: {
    id: number;
    nickname: string;
    avatar: string;
  };
  playedAt: string;
  score: string;
  winnerId: { id: number; nickname: string; avatar: string };
  type?: string;
}
