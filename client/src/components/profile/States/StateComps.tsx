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
      <div className="flex w-[45%] items-center gap-[13px]">
        <img
          className="rounded-full bg-[#8bd9ffb3]"
          src={P1Avatar}
          alt="pfp"
          width={56}
          height={56}
        />
        <div className="truncate text-sm font-semibold">{player1}</div>
      </div>
      <div className="flex w-[20%] flex-col items-center justify-center">
        <div className="text-lg font-bold">{status ? 'WIN' : 'LOSS'}</div>
        <div className="text-sm font-semibold">{score}</div>
        <div className="text-xs font-semibold text-[#CFCFCF]">
          {date + 'min ago'}{' '}
        </div>
      </div>
      <div className="flex w-[45%] items-center justify-end gap-[13px]">
        <div className="truncate text-sm font-semibold">{player2}</div>
        <img
          className="rounded-full bg-[#8bd9ffb3]"
          src={P2Avatar}
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
export { MatchData, OverViewData };
