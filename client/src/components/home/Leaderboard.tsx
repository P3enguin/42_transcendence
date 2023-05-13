import Image from 'next/image';
import LeaderboardPlayerRank from './LeaderboardPlayerRank';
import { LeaderBoard } from '@/interfaces/LeaderBoard';

export default function Leaderboard({
  leaderBoard,
}: {
  leaderBoard: LeaderBoard;
}) {
  return (
    <div className="w-full rounded-[20px] border border-white pb-3 pr-3">
      <div className="flex items-center pl-4 pt-4">
        <Image
          src="/rankLeaderboard.svg"
          alt="rankLeaderboard"
          width={24}
          height={24}
        />
        <h1 className="pl-2 text-xl font-bold uppercase">Leaderboard:</h1>
      </div>
      <div className="scrollbar max-h-[580px] overflow-auto">
        <ol className="flex flex-col px-9 py-4">
          {leaderBoard.level.map((player: any, i: number) => (
            <li key={i} className="p-2">
              <LeaderboardPlayerRank
                nickname={player.player.nickname}
                avatar={
                  process.env.NEXT_PUBLIC_BACKEND_HOST +
                  '/avatars/' +
                  player.player.avatar
                }
                rankNo={i + 1}
                rankName={player.rank[0].ranks.avatar}
                rankColor="#8A19D4"
              />
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
