import DiscoverChannels from '@/components/home/DiscoverChannels';
import LiveGames from '@/components/home/LiveGames';
import Leaderboard from '@/components/home/Leaderboard';
import Layout from '@/components/layout/layout';
import Head from 'next/head';
import { LeaderBoard } from '@/interfaces/LeaderBoard';
import { Rooms } from '@/interfaces/Rooms';

function HomePlayer({
  rooms,
  leaderBoard,
}: {
  rooms: Rooms[];
  leaderBoard: LeaderBoard;
}) {
  return (
    <>
      <Head>
        <title>Ponginator | Home</title>
      </Head>
      <div className="my-[55px] flex w-full flex-col items-center gap-[65px]">
        <DiscoverChannels rooms={rooms} />
        <div className="flex w-[90%] flex-wrap gap-[65px] xl:flex-nowrap">
          <LiveGames />
          <Leaderboard leaderBoard={leaderBoard} />
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps({ req }: any) {
  const jwt_token: string = req.cookies['jwt_token'];
  if (jwt_token) {
    const roomsRes = await fetch(
      process.env.NEXT_PUBLIC_BACKEND_HOST + '/room/discover',
      {
        headers: {
          Cookie: req.headers.cookie,
        },
      },
    );
    const roomsData = await roomsRes.json();

    const levelLeaderBoardRes = await fetch(
      process.env.NEXT_PUBLIC_BACKEND_HOST + '/leaderboard/level',
      {
        headers: {
          Cookie: req.headers.cookie,
        },
      },
    );
    const levelLeaderBoardData = await levelLeaderBoardRes.json();

    const rankLeaderBoardRes = await fetch(
      process.env.NEXT_PUBLIC_BACKEND_HOST + '/leaderboard/rank',
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
        rooms: roomsData.rooms,
        leaderBoard: {
          level: levelLeaderBoardData,
          rank: rankLeaderBoardData,
        },
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
