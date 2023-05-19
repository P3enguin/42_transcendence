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

const PlayGame = ({ jwt_token, res, params, ws }: any) => {
  const router = useRouter();
  const [redirectTime, setRedirectTime] = useState(3);
  const gameRef = useRef<HTMLDivElement>(null);
  const [spectators, setSpectators] = useState<number>(0);
  const [error, setError] = useState<string>('');
  const [Position, setPosition] = useState('');
  const [loading, setLoading] = useState(false);
  const [player0, setPlayer0] = useState({
    nickname: '',
    avatar: '',
    score: 0,
  });
  const [player1, setPlayer1] = useState({
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

    const redirectAfter = (seconds: number) => {
      let intervalId = setTimeout(() => {
        if (seconds >= 0) {
          setRedirectTime(seconds);
          redirectAfter(seconds - 1);
        } else router.push('/game');
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
          setError(`waiting for ${nickname} to reconnect...`);
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
            setError('');
          });
        });

        socket.on('disconnect', () => {
          setGameOn(false);
          socket.disconnect();
        });
      });

      if (ws) {
        ws.on('denyInvitation', (data: any) => {
          console.log('denyInvitation', data);
          redirectAfter(redirectTime);
          setError(`${data.user.nickname} has denied your invitation`);
        });
      }
    } else {
      socket.disconnect();
      redirectAfter(redirectTime);
      setError(res.message);
    }
    return () => {
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
            <p className="self-end text-sm ">
              redirecting after {redirectTime}...
            </p>
          </div>
        )}
        {Position && (
          <ScoreBoard gameOn={gameOn} player1={player0} player2={player1} />
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
          `${process.env.NEXT_PUBLIC_BACKEND_HOST}/game/${params.id}`,
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
