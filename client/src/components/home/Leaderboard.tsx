import Image from 'next/image';
import LeaderboardPlayerRank from './LeaderboardPlayerRank';

function Leaderboard() {
  return (
    <div className="w-full rounded-[20px] border border-white">
      <div className="flex items-center pl-4 pt-4">
        <Image
          src="rankLeaderboard.svg"
          alt="rankLeaderboard"
          width={24}
          height={24}
        />
        <h1 className="pl-2 text-xl font-bold uppercase">Leaderboard:</h1>
      </div>
      <div className="max-h-[580px] overflow-auto">
        <ol className="flex flex-col py-4 px-9">
          <li className="p-2">
            <LeaderboardPlayerRank
              nickname="Zac"
              avatar="/pfp1.png"
              rank="1"
              rankAvatar="/Amethyst.svg"
              rankColor="#8A19D4"
            />
          </li>
          <li className="p-2">
            <LeaderboardPlayerRank
              nickname="Emily"
              avatar="/pfp1.png"
              rank="22"
              rankAvatar="/rankGold.svg"
              rankColor="#EDA94A"
            />
          </li>
        </ol>
      </div>
    </div>
  );
}

export default Leaderboard;
