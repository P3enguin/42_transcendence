import Board from '@/components/game/Board';
import Pong from '@/components/game/Pong';
import ScoreBoard from '@/components/game/ScoreBoard';
import Layout from '@/components/layout/layout';
import { verifyToken } from '@/components/VerifyToken';
import axios from 'axios';
import NextApiRequest from 'next';
import Head from 'next/head';
import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
let socket: Socket;

const PlayGame = ({ jwt_token, res, params }: any) => {
  const gameRef = useRef<HTMLDivElement>(null);
  const [Position, setPosition] = useState('');
  const [player1, setPlayer1] = useState('');
  const [player2, setPlayer2] = useState('');
  const [player1Score, setPlayer1Score] = useState<number>(0);
  const [player2Score, setPlayer2Score] = useState<number>(0);
  const [gameOn, setGameOn] = useState<boolean>(false);

  const getResult = (): string => {
    if (player1Score > player2Score) {
      if (Position === 'Bottom') return 'You win!';
      else return `${player1} wins!`;
    } else {
      if (Position === 'Top') return 'You win!';
      else return `${player2} wins!`;
    }
  };

  useEffect(() => {
    socket = io(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/game`, {
      auth: {
        token: jwt_token,
      },
    });
    if (res === '0ki') {
      socket.on('connected', () => {
        console.log('connected');
        socket.emit('joinGame', { gameId: params.id });
        socket.on('joined', (data: any) => {
          console.log('joined: ', data);
        });
        socket.on('startGame', ({ position, info }: any) => {
          console.log('startGame');
          console.log('position: ', position);

          setPosition(position);
          setGameOn(true);
          setPlayer1(info.p1);
          setPlayer1Score(info.pScore1);
          setPlayer2(info.p2);
          setPlayer2Score(info.pScore2);
          socket.on(
            'updateScore',
            (data: { [key: string]: number | string }) => {
              setPlayer1Score(data[info.p1] as number);
              setPlayer2Score(data[info.p2] as number);
            },
          );
          socket.on('gameOver', (data: any) => {
            console.log('gameOver: ', data, info.p1, info.p2);
            setPlayer1Score(data[info.p1]);
            setPlayer2Score(data[info.p2]);
            setGameOn(false);
          });
        });
      });
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
        className="flex h-full w-full flex-col items-center justify-around"
        ref={gameRef}
      >
        {gameOn && (
          <ScoreBoard
            player1={player1}
            player1Score={player1Score}
            player2={player2}
            player2Score={player2Score}
          />
        )}
        {gameOn && (
          <Pong gameRef={gameRef} socket={socket} position={Position} />
        )}
        {!gameOn && Position && <div>Game Over {getResult()}</div>}
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
      let data: string = '';
      try {
        const resp = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_HOST}/game/${params.id}`,
          {
            headers: {
              Cookie: req.headers.cookie,
            },
          },
        );
        data = resp.data;
      } catch (e: any) {
        console.error(e.message);
        data = e.response.data;
      }
      return {
        props: {
          params,
          res: data,
          jwt_token,
        },
      };
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
