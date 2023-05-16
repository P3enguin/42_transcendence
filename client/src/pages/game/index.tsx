import OnlineFriends from '@/components/game/OnlineFriends';
import StartGame from '@/components/game/StartGame';
import StartTraining from '@/components/game/StartTraining';
import Layout from '@/components/layout/layout';
import { verifyToken } from '@/components/VerifyToken';
import axios from 'axios';
import NextApiRequest from 'next';
import Head from 'next/head';

function Game() {

  return (
    <>
      <Head>
        <title>Ponginator | Start Game</title>
      </Head>

      <div className="m-5 flex h-[70%]  min-h-[700px] flex-col rounded-2xl border border-neutral-300 sm:m-20 lg:min-w-[60%]">
        <OnlineFriends />
        <div className="sm:m-4 min-h-[1px] w-1/2 self-center bg-neutral-300"></div>
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
        return {
          props: {
            jwt_token: jwt_token,
          },
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
