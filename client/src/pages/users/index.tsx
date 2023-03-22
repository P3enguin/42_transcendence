import Layout from '@/components/layout/layout';
import { useState } from 'react';
import {
  FriendIcon,
  AchievementIcon,
  MatchHistoryIcon,
  RankingIcon,
} from '@/components/icons/Icons';


function DefaultProfile() {

    return (
     <div> 404 no player hh</div>
    );
}


DefaultProfile.getLayout = function getLayout(page: React.ReactNode) {
    return <Layout>{page}</Layout>;
  };
export default DefaultProfile;