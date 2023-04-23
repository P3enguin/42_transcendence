import DiscoverChannels from '@/components/home/DiscoverChannels';
import LiveGames from '@/components/home/LiveGames';
import Leaderboard from '@/components/home/Leaderboard';
import Layout from '@/components/layout/layout';
import Head from 'next/head';

interface Rooms {
  channelId: number;
  name: string;
  Topic: string;
  memberLimit: number;
  memberCount: number;
  stats: string;
  avatar: string;
}

function HomePlayer({ rooms }: { rooms: Rooms[] }) {
  return (
    <>
      <Head>
        <title>Ponginator | Home</title>
      </Head>
      <div className="my-[55px] flex w-full flex-col items-center gap-[65px]">
        <DiscoverChannels rooms={rooms} />
        <div className="flex w-[90%] flex-wrap gap-[65px] xl:flex-nowrap">
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
    const res = await fetch(
      process.env.NEXT_PUBLIC_BACKEND_HOST + '/room/discover',
      {
        headers: {
          Cookie: req.headers.cookie,
        },
      },
    );
    const data = await res.json();
    return {
      // modify this to return anything you want before your page load
      props: {
        rooms: data.rooms,
      },
    };
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
