import DiscoverChannels from '@/components/home/DiscoverChannels';
import LiveGames from '@/components/home/LiveGames';
import Leaderboard from '@/components/home/Leaderboard';
import Layout from '@/components/layout/layout';
import { verifyToken } from '@/components/VerifyToken';
import Head from 'next/head';

function HomePlayer({ jwt_token }: { jwt_token: string }) {
  return (
    <>
      <Head>
        <title>Ponginator | Home</title>
      </Head>
      <div className="flex w-full flex-col items-center gap-[65px]">
        <DiscoverChannels />
        <div className="flex w-[90%] flex-row flex-wrap gap-[65px] xl:flex-nowrap">
          <LiveGames />
          <Leaderboard />
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

HomePlayer.getLayout = function getLayout(page: React.ReactNode) {
  return <Layout>{page}</Layout>;
};
export default HomePlayer;
