import Image from 'next/image';
import Link from 'next/link';

export default function LeaderboardPlayerRank({
  nickname,
  avatar,
  rankNo,
  rankName,
}: {
  nickname: string;
  avatar: string;
  rankNo: number;
  rankName: string;
}) {
  return (
    <div
      className={`my-2 flex w-full items-center rounded-[20px] border pr-4 ${
        rankName === 'UnRanked'
          ? 'border-[#ffffff] text-[#ffffff]'
          : rankName === 'Iron'
          ? 'border-[#B0AEA8] text-[#B0AEA8]'
          : rankName === 'Bronze'
          ? 'border-[#CD7F32] text-[#CD7F32]'
          : rankName === 'Silver'
          ? 'border-[#DDEDF9] text-[#DDEDF9]'
          : rankName === 'Gold'
          ? 'border-[#EBA335] text-[#EBA335]'
          : rankName === 'Platinum'
          ? 'border-[#5DEAEE] text-[#5DEAEE]'
          : rankName === 'Diamond'
          ? 'border-[#B7D1FF] text-[#B7D1FF]'
          : rankName === 'Amethyst'
          ? 'border-[#7E08CB] text-[#7E08CB]'
          : rankName === 'RedStar'
          ? 'border-[#EC482F] text-[#EC482F]'
          : rankName === 'Master'
          ? 'border-[#2DADFF] text-[#2DADFF]'
          : 'border-[#EB1EB7] text-[#EB1EB7]'
      }`}
    >
      <p className={`w-[20%] pl-6 text-[30px]`}>{rankNo}</p>
      <Link
        href={'/users/' + nickname}
        className="flex w-[65%] items-center justify-start gap-6"
      >
        <Image
          className={`h-[65px] w-[65px] rounded-full border-2 border-opacity-50 
            transition duration-300 ease-in hover:border-opacity-100 ${
              rankName === 'UnRanked'
                ? 'border-[#ffffff] text-[#ffffff]'
                : rankName === 'Iron'
                ? 'border-[#B0AEA8] text-[#B0AEA8]'
                : rankName === 'Bronze'
                ? 'border-[#CD7F32] text-[#CD7F32]'
                : rankName === 'Silver'
                ? 'border-[#DDEDF9] text-[#DDEDF9]'
                : rankName === 'Gold'
                ? 'border-[#EBA335] text-[#EBA335]'
                : rankName === 'Platinum'
                ? 'border-[#5DEAEE] text-[#5DEAEE]'
                : rankName === 'Diamond'
                ? 'border-[#B7D1FF] text-[#B7D1FF]'
                : rankName === 'Amethyst'
                ? 'border-[#7E08CB] text-[#7E08CB]'
                : rankName === 'RedStar'
                ? 'border-[#EC482F] text-[#EC482F]'
                : rankName === 'Master'
                ? 'border-[#2DADFF] text-[#2DADFF]'
                : 'border-[#EB1EB7] text-[#EB1EB7]'
            } `}
          src={avatar}
          alt="pfp"
          width={65}
          height={65}
        />
        <p className={`truncate font-semibold`}>{nickname}</p>
      </Link>
      {rankName !== 'UnRanked' && (
        <Image
          className="h-[80px] w-[80px]"
          src={
            process.env.NEXT_PUBLIC_BE_CONTAINER_HOST +
            '/ranks/' +
            rankName +
            '.png'
          }
          alt="rankName"
          width={100}
          height={100}
        />
      )}
    </div>
  );
}
