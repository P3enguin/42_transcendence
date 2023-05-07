import { MatchData, Rank } from './StateComps';
import { RankingIconFix } from '@/components/icons/Icons';
function RankingStat() {
  return (
    <div className="flex flex-col p-8 pb-0">
      <div className="flex h-[100px] w-full items-center  overflow-x-auto ">
        <div className="relative mb-4 h-4 w-[900px] rounded-full bg-[#0D1743]  ">
          <div
            className="h-4 rounded-full bg-[#01FD91]"
            style={{ width: '45%' }}
          ></div>
          <div className="relative -top-9 flex w-[920px] flex-row justify-between -left-[2.5px]">
            <Rank rank="Iron" width="w-[50px]" isVisible={true} />
            <Rank rank="Bronze" width="w-[50px]" isVisible={true} />
            <Rank rank="Silver" width="w-[50px]" isVisible={true} />
            <Rank rank="Gold" width="w-[50px]" isVisible={true} />
            <Rank rank="Platinum" width="w-[55px]" isVisible={true} />
            <Rank rank="Diamond" width="w-[55px]" isVisible={false} />
            <Rank rank="Amethyst" width="w-[50px]" isVisible={false} />
            <Rank rank="RedStar" width="w-[50px]" isVisible={false} />
            <Rank rank="Master" width="w-[60px]" isVisible={false} />
            <Rank rank="King" width="w-[70px]" isVisible={false} />
          </div>
        </div>
      </div>

      <div
        className="flex h-[250px] flex-col  justify-between lg:gap-10 border-t-2 border-gray-100 
                     border-opacity-70 text-sm lg:flex-row"
      >
        <div
          className="mt-10 flex flex-col items-center justify-start gap-5  
                    border-0 border-gray-100 border-opacity-70 text-sm 
                    lg:w-[50%] lg:border-r-2"
        >
          <h1>STATS:</h1>
          <div className="flex flex-row items-center justify-evenly  lg:w-2/3 w-1/2">
            <img src="/star.svg" alt="startIcon" className="w-[20px]"></img>
            <p>Rank Point : 120RP</p>
          </div>
          <div className="flex flex-row items-center justify-evenly lg:w-2/3 w-1/2">
            <RankingIconFix />
            <p>Current Rank : Platin</p>
          </div>
          <div className="flex flex-row items-center justify-evenly lg:w-2/3 w-1/2">
            <RankingIconFix />
            <p>Next Rank : Platinum</p>
          </div>
        </div>
        <div className="mt-9 flex  w-full flex-col items-center">
          <h1>RECENT RANK GAMES:</h1>
          <div className="mt-4 flex h-[250px] w-full flex-col items-center  gap-5  overflow-auto">
            <MatchData
              player1={'hhmangol'}
              player2={'3absslam'}
              status={true}
              date={'5'}
              score={'12-1'}
              P1Avatar={'mangol'}
              P2Avatar={'3abslam'}
            />
            <MatchData
              player1={'hhmangol'}
              player2={'3absslam mol'}
              status={false}
              date={'5'}
              score={'12-1'}
              P1Avatar={'mangol'}
              P2Avatar={'3abslam'}
            />
            <MatchData
              player1={'hhmangol'}
              player2={'3absslam'}
              status={true}
              date={'5'}
              score={'12-1'}
              P1Avatar={'mangol'}
              P2Avatar={'3abslam'}
            />
            <MatchData
              player1={'hhmangol'}
              player2={'3absslam'}
              status={false}
              date={'5'}
              score={'12-1'}
              P1Avatar={'mangol'}
              P2Avatar={'3abslam'}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default RankingStat;
