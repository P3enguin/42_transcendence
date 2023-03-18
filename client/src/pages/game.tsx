import Layout from '@/components/layout/layout';
import { verifyToken } from '@/components/VerifyToken';
import Head from 'next/head';
import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
let socket: Socket;

function Game({ jwt_token }: { jwt_token: string }) {
  useEffect(() => {
    socket = io(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/game`, {
      auth: {
        token: jwt_token,
      },
    });
    socket.on('connect', () => {
      console.log('connected');
      socket.emit('message', { username: 'test', message: 'hello' });
    });
    return () => {
      socket.disconnect();
    };
  }, []);
  return (
    <>
      <Head>
        <title>Ponginator | Start Game</title>
      </Head>
      <div className="container">
        <div className="invite-friends">
          <h1>Invite your online friends to play:</h1>
        </div>
        <div className="matchmaking">
          <h1>Select a Game</h1>
        </div>
        <div className="training">
          <h1>Start Training</h1>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps({ req }: any) {
  const jwt_token: string = req.cookies['jwt_token'];

  if (jwt_token) {
    const res = await verifyToken(req.headers.cookie);
    if (res.ok) {
      return {
        // modify this to return anything you want before your page load
        props: {
          jwt_token: jwt_token,
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

Game.getLayout = function getLayout(page: React.ReactNode) {
  return <Layout>{page}</Layout>;
};

export default Game;
