import Image from 'next/image';
import Link from 'next/link';
import { MatchData, OverViewData } from './StateComps';
import { calculateTimeElapsed } from '@/components/tools/functions';
import { useEffect, useState } from 'react';

function MatchHistoryStat({ nickname }: { nickname: string }) {
  const [games, setGames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selected, setSelected] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      const resp = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_HOST +
          '/players/games?' +
          new URLSearchParams({ search: nickname }),
        {
          credentials: 'include',
        },
      );
      if (resp.ok) {
        const games = await resp.json();
        setGames(games);
        setIsLoading(false);
      } else {
        // make div to return an error or something
        return;
      }
    };
    fetchData();
  }, [nickname]);

  const wins = games.filter((game: any) => game.isPlayerWinner);
  const loss = games.filter((game: any) => game.isPlayerLoser);
  let winStreak = [];
  let currentStreak: any = [];

  games.forEach((game: any) => {
    if (game.isPlayerWinner) {
      currentStreak.push(game);
    } else {
      if (currentStreak.length > 0) {
        winStreak.push(currentStreak);
        currentStreak = [];
      }
    }
  });

  if (currentStreak.length > 0) {
    winStreak.push(currentStreak);
  }

  if (isLoading) return <div>Loading data...</div>;
  else {
    return (
      <div className="flex flex-col justify-between p-5 lg:flex-row">
        {/* overview */}
        <div
          className="flex flex-col items-center justify-center gap-10  
                      border-0 border-gray-100 border-opacity-70 lg:w-[24.3%] 
                      lg:border-r-2"
        >
          <h1>OVERVIEW:</h1>
          <div className="flex w-full flex-row flex-wrap items-center justify-center gap-3  lg:flex-col">
            <button onClick={() => setSelected(1)}>
              <OverViewData
                header={'Matches Played:'}
                data={games.length}
                colored={selected == 1 ? true : false}
              />
            </button>
            <button onClick={() => setSelected(2)}>
              <OverViewData
                header={'Wins:'}
                data={wins.length}
                colored={selected == 2 ? true : false}
              />
            </button>
            <button onClick={() => setSelected(3)}>
              <OverViewData
                header={'Wins Streak:'}
                data={winStreak.length}
                colored={selected == 3 ? true : false}
              />
            </button>
            <button onClick={() => setSelected(4)}>
              <OverViewData
                header={'Losses:'}
                data={loss.length}
                colored={selected == 4 ? true : false}
              />
            </button>
          </div>
        </div>

        {/* match history */}
        <div className="mt-10 flex h-[300px] w-full flex-col items-center  gap-5  overflow-auto lg:w-2/3 ">
          {selected == 1 &&
            games.map((game: any, i: number) => {
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
          {selected == 2 &&
            wins.map((game: any, i: number) => {
              return (
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
              );
            })}
          {selected == 3 &&
            winStreak.map((arr: any, i: number) => {
              return (
                <div
                  key={i}
                  className="flex w-full flex-col items-center gap-5 "
                >
                  {arr.map((game: any, j: number) => (
                    <MatchData
                      key={i + j + 100}
                      player1={game.winnerId.nickname}
                      player2={game.loserId.nickname}
                      status={true}
                      date={calculateTimeElapsed(game.playedAt)}
                      score={game.score}
                      P1Avatar={game.winnerId.avatar}
                      P2Avatar={game.loserId.avatar}
                    />
                  ))}
                  {i !== winStreak.length - 1 && (
                    <div>-----------------------------------</div>
                  )}
                </div>
              );
            })}
          {selected == 4 &&
            loss.map((game: any, i: number) => {
              return (
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
    );
  }
}

export default MatchHistoryStat;
