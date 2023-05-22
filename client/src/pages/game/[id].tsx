import Board from '@/components/game/Board';
import Pong from '@/components/game/Pong';
import ScoreBoard from '@/components/game/ScoreBoard';
import Layout from '@/components/layout/layout';
import { verifyToken } from '@/components/VerifyToken';
import axios from 'axios';
import NextApiRequest from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { DotLoader } from 'react-spinners';
import { io, Socket } from 'socket.io-client';
let socket: Socket;

export interface GameProps {
  jwt_token: string;
  res: any;
  params: { id: string };
  ws: Socket;
}

export interface GameRules {
  type: string;
  description: string;
  effects: string;
  time: string;
}

export interface Player {
  nickname: string;
  avatar: string;
  score: number;
}

const PlayGame = ({ jwt_token, res, params, ws }: GameProps) => {
  const router = useRouter();
  const [redirectTime, setRedirectTime] = useState<number>(3);
  const [ruleTime, setRuleTime] = useState<number>(10);
  const gameRef = useRef<HTMLDivElement>(null);
  const [spectators, setSpectators] = useState<number>(0);
  const [error, setError] = useState<string>('');
  const [Position, setPosition] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [gameRules, setGameRules] = useState<GameRules>();
  const [player0, setPlayer0] = useState<Player>({
    nickname: '',
    avatar: '',
    score: 0,
  });
  const [player1, setPlayer1] = useState<Player>({
    nickname: '',
    avatar: '',
    score: 0,
  });
  const [gameOn, setGameOn] = useState<boolean>(false);

  useEffect(() => {
    console.log(res);
    socket = io(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/game`, {
      auth: {
        token: jwt_token,
      },
    });

    const redirectAfter = (seconds: number, redirect: boolean) => {
      let intervalId = setTimeout(() => {
        if (seconds >= 0) {
          setRedirectTime(seconds);
          redirectAfter(seconds - 1, redirect);
        } else if (redirect) {
          router.push('/game');
        }
      }, 1000);
    };

    if (res.message === 'Oki') {
      setLoading(true);

      socket.on('connected', () => {
        console.log('connected');
        console.log('isPlayer: ', res.isPlayer);
        if (res.isPlayer)
          socket.emit('joinGame', { gameId: params.id }, (res: any) => {});
        else socket.emit('watchGame', { gameId: params.id });

        socket.on('joined', (data: any) => {
          if (data.isPlayer) {
            setLoading(false);
            setError('');
          } else setSpectators((prev) => prev + 1);
          console.log('joined', data.message);
        });
        socket.on('left', (nickname: string) => {
          console.log('left', nickname);
          if (Position) setError(`${nickname} has left the game`);
          else {
            setLoading(true);
            setGameRules(undefined);
          }
          //   // setError(`${nickname} has left the game`);
          //   // redirectAfter(redirectTime);
          // }
        });

        socket.on('startGame', ({ position, info }: any) => {
          console.log('startGame');
          console.log('position: ', position);

          setPosition(position);
          setGameOn(true);
          setPlayer0({
            nickname: info.p1,
            avatar: info.p1Avatar,
            score: info.pScore1,
          });
          setPlayer1({
            nickname: info.p2,
            avatar: info.p2Avatar,
            score: info.pScore2,
          });
          socket.on(
            'updateScore',
            (data: { [key: string]: number | string }) => {
              setPlayer0((prev) => ({
                ...prev,
                score: data[info.p1] as number,
              }));
              setPlayer1((prev) => ({
                ...prev,
                score: data[info.p2] as number,
              }));
            },
          );
          socket.on('gameOver', (data: any) => {
            console.log('gameOver: ', data, info.p1, info.p2);
            setPlayer0((prev) => ({
              ...prev,
              score: data[info.p1] as number,
            }));
            setPlayer1((prev) => ({
              ...prev,
              score: data[info.p2] as number,
            }));
            setGameOn(false);
            setLoading(false);
            setGameRules(undefined);
            setError('');
          });
        });

        socket.on('gameRules', (data: any) => {
          console.log('gameRules: ', data);
          setGameRules(data);
          setRedirectTime(10);
          redirectAfter(ruleTime, false);
          setLoading(false);
        });

        socket.on('disconnect', () => {
          setGameOn(false);
          socket.disconnect();
        });
      });

      if (ws) {
        ws.on('denyInvitation', (data: any) => {
          console.log('denyInvitation', data);
          redirectAfter(redirectTime, true);
          setError(`${data.user.nickname} has denied your invitation`);
        });
      }
    } else {
      socket.disconnect();
      redirectAfter(redirectTime, true);
      setError(res.message);
    }
    return () => {
      socket.off('connected');
      socket.off('joined');
      socket.off('left');
      socket.off('startGame');
      socket.off('updateScore');
      socket.off('gameOver');
      socket.off('gameRules');
      if (ws) 
        ws.off('denyInvitation');
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jwt_token, params, res]);

  return (
    <>
      <Head>
        <title>Ponginator | Play Game</title>
      </Head>
      <div
        className="flex h-full w-full flex-col items-center justify-start"
        ref={gameRef}
      >
        {error && (
          <div className="m-auto flex h-[100px] w-[250px]  flex-col text-center text-xl">
            {error}
            {redirectTime !== 0 && (
              <p className="self-end text-sm ">
                redirecting after {redirectTime}...
              </p>
            )}
          </div>
        )}
        {Position && (
          <ScoreBoard
            gameOn={gameOn}
            player1={player0}
            player2={player1}
            spectators={spectators}
          />
        )}
        {gameOn && (
          <Pong gameRef={gameRef} socket={socket} position={Position} />
        )}
        {loading && !error && (
          <div className="m-auto flex flex-col items-center">
            <DotLoader
              color="#ffffff"
              loading={loading}
              size={100}
              className="mb-10"
            />
            <p className="text-xl">Waiting for other player to join ...</p>
          </div>
        )}
        {gameRules && !gameOn && (
          <div className="m-auto flex min-h-[300px] w-[50%] min-w-[300px] max-w-[800px] flex-col justify-between rounded-2xl border p-5 ">
            <h1 className="text-2xl font-semibold">Game Rules:</h1>
            <p>This is a {gameRules.type} game</p>
            <p>{gameRules.description}</p>
            <li>
              <b>Effects:</b> {gameRules.effects}
            </li>
            <li>
              <b>Time:</b> {gameRules.time}
            </li>
            <h2 className="font-semibold">Instruction:</h2>
            <li className="pl-5">
              You can move your paddle with mouse/touch move
            </li>
            <li className="pl-5">Position: Bottom</li>

            <p className="self-end text-sm">
              the game will start after {redirectTime}...
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export async function getServerSideProps({
  req,
  params,
}: {
  req: NextApiRequest;
  params: { id: string };
}) {
  const jwt_token = req.cookies['jwt_token'];

  if (jwt_token) {
    const res = await verifyToken(req.headers.cookie);
    if (res.ok) {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BE_CONTAINER_HOST}/game/${params.id}`,
          {
            headers: {
              Cookie: req.headers.cookie,
            },
          },
        );
        return {
          props: {
            params,
            res: res.data,
            jwt_token,
          },
        };
      } catch (e: any) {
        return {
          props: {
            params,
            res: e.response.data,
            jwt_token,
          },
        };
      }
    }
  }
  return {
    redirect: {
      destination: '/',
      permanent: true,
    },
  };
}

PlayGame.getLayout = function getLayout(page: React.ReactNode) {
  return <Layout>{page}</Layout>;
};

export default PlayGame;
