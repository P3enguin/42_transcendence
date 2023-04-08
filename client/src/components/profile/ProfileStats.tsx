import {
    FriendIcon,
    AchievementIcon,
    MatchHistoryIcon,
    RankingIcon,
  } from '@/components/icons/Icons';

import FriendStats from './States/Friends';
import AchievementStats from './States/Achievement';

function ProfileStats() {
    return (  <div
        className="flex  w-11/12 flex-col justify-center rounded-3xl 
        bg-[#2F3B78] md:max-xl:w-5/6  xl:w-[1000px]"
      >
        <div
          className="flex border-2 border-t-0 border-l-0 border-r-0 
                border-gray-100 border-opacity-70 p-2 text-sm text-[#8BD9FF]"
        >
          <button
            className="flex  h-[60px] w-1/4 items-center 
                     justify-center  border-2 border-t-0 
                     border-l-0 border-b-0 border-gray-100 
                     border-opacity-70 transition-all"
          >
            <FriendIcon />
            <span className="friend-text invisible absolute opacity-0 transition-all">
              Friends
            </span>
          </button>
          <button
            className="flex h-[60px] w-1/4 items-center 
                     justify-center  border-2 
                      border-t-0 border-l-0 border-b-0 border-gray-100 
                      border-opacity-70 transition-all "
          >
            <AchievementIcon />
            <span className="friend-text invisible absolute opacity-0 transition-all ">
              Achievement
            </span>
          </button>
          <button
            className="flex h-[60px] w-1/4 items-center 
                      justify-center  border-2 border-t-0 
                      border-l-0 border-b-0  border-gray-100 
                      border-opacity-70 transition-all"
          >
            <MatchHistoryIcon />
            <span className="friend-text invisible absolute text-xs opacity-0 transition-all">
              Match History
            </span>
          </button>
          <button
            className="flex h-[60px] w-1/4 items-center 
                    justify-center border-2  border-t-0 
                    border-r-0 border-l-0 border-b-0  border-gray-100 
                    border-opacity-70 transition-all "
          >
            <RankingIcon />
            <span className="friend-text invisible absolute opacity-0 transition-all">
              Ranking
            </span>
          </button>
        </div>
        <div className=" h-[200px]  overflow-y-auto md:h-[400px] ">
          <FriendStats/>    
          {/* <AchievementStats/> */}
        </div>
      </div>);
}

export default ProfileStats;