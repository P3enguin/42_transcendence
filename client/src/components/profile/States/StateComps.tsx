import Image from 'next/image';
interface MatchDataInterf {
  player1: string;
  player2: string;
  status: boolean;
  date: string;
  score: string;
  P1Avatar: string;
  P2Avatar: string;
}

interface OverViewDataInterf {
  header: string;
  data: number;
  colored: boolean;
}

interface ImageInterf {
  rank: string;
  width: string;
  isVisible: boolean;
}

function MatchData({
  player1,
  player2,
  status,
  score,
  date,
  P1Avatar,
  P2Avatar,
}: MatchDataInterf) {
  return (
    <div
      className={`flex w-full max-w-[600px] items-center gap-[13px] rounded-[20px] border border-white 
           bg-gradient-to-r ${
             status ? 'from-[#01fd91a8]' : 'from-[#ff0d3ea8]'
           } to-[#2C3B7C] p-2`}
    >
      <div className="flex w-[40%] items-center gap-[13px] lg:w-[45%]">
        <Image
          className="h-[56px] w-[56px] rounded-full bg-[#8bd9ffb3]"
          src={process.env.NEXT_PUBLIC_BE_CONTAINER_HOST + '/avatars/' + P1Avatar}
          alt="pfp"
          width={56}
          height={56}
        />
        <div className="truncate text-sm font-semibold">{player1}</div>
      </div>
      <div className="flex w-[20%]  flex-col items-center justify-center ">
        <div className="text-lg font-bold">{status ? 'WIN' : 'LOSS'}</div>
        <div className="text-[15px] font-semibold">{score}</div>
        <div className="text-[9.4px] font-semibold  text-[#CFCFCF] sm:text-[12px]">
          {date}{' '}
        </div>
      </div>
      <div className="flex w-[40%]  items-center justify-end gap-[13px] lg:w-[45%]">
        <div className="truncate text-sm font-semibold">{player2}</div>
        <Image
          className="h-[56px] w-[56px] rounded-full bg-[#8bd9ffb3]"
          src={process.env.NEXT_PUBLIC_BE_CONTAINER_HOST + '/avatars/' + P2Avatar}
          alt="pfp"
          width={56}
          height={56}
        />
      </div>
    </div>
  );
}

function OverViewData({ header, data, colored }: OverViewDataInterf) {
  return (
    <div
      className={`flex  w-[140px]  flex-col rounded-xl ${
        colored ? 'bg-[#0097E2]' : 'border border-[#0097E2]'
      } p-2`}
    >
      <span className="text-xs text-[#D0CFCF]   ">{header}</span>
      <strong>{data}</strong>
    </div>
  );
}

function Rank({ rank, width, isVisible }: ImageInterf) {
  return (
    <Image
      width={20}
      height={20}
      src={'/ranks/' + rank + '.svg'}
      alt={rank}
      className={`${width}  ${isVisible ? '' : 'mix-blend-luminosity h-full'}`}
    ></Image>
  );
}
export { MatchData, OverViewData, Rank };
