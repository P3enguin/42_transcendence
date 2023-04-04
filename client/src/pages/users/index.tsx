import Layout from '@/components/layout/layout';
import { useState } from 'react';
import {
  FriendIcon,
  AchievementIcon,
  MatchHistoryIcon,
  RankingIcon,
} from '@/components/icons/Icons';
import { verifyToken } from '@/components/VerifyToken';

function DefaultProfile() {
  return <div> 404 no player hh</div>;
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
DefaultProfile.getLayout = function getLayout(page: React.ReactNode) {
  return <Layout>{page}</Layout>;
};
export default DefaultProfile;
