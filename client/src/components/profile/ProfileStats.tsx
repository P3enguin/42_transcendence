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
import RankingStat from './States/RankingStat';
import { Socket } from 'socket.io-client';

function ProfileStats({
  nickname,
  userProfile,
  blockedByFriend,
  blockedByPlayer,
  ws,
  wsConnected,
}: {
  nickname: string;
  userProfile: boolean;
  blockedByFriend?: boolean;
  blockedByPlayer?: boolean;
  ws?: Socket;
  wsConnected?: boolean;
}) {
  const [selected, setSelected] = useState(-1);

  return (
    <div
      className="flex h-[500px] w-11/12 flex-col  rounded-3xl 
        bg-[#2F3B78] md:max-xl:w-5/6  xl:w-[1100px]"
    >
      <div
        className="flex border-2 border-l-0 border-r-0 border-t-0 
                border-gray-100 border-opacity-70 p-2 text-sm text-[#8BD9FF]"
      >
        <button
          className="relative flex h-[60px] w-1/4 items-center 
                     justify-center border-2 border-b-0 
                     border-l-0 border-t-0 border-gray-100 
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
                      border-b-0 border-l-0 border-t-0 border-gray-100 
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
                      justify-center  border-2 border-b-0 
                      border-l-0 border-t-0  border-gray-100 
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
                    justify-center border-2  border-b-0 
                    border-l-0 border-r-0 border-t-0  border-gray-100 
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
        {blockedByPlayer ? (
          <div className="flex justify-center text-xl text-red-700">
            You blocked {nickname} !
          </div>
        ) : blockedByFriend ? (
          <div className="flex justify-center text-xl text-red-700">
            you are blocked !
          </div>
        ) : selected == 0 ? (
          <FriendStats
            nickname={nickname}
            userProfile={userProfile}
            ws={ws!}
            wsConnected={wsConnected!}
          />
        ) : selected == 1 ? (
          <AchievementStats />
        ) : selected == 2 ? (
          <MatchHistoryStat nickname={nickname} />
        ) : selected == 3 ? (
          <RankingStat nickname={nickname} />
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
}

export default ProfileStats;
