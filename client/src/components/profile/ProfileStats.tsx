import { useState } from 'react';

import {
  FriendIcon,
  AchievementIcon,
  MatchHistoryIcon,
  RankingIcon,
} from '@/components/icons/Icons';

import FriendStats from './States/Friends';
import AchievementStats from './States/Achievement';
import MatchHistoryStat from './States/MatchHistory';

function ProfileStats({
  nickname,
  userProfile,
}: {
  nickname: string;
  userProfile: boolean;
}) {
  const [selected, setSelected] = useState(-1);

  return (
    <div
      className="flex h-[400px] w-11/12 flex-col  rounded-3xl 
        bg-[#2F3B78] md:max-xl:w-5/6  xl:w-[1000px]"
    >
      <div
        className="flex border-2 border-t-0 border-l-0 border-r-0 
                border-gray-100 border-opacity-70 p-2 text-sm text-[#8BD9FF]"
      >
        <button
          className="relative flex h-[60px] w-1/4 items-center 
                     justify-center border-2 border-t-0 
                     border-l-0 border-b-0 border-gray-100 
                     border-opacity-70 transition-all"
          onClick={() => setSelected(0)}
        >
          <FriendIcon selected={selected} />
          <span
            className={`${
              selected != 0
                ? 'friend-text invisible absolute opacity-0 transition-all'
                : 'visible absolute text-[#70F89B]'
            }`}
          >
            Friends
          </span>
        </button>
        <button
          className="relative flex h-[60px] w-1/4 items-center 
                     justify-center  border-2 
                      border-t-0 border-l-0 border-b-0 border-gray-100 
                      border-opacity-70 transition-all"
          onClick={() => setSelected(1)}
        >
          <AchievementIcon selected={selected} />
          <span
            className={`${
              selected != 1
                ? 'friend-text invisible absolute opacity-0 transition-all'
                : 'visible absolute text-[#70F89B]'
            }`}
          >
            Achievement
          </span>
        </button>
        <button
          className="relative flex h-[60px] w-1/4 items-center 
                      justify-center  border-2 border-t-0 
                      border-l-0 border-b-0  border-gray-100 
                      border-opacity-70 transition-all"
          onClick={() => setSelected(2)}
        >
          <MatchHistoryIcon selected={selected} />
          <span
            className={`text-xs ${
              selected != 2
                ? 'friend-text invisible absolute opacity-0 transition-all'
                : 'visible absolute text-[#70F89B]'
            }`}
          >
            Match History
          </span>
        </button>
        <button
          className="relative flex h-[60px] w-1/4 items-center 
                    justify-center border-2  border-t-0 
                    border-r-0 border-l-0 border-b-0  border-gray-100 
                    border-opacity-70 transition-all "
          onClick={() => setSelected(3)}
        >
          <RankingIcon selected={selected} />
          <span
            className={`${
              selected != 3
                ? 'friend-text invisible absolute opacity-0 transition-all'
                : 'visible absolute text-[#70F89B]'
            }`}
          >
            Ranking
          </span>
        </button>
      </div>
      <div className=" h-[400px]  min-h-[300px] overflow-y-auto">
        {selected == 0 ? (
          <FriendStats nickname={nickname} userProfile={userProfile} />
        ) : selected == 1 ? (
          <AchievementStats />
        ) : selected == 2 ? (
          <MatchHistoryStat/>
        ) : <div></div>}
      </div>
    </div>
  );
}

export default ProfileStats;
