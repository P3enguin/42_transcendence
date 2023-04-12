import Image from 'next/image';

function LeaderboardPlayerRank({
  nickname,
  avatar,
  rank,
  rankAvatar,
  rankColor,
}: any) {
  return (
    <div
      className={`flex w-full items-center rounded-[20px] border border-[${rankColor}] text-[${rankColor}] p-2`}
    >
      <div className="w-[20%] pl-6 text-[30px]">{rank}</div>
      <div className="flex w-[65%] items-center justify-start gap-6">
        <Image
          className="rounded-full bg-[#8bd9ffb3]"
          src={avatar}
          alt="pfp"
          width={56}
          height={56}
        />
        <div className="truncate font-semibold">{nickname}</div>
      </div>
      <Image src={rankAvatar} alt="rankAvatar" width={56} height={56} />
    </div>
  );
}

export default LeaderboardPlayerRank;
