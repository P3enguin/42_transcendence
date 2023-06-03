import Image from "next/image";

function AchievementStats() {
  return (
    <div>
      <div className="flex h-3/4 min-h-[233px] w-full flex-wrap justify-center gap-10 p-6 ">
        <div className="flex h-1/4 w-[190px] items-center justify-between rounded-xl border  p-1">
          <div className="flex w-full flex-row items-center gap-1">
            <Image
              width={45}
              height={45}
              className="w-[45px] h-full shrink-0  rounded-full border-2 border-[#01FD91] sm:w-[48px] "
              src="/AchivStat.svg"
              alt="achivIcon"
            />
            <div className="text-center">
              <strong className="text-sm">Achivement Name</strong>
              <h3 className="text-center text-xs">Achivement description </h3>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}

export default AchievementStats;
