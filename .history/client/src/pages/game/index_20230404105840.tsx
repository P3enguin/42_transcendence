import Layout from '@/components/layout/layout';
import { verifyToken } from '@/components/VerifyToken';
import axios from 'axios';
import NextApiRequest from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';

function Game({ jwt_token, data }: { jwt_token: string; data: [] }) {
  const router = useRouter();
  const [gametype, setGametype] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  async function joinMatchmaking(gametype: string) {
    const res = await axios.get(
      process.env.NEXT_PUBLIC_BACKEND_HOST + '/game/join',
      {
        withCredentials: true,
        params: {
          gametype: gametype,
        },
      },
    );
    router.push('/game/' + res.data);
  }

  function playWithAI() {
    router.push('/game/ai');
  }
  return (
    <>
      <Head>
        <title>Ponginator | Start Game</title>
      </Head>

      <div className="m-5 flex min-h-[600px] max-w-[1500px] flex-col rounded-2xl border border-neutral-300 sm:m-20  md:h-[70%]">
        <div className="flex h-2/5 flex-col p-5 md:h-1/2">
          <h2 className="m-2 text-lg font-bold md:text-2xl">
            INVITE YOUR ONLINE FRIENDS TO PLAY:
          </h2>
          <div className="flex flex-wrap justify-center overflow-y-auto scrollbar">
            {data.map((user: any, index) => (
              <div
                key={index}
                className="m-3 mb-10 flex w-[170px] flex-col items-center rounded-2xl bg-[#8BD9FF] bg-opacity-30 p-5"
              >
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
        <div className="m-4 min-h-[1px] w-1/2 self-center bg-neutral-300"></div>
        <div className="flex h-full w-full flex-col  md:h-1/3 md:flex-row">
          <div className="flex h-full flex-col rounded-2xl pl-5 pr-5 sm:p-5 md:w-[50%] ">
            <h2 className="m-2 text-lg font-bold md:text-2xl">START A GAME</h2>
            <div className="felx m-auto mb-0 flex-row self-center">
              <div className="mr-6 inline-flex items-center self-center whitespace-nowrap">
                <input
                  type="radio"
                  id="normal"
                  name="type"
                  onChange={() => {
                    setGametype('NORMAL');
                    setIsButtonDisabled(false);
                  }}
                />
                <label htmlFor="normal" className="m-1 whitespace-nowrap">
                  Normal Game
                </label>
              </div>
              <div className="inline-flex items-center self-center whitespace-nowrap">
                <input
                  type="radio"
                  id="ranked"
                  name="type"
                  onChange={() => {
                    setGametype('RANKED');
                    setIsButtonDisabled(false);
                  }}
                />
                <label htmlFor="ranked" className="m-1 whitespace-nowrap">
                  Ranked Game
                </label>
              </div>
            </div>
            <button
              className="m-auto mt-5 w-[200px] rounded-xl bg-[#0097E2] p-1"
              onClick={(e) => {
                e.preventDefault();
                joinMatchmaking(gametype);
              }}
              disabled={isButtonDisabled}
            >
              JOIN MATCHMAKING
            </button>
          </div>
          <div className=" min-h-[1px] w-1/2 min-w-[1px] self-center bg-neutral-300 md:h-2/3 md:w-[1px]"></div>
          <div className="flex h-full flex-col rounded-2xl pr-5 pl-5 sm:p-5 md:w-[50%]">
            <h2 className="m-2 text-lg font-bold md:text-2xl">
              START TRAINING
            </h2>
            <div className="felx m-auto mb-0 flex-row self-center">
              You don’t know how things are going? <br />
              Don’t worry, you can always train and play with our AI.
            </div>
            <button
              className="m-auto mt-1 w-[200px] rounded-xl bg-[#0097E2] p-1"
              onClick={playWithAI}
            >
              PLAY WITH AI
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps({ req }: NextApiRequest) {
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
        console.log(data);
        
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