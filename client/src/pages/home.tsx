import DiscoverChannels from '@/components/home/DiscoverChannels';
import LiveGames from '@/components/home/LiveGames';
import Leaderboard from '@/components/home/Leaderboard';
import Layout from '@/components/layout/layout';
import Head from 'next/head';
import { LeaderBoard } from '@/interfaces/LeaderBoard';
import { Channels } from '@/interfaces/Channels';

function HomePlayer({
  jwt_token,
  channels,
  leaderBoard,
}: {
  jwt_token: string;
  channels: Channels[];
  leaderBoard: LeaderBoard;
}) {
  return (
    <>
      <Head>
        <title>Ponginator | Home</title>
      </Head>
      <div className="my-[55px] flex w-full flex-col items-center gap-[65px]">
        <DiscoverChannels channels={channels} />
        <div className="flex w-[90%] flex-wrap gap-[65px] md:w-[640px] xl:w-[90%] xl:flex-nowrap 2xl:w-[1323px]">
          <LiveGames jwt_token={jwt_token} />
          <Leaderboard leaderBoard={leaderBoard} />
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps({ req }: any) {
  const jwt_token: string = req.cookies['jwt_token'];
  if (jwt_token) {
    try {
      const channelsRes = await fetch(
        process.env.NEXT_PUBLIC_BE_CONTAINER_HOST + '/chat/discover',
        {
          headers: {
            Cookie: req.headers.cookie,
          },
        },
      );
      const channelsData = await channelsRes.json();

      const rankLeaderBoardRes = await fetch(
        process.env.NEXT_PUBLIC_BE_CONTAINER_HOST + '/rank/leaderboard',
        {
          headers: {
            Cookie: req.headers.cookie,
          },
        },
      );
      const rankLeaderBoardData = await rankLeaderBoardRes.json();

      return {
        // modify this to return anything you want before your page load
        props: {
          jwt_token,
          channels: channelsData,
          leaderBoard: {
            rank: rankLeaderBoardData,
          },
        },
      };
    } catch (error) {
      console.log(error);
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
