import Image from 'next/image';
import Link from 'next/link';
import { MatchData } from './StateComps';
function MatchHistoryStat() {
  return (
    <div className="flex flex-col justify-between p-5 lg:flex-row">
      {/* overview */}
      <div
        className=" flex flex-col items-center justify-center gap-10  
                    border-0 border-gray-100 border-opacity-70 lg:w-[24.3%] 
                    lg:border-r-2"
      >
        <h1>OVERVIEW:</h1>
        <div className="flex w-full flex-row flex-wrap items-center justify-center gap-3  lg:flex-col">
          <div className="flex  w-[140px]  flex-col rounded-xl bg-[#0097E2] p-2">
            <span className="text-xs text-[#D0CFCF]   ">Matches Played</span>
            <strong>45</strong>
          </div>
          <div className="flex  w-[140px]  flex-col rounded-xl border border-[#0097E2] p-2">
            <span className="text-xs text-[#D0CFCF]   ">Wins</span>
            <strong>30</strong>
          </div>
          <div className="flex  w-[140px]  flex-col rounded-xl border border-[#0097E2] p-2">
            <span className="text-xs text-[#D0CFCF]   ">Wins</span>
            <strong>30</strong>
          </div>
          <div className="flex  w-[140px]  flex-col rounded-xl border border-[#0097E2] p-2">
            <span className="text-xs text-[#D0CFCF]   ">Wins</span>
            <strong>30</strong>
          </div>
        </div>
      </div>

      {/* match history */}
      <div className="mt-10 flex h-[300px] w-full flex-col items-center  gap-5  overflow-auto lg:w-2/3 ">
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
  );
}

export default MatchHistoryStat;
