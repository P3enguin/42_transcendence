import exp from 'constants';
import { Rank } from './StateComps';
interface PlayerProgress {
  coins: number;
  rankId: number;
  winRatio: string;
  exp: number;
  maxExp: number;
}

function PlayerProgress({
  coins,
  rankId,
  winRatio,
  exp,
  maxExp,
}: PlayerProgress) {
  const ranks = [
    'Unranked',
    'Iron',
    'Bronze',
    'Silver',
    'Gold',
    'Platinum',
    'Diamond',
    'Amethyst',
    'RedStar',
    'Master',
    'King',
  ];
  return (
    <div
      className="flex w-full items-center justify-around gap-10 
        text-[12px] sm:items-end  xl:mt-9 xl:w-2/3 xl:justify-center"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:gap-10">
        <div className="flex items-center gap-2 ">
          <Rank rank={ranks[rankId]} width="w-[35px]" isVisible={true} />
          <div className="flex  flex-col  ">
            <strong className="  text-gray-100">{ranks[rankId]}</strong>
            <span className=" text-gray-400">Ranking</span>
          </div>
        </div>
        <div className="flex items-center  gap-2">
          <img src="/coin.svg" alt="coinIcon" className="w-[27px]"></img>
          <div className="flex  flex-col ">
            <strong className="  text-gray-100">{coins + ' ₳'} </strong>
            <span className=" text-gray-400">cache earned</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col  gap-4 sm:flex-row sm:gap-10">
        <div className="flex items-center gap-2">
          <img src="/star.svg" alt="startIcon" className="w-[27px] "></img>
          <div className="flex  flex-col ">
            <strong className="  text-gray-100">
              {exp}/{maxExp} XP
            </strong>
            <span className=" text-gray-400">player XP</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <img src="/champion.svg" alt="champIcon" className="w-[27px] "></img>
          <div className="flex  flex-col ">
            <strong className="  text-gray-100">{winRatio + '%'}</strong>
            <span className=" text-gray-400">win ratio</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlayerProgress;
