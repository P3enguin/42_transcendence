interface PlayerProgress {
  coins: number;
}

function PlayerProgress({ coins }: PlayerProgress) {
  return (
    <div
      className="xl:mt-9 flex w-full items-center xl:justify-center 
        justify-around
            gap-10  text-[12px] sm:items-end
               xl:w-2/3"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:gap-10">
        <div className="flex items-center gap-2 ">
          <img src="/King.svg" alt="rankIcon" className="w-[45px]"></img>
          <div className="flex  flex-col  ">
            <strong className="  text-gray-100">GOLD</strong>
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
            <strong className="  text-gray-100">1800/2500 XP</strong>
            <span className=" text-gray-400">player XP</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <img src="/champion.svg" alt="champIcon" className="w-[27px] "></img>
          <div className="flex  flex-col ">
            <strong className="  text-gray-100">91 %</strong>
            <span className=" text-gray-400">win ratio</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlayerProgress;
