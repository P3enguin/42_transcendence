import { Game } from '@/interfaces/Game';
import Image from 'next/image';
import Link from 'next/link';

export default function LiveGame({ liveGame }: { liveGame: Game }) {
  const { id, players, type, createdAt, updatedAt } = liveGame;

  return (
    <div className="flex w-full items-center gap-[13px] rounded-[20px] border border-white p-2">
      <Link
        href={'/users/' + players[0].nickname}
        className="flex w-[40%] items-center justify-end gap-[13px]"
      >
        <div className="truncate font-semibold">{players[0].nickname}</div>
        <Image
          className="h-[56px] w-[56px] rounded-full border-2 border-[#0097E2] border-opacity-50 transition duration-300 ease-in hover:border-opacity-100"
          src={
            process.env.NEXT_PUBLIC_BE_CONTAINER_HOST +
            '/avatars/' +
            players[0].avatar
          }
          alt="pfp"
          width={56}
          height={56}
        />
      </Link>
      <div className="flex w-[20%] flex-col items-center justify-center">
        <div className="text-sm font-semibold">
          {players[0].score}-{players[1].score}
        </div>
        <div className="text-xl font-bold">VS</div>
        <Link href={'game/' + id}>
          <button className="rounded-[5px] bg-[#8BD9FF] px-2 text-sm font-semibold">
            Watch
          </button>
        </Link>
      </div>
      <Link
        href={'/users/' + players[1].nickname}
        className="flex w-[40%] items-center justify-start gap-[13px]"
      >
        <Image
          className="h-[56px] w-[56px] rounded-full border-2 border-[#0097E2] border-opacity-50 transition duration-300 ease-in hover:border-opacity-100"
          src={
            process.env.NEXT_PUBLIC_BE_CONTAINER_HOST +
            '/avatars/' +
            players[1].avatar
          }
          alt="pfp"
          width={56}
          height={56}
        />
        <div className="truncate font-semibold">{players[1].nickname}</div>
      </Link>
    </div>
  );
}
