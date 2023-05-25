import Layout from '@/components/layout/layout';
import { useState } from 'react';
import { useEffect } from 'react';
import ProfileDisplay from '@/components/profile/ProfileDisplay';
import ProfileStats from '@/components/profile/ProfileStats';
import Head from 'next/head';
import { Socket } from 'socket.io-client';

interface player {
  nickname: string;
  firstname: string;
  lastname: string;
  coins: number;
  avatar: string;
  wallpaper: string;
  joinDate: string;
  winRatio: string;
  rankId: number;
  level: number;
  xp: {
    XP: number;
    requiredXP: number;
  };
  ws: Socket;
  wsConnected: boolean;
}

function PlayerProfile({
  nickname,
  firstname,
  lastname,
  coins,
  avatar,
  wallpaper,
  joinDate,
  winRatio,
  rankId,
  level,
  xp,
  ws,
  wsConnected,
}: player) {
  // const [pictures, changePictures] = useState({ pfp: '', wp: '' });
  const [isLoading, setLoading] = useState(false);

  if (isLoading) return <p>Loading...</p>;
  if (!isLoading) {
    return (
      <>
        <Head>
          <title>Ponginator | Profile</title>
        </Head>
        <div className=" flex w-full flex-col items-center gap-10 xl:gap-[100px]">
          <ProfileDisplay
            wp={
              process.env.NEXT_PUBLIC_BE_CONTAINER_HOST +
              '/wallpapers/' +
              wallpaper
            }
            pfp={
              process.env.NEXT_PUBLIC_BE_CONTAINER_HOST + '/avatars/' + avatar
            }
            fullname={firstname + ' ' + lastname}
            nickname={nickname}
            joinDate={joinDate}
            coins={coins}
            exp={xp.XP}
            MaxExp={xp.requiredXP}
            userProfile={true}
            winRatio={winRatio}
            rankId={rankId}
            level={level}
          />
          <ProfileStats
            nickname={nickname}
            userProfile={true}
            ws={ws}
            wsConnected={wsConnected}
          />
        </div>
      </>
    );
  }
}

export async function getServerSideProps({ req }: any) {
  // fetching all data :

  const jwt_token: string = req.cookies['jwt_token'];
  if (jwt_token) {
    try {
      const res = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_HOST + '/players/data',
        {
          headers: {
            Cookie: req.headers.cookie,
          },
        },
      );
      if (res.ok) {
        const data = await res.json();

        const timeFormat: Intl.DateTimeFormatOptions = {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        };
        const date = new Intl.DateTimeFormat('en-US', timeFormat).format(
          new Date(data.player.joinAt),
        );
        return {
          // modify this to return anything you want before your page load
          props: {
            jwt_token,
            nickname: data.player.nickname,
            firstname: data.player.firstname,
            lastname: data.player.lastname,
            coins: data.player.coins,
            avatar: data.player.avatar,
            wallpaper: data.player.wallpaper,
            joinDate: date,
            rankId: data.rankId,
            winRatio: data.winRatio,
            level: data.level,
            xp: data.xp,
          },
        };
      }
    } catch (error) {
      console.log('An error has occurred');
    }
  }
  return {
    redirect: {
      destination: '/',
      permanent: true,
    },
  };
}

PlayerProfile.getLayout = function getLayout(page: React.ReactNode) {
  return <Layout>{page}</Layout>;
};
export default PlayerProfile;
