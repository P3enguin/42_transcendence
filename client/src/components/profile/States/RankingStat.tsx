import { MatchData, Rank } from './StateComps';
import { RankingIconFix } from '@/components/icons/Icons';
import { useState, useEffect } from 'react';
import { calculateTimeElapsed } from '@/components/tools/functions';
import Image from 'next/image';
function RankingStat({ nickname }: { nickname: string }) {
  const [games, setGames] = useState([]);
  const [rankStat, setRankStat] = useState<any>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await fetch(
          process.env.NEXT_PUBLIC_BACKEND_HOST +
            '/players/ranked?' +
            new URLSearchParams({ search: nickname }),
          {
            credentials: 'include',
          },
        );

        if (resp.ok) {
          const games = await resp.json();
          setGames(games);
          const resp2 = await fetch(
            process.env.NEXT_PUBLIC_BACKEND_HOST +
              '/players/rankStat?' +
              new URLSearchParams({ search: nickname }),
            {
              credentials: 'include',
            },
          );
          if (resp2.ok) {
            const stats = await resp2.json();
            setRankStat(stats);
            setIsLoading(false);
          }
        } else {
          // make div to return an error or something
          return;
        }
      } catch (error) {
        console.log('An error has occurred');
      }
    };
    fetchData();
  }, [nickname]);
  const ranks = [
    'Unranked',
    'Iron',
    'Bronze',
    'Silver',
    'Gold',
    'Platinum',
    'Diamond',
    'Amethyst',
    'RedStar',
    'Master',
    'King',
  ];
  if (isLoading) return <div>Loading Data...</div>;
  else {
    return (
      <div className="flex flex-col p-8 pb-0">
        <div className="flex h-[100px] w-full items-center  overflow-x-auto ">
          <div className="relative mb-4 h-4 w-[980px] rounded-full bg-[#0D1743]  ">
            <div
              className="h-4 rounded-full bg-[#01FD91] "
              style={{ width: rankStat.current_points }}
            ></div>
            <div className="relative -left-[2.5px] -top-9 flex w-[1000px] flex-row justify-between ">
              <Rank
                rank={ranks[1]}
                width="w-[50px]"
                isVisible={rankStat?.rankId >= 1 ? true : false}
              />
              <Rank
                rank={ranks[2]}
                width="w-[50px]"
                isVisible={rankStat?.rankId >= 2 ? true : false}
              />
              <Rank
                rank={ranks[3]}
                width="w-[50px]"
                isVisible={rankStat?.rankId >= 3 ? true : false}
              />
              <Rank
                rank={ranks[4]}
                width="w-[50px]"
                isVisible={rankStat?.rankId >= 4 ? true : false}
              />
              <Rank
                rank={ranks[5]}
                width="w-[55px]"
                isVisible={rankStat?.rankId >= 5 ? true : false}
              />
              <Rank
                rank={ranks[6]}
                width="w-[55px]"
                isVisible={rankStat?.rankId >= 6 ? true : false}
              />
              <Rank
                rank={ranks[7]}
                width="w-[60px]"
                isVisible={rankStat?.rankId >= 7 ? true : false}
              />
              <Rank
                rank={ranks[8]}
                width="w-[60px]"
                isVisible={rankStat?.rankId >= 8 ? true : false}
              />
              <Rank
                rank={ranks[9]}
                width="w-[60px]"
                isVisible={rankStat?.rankId >= 9 ? true : false}
              />
              <Rank
                rank={ranks[10]}
                width="w-[70px]"
                isVisible={rankStat?.rankId >= 10 ? true : false}
              />
            </div>
          </div>
        </div>

        <div
          className="flex h-[250px] flex-col  justify-between border-t-2 border-gray-100 border-opacity-70 
                       text-sm lg:flex-row lg:gap-10"
        >
          <div
            className="mt-10 flex flex-col items-center justify-start gap-5  
                      border-0 border-gray-100 border-opacity-70 text-sm 
                      lg:w-[50%] lg:border-r-2"
          >
            <h1>STATS:</h1>
            <div className="flex w-1/2 flex-row items-center  justify-evenly gap-3 lg:w-2/3">
              <Image
                width={20}
                height={20}
                src="/star.svg"
                alt="startIcon"
                className="ml-2 h-full w-[20px]"
              ></Image>
              <p className="w-[150px] ">
                Rank Point : {rankStat.current_points + ' RP'}{' '}
              </p>
            </div>
            <div className="flex w-1/2 flex-row items-center justify-evenly lg:w-2/3">
              <RankingIconFix />
              <p className="w-[150px] ">
                Current Rank:&nbsp; {ranks[rankStat.rankId]}
              </p>
            </div>
            <div className="flex w-1/2 flex-row items-center justify-evenly lg:w-2/3">
              <RankingIconFix />
              <p className="w-[150px] ">
                Next Rank: &nbsp;
                {rankStat.rankId + 1 < 9
                  ? ranks[rankStat.rankId + 1]
                  : 'Congratz'}
              </p>
            </div>
          </div>
          <div className="mt-9 flex  w-full flex-col items-center">
            <h1>RECENT RANK GAMES:</h1>
            <div className="mt-4 flex h-[250px] w-full flex-col items-center  gap-5  overflow-auto">
              {games.map((game: any, i: number) => {
                return game.isPlayerWinner ? (
                  <MatchData
                    key={i}
                    player1={game.winnerId.nickname}
                    player2={game.loserId.nickname}
                    status={true}
                    date={calculateTimeElapsed(game.playedAt)}
                    score={game.score}
                    P1Avatar={game.winnerId.avatar}
                    P2Avatar={game.loserId.avatar}
                  />
                ) : (
                  <MatchData
                    key={i + 10}
                    player1={game.loserId.nickname}
                    player2={game.winnerId.nickname}
                    status={false}
                    date={calculateTimeElapsed(game.playedAt)}
                    score={game.score}
                    P1Avatar={game.loserId.avatar}
                    P2Avatar={game.winnerId.avatar}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default RankingStat;
