import Layout from '@/components/layout/layout';
import { useState } from 'react';
import ProfileDisplay from '@/components/profile/ProfileDisplay';
import ProfileStats from '@/components/profile/ProfileStats';
import {
  FriendIcon,
  AchievementIcon,
  MatchHistoryIcon,
  RankingIcon,
} from '@/components/icons/Icons';

import { useEffect } from 'react';

interface player {
  nickname: string;
  firstname: string;
  lastname: string;
  coins: number;
  avatar: string;
  wallpaper: string;
  joinDate: string;
  exist?: boolean;
}

function UserProfile({
  nickname,
  firstname,
  lastname,
  coins,
  avatar,
  wallpaper,
  joinDate,
  exist,
}: player) {
  // const [pictures, changePictures] = useState({ pfp: '', wp: '' });
  const list = ['hh', 'hh2', 'hh3'];
  if (!exist)
    return (
      <p className="mt-[400px]  text-xl text-red-600">Player does not exist!</p>
    );
  const [isLoading, setLoading] = useState(false);
  const titles = ['hh', 'hh2', 'hh3'];

  if (isLoading) return <p>Loading...</p>;
  if (!isLoading) {
    return (
      <>
        <div className=" flex w-full flex-col items-center gap-10 xl:gap-[100px]">
          <ProfileDisplay
            wp={
              process.env.NEXT_PUBLIC_BACKEND_HOST + '/wallpapers/' + wallpaper
            }
            pfp={process.env.NEXT_PUBLIC_BACKEND_HOST + '/avatars/' + avatar}
            fullname={firstname + ' ' + lastname}
            nickname={nickname}
            joinDate={joinDate}
            coins={coins}
            exp={1800}
            MaxExp={2500}
            userProfile={false}
          />
          <ProfileStats  nickname={nickname}  userProfile={false} />
        </div>
      </>
    );
  }
}

export async function getServerSideProps({ params, req }: any) {
  const jwt_token: string = req.cookies['jwt_token'];
  if (jwt_token) {
    const res = await fetch(
      process.env.NEXT_PUBLIC_BACKEND_HOST +
        '/players/data?' +
        new URLSearchParams({ nickname: params.user }),
      {
        headers: {
          Cookie: req.headers.cookie,
        },
      },
    );
    const data = await res.json();
    if (!data.player)
      return {
        props: {
          exist: false,
        },
      };
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    const date = new Intl.DateTimeFormat('en-US', options).format(
      new Date(data.player.joinAt),
    );
    return {
      // modify this to return anything you want before your page load
      props: {
        nickname: data.player.nickname,
        firstname: data.player.firstname,
        lastname: data.player.lastname,
        coins: data.player.coins,
        avatar: data.player.avatar,
        wallpaper: data.player.wallpaper,
        joinDate: date,
        exist: true,
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

UserProfile.getLayout = function getLayout(page: React.ReactNode) {
  return <Layout>{page}</Layout>;
};
export default UserProfile;
