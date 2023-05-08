import OnlineFriends from '@/components/game/OnlineFriends';
import StartGame from '@/components/game/StartGame';
import StartTraining from '@/components/game/StartTraining';
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

      <div className="m-5 flex h-[70%]  min-h-[600px] flex-col rounded-2xl border border-neutral-300 sm:m-20 lg:min-w-[60%]">
        <OnlineFriends data={data} />
        <div className="m-4 min-h-[1px] w-1/2 self-center bg-neutral-300"></div>
        <div className="flex h-full w-full flex-col  md:h-1/3 md:flex-row">
          <StartGame />
          <div className=" min-h-[1px] w-1/2 min-w-[1px] self-center bg-neutral-300 md:h-2/3 md:w-[1px]"></div>
          <StartTraining />
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
