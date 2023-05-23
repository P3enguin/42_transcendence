import Link from 'next/link';
import { useEffect } from 'react';
import { CancelIcon } from '../icons/Icons';
import Image from 'next/image';
interface PLayerProps {
  nickname: string;
  avatar: string;
  userProfile?: boolean;
  blockFriend?(e: React.MouseEvent, nickname: string): Promise<void>;
  unblockPlayer?(e: React.MouseEvent, nickname: string): Promise<void>;
}

function Player({ nickname, avatar, userProfile, blockFriend }: PLayerProps) {
  return (
    <div className="flex  items-center justify-between rounded-xl border p-1">
      <div className="flex w-3/4 flex-row items-center gap-1">
        <Link href={'/users/' + nickname}>
          <Image
            width={45}
            height={45}
            className="h-[45px] w-[45px] rounded-full border sm:h-[48px] sm:w-[48px]"
            src={
              //   process.env.NEXT_PUBLIC_BACKEND_HOST + '/avatars/' + elem.avatar
              avatar
            }
            alt="pfp"
          />
        </Link>
        <strong className="text-sm">{'@' + nickname}</strong>
      </div>
      {userProfile && (
        <div className="flex flex-col gap-1 sm:gap-2 ">
          <button>
            <Image
              width={17}
              height={17}
              src="/msgProfile.svg"
              alt="msg"
              className="h-[17px] w-[17px] "
            />
          </button>
          <button onClick={(event) => blockFriend!(event, nickname)}>
            <Image
              width={17}
              height={17}
              src="/blockFriend.svg"
              alt="msg"
              className="h-[17px] w-[17]"
            />
          </button>
        </div>
      )}
    </div>
  );
}

export function Blocked({ nickname, avatar, unblockPlayer }: PLayerProps) {
  return (
    <div className="flex  items-center justify-between rounded-xl border p-1">
      <div className="flex w-3/4 flex-row items-center gap-1">
        <Link href={'/users/' + nickname}>
          <Image
            width={45}
            height={45}
            className="h-[45px] w-[45px] rounded-full border sm:h-[48px] sm:w-[48px]"
            src={avatar}
            alt="pfp"
          />
        </Link>
        <strong className="text-sm">{'@' + nickname}</strong>
      </div>

      <button
        className="flex flex-row mr-1 "
        onClick={(event) => unblockPlayer!(event, nickname)}
      >
        <CancelIcon />
      </button>
    </div>
  );
}

export default Player;
