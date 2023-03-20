import Layout from '@/components/layout/layout';
import { verifyToken } from '@/components/VerifyToken';
import axios from 'axios';
import NextApiRequest from 'next';
import Head from 'next/head';
import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
let socket: Socket;


const playGame = ({ jwt_token }: any) => {
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
  return <div>playGame</div>;
};

export async function getServerSideProps({ req , params }: { req: NextApiRequest; params: { id: string }}) {
  const jwt_token = req.cookies['jwt_token'];

  if (jwt_token) {
    const res = await verifyToken(req.headers.cookie);
    if (res.ok) {
      try {
        const resp = await axios.get('http://localhost:4444/games', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwt_token}`,
          },
        });
        const data = resp.data;
        return {
          props: {
            data,
            jwt_token: jwt_token,
          },
        };
      } catch (error: any) {
        console.error(error.message);
        return {
          props: {
            data: [],
            jwt_token: jwt_token,
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

playGame.getLayout = function getLayout(page: React.ReactNode) {
  return <Layout>{page}</Layout>;
};

export default playGame;
