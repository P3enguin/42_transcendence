import { useEffect, useState } from 'react';
import LiveGame from './LiveGame';
import { io } from 'socket.io-client';
import { Game } from '@/interfaces/Game';

export default function LiveGames({ jwt_token }: { jwt_token: string }) {
  const [games, setGames] = useState<Game[]>([]);

  useEffect(() => {
    const socket = io(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/game`, {
      auth: {
        token: jwt_token,
      },
    });

    socket.on('connect', () => {
      socket.emit('GetLiveGames', (liveGames: Game[]) => {
        setGames(liveGames);
      });

      socket.on('newGame', (newGame: Game) => {
        setGames((prevGames) => [...prevGames, newGame]);
      });

      socket.on('gameOver', (data: { [key: string]: number | string }) => {
        setGames((prevGames) =>
          prevGames.filter((game) => game.id !== data.gameId),
        );
      });

      socket.on('updateScore', (data: { [key: string]: number | string }) => {
        setGames((prevGames) => {
          const newGames = prevGames.map((game) => {
            if (game.id === data.gameId) {
              game.players[0].score = data[game.players[0].nickname] as number;
              game.players[1].score = data[game.players[1].nickname] as number;
            }
            return game;
          });
          return newGames;
        });
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="w-full rounded-[20px] border border-white pr-3 pb-3">
      <div className="flex items-center pl-4 pt-4">
        <div className="h-[12px] w-[12px] rounded-full bg-[#EB2230]"></div>
        <h1 className="pl-2 text-xl font-bold uppercase">Live Games:</h1>
      </div>
      <div className="scrollbar max-h-[580px] overflow-auto">
        <ul className="flex flex-col py-4 px-9">
          {games.map((game) => {
            if (game.players.length === 2)
              return (
                <li key={game.id} className="p-2">
                  <LiveGame liveGame={game} />
                </li>
              );
          })}
        </ul>
      </div>
    </div>
  );
}
