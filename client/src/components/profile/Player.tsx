import Link from 'next/link';
interface PLayerProps {
  nickname: string;
  avatar: string;
  userProfile: boolean;
}

function Player({ nickname, avatar, userProfile }: PLayerProps) {
  return (
    <div className="flex  items-center justify-between rounded-xl border p-1">
      <div className="flex w-3/4 flex-row items-center gap-1">
        <Link href={'/users/' + nickname}>
          <img
            className="w-[45px] rounded-full border sm:w-[48px] h-[45px] sm:h-[48px]"
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
            <img
              src="/msgProfile.svg"
              alt="msg"
              className="h-[17px] w-[17px] "
            />
          </button>
          <button>
            <img src="/blockFriend.svg" alt="msg" className="h-[17px] w-[17]" />
          </button>
        </div>
      )}
    </div>
  );
}

export default Player;
