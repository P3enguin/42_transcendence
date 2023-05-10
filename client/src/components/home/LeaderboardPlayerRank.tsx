import Image from 'next/image';
import Link from 'next/link';

export default function LeaderboardPlayerRank({
  nickname,
  avatar,
  rankNo,
  rankName,
  rankColor,
}: {
  nickname: string;
  avatar: string;
  rankNo: number;
  rankName: string;
  rankColor: string;
}) {
  return (
    <div
      className={`m-2 flex w-full items-center rounded-[20px] border border-[${rankColor}] text-[${rankColor}] p-2`}
    >
      <p className={`w-[20%] pl-6 text-[30px]`}>{rankNo}</p>
      <Link
        href={'/users/' + nickname}
        className="flex w-[65%] items-center justify-start gap-6"
      >
        <Image
          className="rounded-full bg-[#8bd9ffb3]"
          src={avatar}
          alt="pfp"
          width={56}
          height={56}
        />
        <p className={`truncate font-semibold`}>{nickname}</p>
      </Link>
      {rankName !== 'none' && (
        <Image
          src={`/ranks/${rankName}.svg`}
          alt="rankAvatar"
          width={56}
          height={56}
        />
      )}
    </div>
  );
}
