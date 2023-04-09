import Board from '@/components/game/Board';
import Pong from '@/components/game/Pong';
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

  useEffect(() => {
    socket = io(`${process.env .NEXT_PUBLIC_BACKEND_HOST}/game`, {
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
        socket.on('startGame', ({ position }: any) => {
          console.log('startGame', position);
          setPosition(position);
        });
      });
    }
    return () => {
      socket.disconnect();
    };
<<<<<<< HEAD
  }, []);
  console.log('res', res);

  return <div>playGame {res}</div>;
=======
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
        <div>PlayGame {res}</div>
        {Position && (
          <Pong gameRef={gameRef} socket={socket} position={Position} />
        )}
      </div>
    </>
  );
>>>>>>> origin/dev
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

<<<<<<< HEAD
export default playGame;
=======
export default PlayGame;
>>>>>>> origin/dev
