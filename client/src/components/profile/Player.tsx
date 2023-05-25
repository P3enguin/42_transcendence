import Link from 'next/link';
import StatusBubble from '../game/StatusBubble';
import { CancelIcon } from '../icons/Icons';
import Image from 'next/image';
interface PLayerProps {
  nickname: string;
  avatar: string;
  id?: number;
  status?: string;
  userProfile?: boolean;
  blockFriend?(
    e: React.MouseEvent,
    nickname: string,
    id?: number,
  ): Promise<void>;
  unblockPlayer?(e: React.MouseEvent, nickname: string): Promise<void>;
  openDMs?(event: React.FormEvent, nickname2: string): Promise<void>;
}

function Player({
  nickname,
  avatar,
  userProfile,
  blockFriend,
  openDMs,
  status,
  id,
}: PLayerProps) {
  return (
    <div className="flex  items-center justify-between rounded-xl border border-[#0097E2] p-1">
      {!userProfile && (
        <>
          <div className="flex w-full flex-row items-center gap-1 ">
            <Link href={'/users/' + nickname}>
              <Image
                width={45}
                height={45}
                className="h-[45px] w-[45px] rounded-full  border-2 border-[#0097E2] border-opacity-40 object-cover transition
                duration-300 ease-in hover:border-opacity-100 sm:h-[48px] sm:w-[48px]"
                src={
                  process.env.NEXT_PUBLIC_BE_CONTAINER_HOST +
                  '/avatars/' +
                  avatar
                }
                alt="pfp"
              />
            </Link>
            <strong className="w-[60%] text-center text-sm">
              {'@' + nickname}
            </strong>
          </div>
        </>
      )}
      {userProfile && (
        <>
          <div className="flex w-3/4 flex-row items-center gap-1">
            <Link href={'/users/' + nickname}>
              <StatusBubble
                avatar={avatar}
                status={status}
                imageClassName="sm:h-[48px] sm:w-[48px] h-[45px] w-[45px]"
              />
            </Link>
            <strong className="text-sm">{'@' + nickname}</strong>
          </div>
          <div className="flex flex-col gap-1 sm:gap-2 ">
            <button onClick={(e) => openDMs!(e, nickname)}>
              <Image
                width={17}
                height={17}
                src="/msgProfile.svg"
                alt="msg"
                className="h-[17px] w-[17px] "
              />
            </button>
            <button onClick={(event) => blockFriend!(event, nickname, id)}>
              <Image
                width={17}
                height={17}
                src="/blockFriend.svg"
                alt="msg"
                className="h-[17px] w-[17]"
              />
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export function Blocked({ nickname, avatar, unblockPlayer }: PLayerProps) {
  return (
    <div className="flex  items-center justify-between rounded-xl border border-[#0097E2] p-1">
      <div className="flex w-3/4 flex-row items-center gap-1">
        <Link href={'/users/' + nickname}>
          <Image
            width={45}
            height={45}
            className="h-[45px] w-[45px] rounded-full border-2 border-[#0097E2] border-opacity-40 object-cover transition
            duration-300 ease-in hover:border-opacity-100 sm:h-[48px] sm:w-[48px]"
            src={avatar}
            alt="pfp"
          />
        </Link>
        <strong className="text-sm">{'@' + nickname}</strong>
      </div>

      <button
        className="mr-1 flex flex-row "
        onClick={(event) => unblockPlayer!(event, nickname)}
      >
        <CancelIcon />
      </button>
    </div>
  );
}

export default Player;
