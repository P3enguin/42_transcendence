import Image from 'next/image';
import Link from 'next/link';

export default function LiveGame({
  nickname1,
  avatar1,
  nickname2,
  avatar2,
  score,
  watchLink,
}: any) {
  return (
    <div className="flex w-full items-center gap-[13px] rounded-[20px] border border-white p-2">
      <div className="flex w-[40%] items-center justify-end gap-[13px]">
        <div className="truncate font-semibold">{nickname1}</div>
        <Image
          className="rounded-full bg-[#8bd9ffb3]"
          src={avatar1}
          alt="pfp"
          width={56}
          height={56}
        />
      </div>
      <div className="flex w-[20%] flex-col items-center justify-center">
        <div className="text-sm font-semibold">{score}</div>
        <div className="text-xl font-bold">VS</div>
        <Link href={watchLink}>
          <button className="rounded-[5px] bg-[#8BD9FF] px-2 text-sm font-semibold">
            Watch
          </button>
        </Link>
      </div>
      <div className="flex w-[40%] items-center justify-start gap-[13px]">
        <Image
          className="rounded-full bg-[#8bd9ffb3]"
          src={avatar2}
          alt="pfp"
          width={56}
          height={56}
        />
        <div className="truncate font-semibold">{nickname2}</div>
      </div>
    </div>
  );
}
