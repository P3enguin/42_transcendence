import Layout from '@/components/layout/layout';
import { verifyToken } from '@/components/VerifyToken';
import axios from 'axios';
import Head from 'next/head';
import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
let socket: Socket;

function Game({ jwt_token, data }: { jwt_token: string; data: [] }) {
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
  }, [data]);
  return (
    <>
      <Head>
        <title>Ponginator | Start Game</title>
      </Head>

      <div className="m-5 flex min-h-[700px] max-w-[1200px] flex-col rounded-2xl border border-neutral-300 sm:m-20 md:h-[80%]">
        <div className="flex h-1/2 flex-col p-5 md:h-2/3">
          <h2 className="m-2 text-lg font-bold md:text-2xl">
            INVITE YOUR ONLINE FRIENDS TO PLAY:
          </h2>
          <div className="flex flex-wrap justify-center overflow-y-auto sm:justify-start">
            {data.map((user: any, index) => (
              <div key={index}  className="m-3 mb-10 flex w-[170px] flex-col items-center rounded-2xl bg-[#8BD9FF] bg-opacity-30 p-5">
                <img
                  className="h-12 w-12 rounded-full"
                  src={user.avatar}
                  alt="Avatar"
                />
                <h3>{user.nickname}</h3>
                <button className="rounded-lg bg-[#0097E2]">
                  <h3 className="p-1">play with</h3>
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="z-20 m-4 min-h-[1px] w-1/2 self-center bg-neutral-300"></div>
        <div className="flex h-full w-full flex-col  md:h-1/3 md:flex-row">
          <div className="flex h-full flex-col rounded-2xl p-5 md:w-[50%]">
            <h2 className="m-2 text-lg font-bold md:text-2xl">START A GAME</h2>
            <div className="felx m-auto mb-0 flex-row self-center">
              <input type="radio" name="type"/>
              <label htmlFor="default" className=" m-1">
                Normal Game
              </label>
              <input type="radio" name="type"/>
              <label htmlFor="default" className=" m-1">
                Ranked Game
              </label>
            </div>
            <button className="m-auto mt-5 w-[200px] rounded-xl bg-[#0097E2] p-1">
              JOIN MATCHMAKING
            </button>
          </div>
          <div className=" h-[1px] w-1/2 self-center bg-neutral-300 md:h-2/3 md:w-[1px]"></div>
          <div className="flex h-full flex-col rounded-2xl p-5 md:w-[50%]">
            <h2 className="m-2 text-lg font-bold md:text-2xl">
              START TRAINING
            </h2>
            <div className="mb-11"></div>
            <button className="m-auto w-[200px] rounded-xl bg-[#0097E2] p-1 ">
              PLAY WITH AI
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps({ req }: any) {
  const jwt_token = req.cookies['jwt_token'];

  if (jwt_token) {
    const res = await verifyToken(req.headers.cookie);
    if (res.ok) {
      try {
        const resp = await axios.get('http://localhost:4444/online', {
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

Game.getLayout = function getLayout(page: React.ReactNode) {
  return <Layout>{page}</Layout>;
};

export default Game;
