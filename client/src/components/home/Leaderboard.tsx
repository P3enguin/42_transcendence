import Image from 'next/image';
import { Level, Rank, LeaderBoard } from '@/interfaces/LeaderBoard';
import LeaderboardPlayerLevel from './LeaderboardPlayerLevel';
import LeaderboardPlayerRank from './LeaderboardPlayerRank';

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
      <div className="scrollbar h-[580px] overflow-auto">
        <ol className="flex h-full flex-col px-9 py-4">
          {leaderBoard.rank.length == 0 && (
            <div className="flex h-full w-full items-center justify-center">
              <p>No users</p>
            </div>
          )}
          {leaderBoard.rank.map((player: Rank, i: number) => (
            <li key={i} className="p-2">
              <LeaderboardPlayerRank
                nickname={player.status.player.nickname}
                avatar={
                  process.env.NEXT_PUBLIC_BACKEND_HOST +
                  '/avatars/' +
                  player.status.player.avatar
                }
                rankNo={i + 1}
                rankName={player.rank.name}
                rankColor="#8A19D4"
              />
            </li>
          ))}
          {/* {leaderBoard.level.map((player: Level, i: number) => (
            <li key={i} className="p-2">
              <LeaderboardPlayerLevel
                nickname={player.player.nickname}
                avatar={
                  process.env.NEXT_PUBLIC_BACKEND_HOST +
                  '/avatars/' +
                  player.player.avatar
                }
                rankNo={i + 1}
                level={player.level}
              />
            </li>
          ))} */}
        </ol>
      </div>
    </div>
  );
}
