import Image from 'next/image';
import Link from 'next/link';

function MatchHistoryStat() {
  return (
    <div className="flex flex-row justify-between p-5">
      {/* overview */}
      <div className="flex flex-col  items-center justify-center gap-10">
        <h1>OVERVIEW:</h1>
        <div className="flex flex-col gap-3">
          <div className="flex w-[150px] flex-col rounded-xl bg-[#0097E2] p-2">
            <span className="text-xs text-[#D0CFCF]   ">Matches Played</span>
            <strong>45</strong>
          </div>
          <div className="flex w-[150px] flex-col rounded-xl border border-[#0097E2] p-2">
            <span className="text-xs text-[#D0CFCF]   ">Wins</span>
            <strong>30</strong>
          </div>
        </div>
      </div>

      {/* match history */}
      <div className="w-2/3">
        <div
          className={`flex w-[600px] items-center gap-[13px] rounded-[20px] border border-white bg-gradient-to-r 
             from-[#01fd91a8] to-[#2C3B7C] p-2`}
        >
          <div className="flex w-[45%] items-center gap-[13px]">
            <img
              className="rounded-full bg-[#8bd9ffb3]"
              src="hh"
              alt="pfp"
              width={56}
              height={56}
            />
            <div className="truncate text-sm font-semibold">tha_doomer</div>
          </div>
          <div className="flex w-[10%] flex-col items-center justify-center">
            <div className="text-lg font-bold">WIN</div>
            <div className="text-sm font-semibold">5-2</div>
            <div className="text-xs font-semibold text-[#CFCFCF]">5min ago</div>
          </div>
          <div className="flex w-[45%] items-center justify-end gap-[13px]">
            <div className="truncate text-sm font-semibold">erik</div>
            <img
              className="rounded-full bg-[#8bd9ffb3]"
              src="hh"
              alt="pfp"
              width={56}
              height={56}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MatchHistoryStat;
