import Image from 'next/image';
import Link from 'next/link';
import { MatchData, OverViewData } from './StateComps';
import Player from '../Player';
function MatchHistoryStat() {
  return (
    <div className="flex flex-col justify-between p-5 lg:flex-row">
      {/* overview */}
      <div
        className="flex flex-col items-center justify-center gap-10  
                    border-0 border-gray-100 border-opacity-70 lg:w-[24.3%] 
                    lg:border-r-2"
      >
        <h1>OVERVIEW:</h1>
        <div className="flex w-full flex-row flex-wrap items-center justify-center gap-3  lg:flex-col">
          <OverViewData header={'Matches Played:'} data={45} colored={true} />
          <OverViewData header={'Wins:'} data={30} colored={false} />
          <OverViewData header={'Wins Streak:'} data={14} colored={false} />
          <OverViewData header={'Losses:'} data={15} colored={false} />
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
