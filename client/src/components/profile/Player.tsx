import Link from 'next/link';
import { useEffect } from 'react';
interface PLayerProps {
  nickname: string;
  avatar: string;
  userProfile: boolean;
}

function Player({ nickname, avatar, userProfile }: PLayerProps) {
  async function blockFriend(e: React.MouseEvent) {
    e.preventDefault();
    const resp = await fetch(
      process.env.NEXT_PUBLIC_BACKEND_HOST + '/players/block',
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname: nickname }),
        credentials: 'include',
      },
    );
    if (resp.ok) {
      console.log('blocked');
    } else {
      console.log('not blocked');
    }
  }

  return (
    <div className="flex  items-center justify-between rounded-xl border p-1">
      <div className="flex w-3/4 flex-row items-center gap-1">
        <Link href={'/users/' + nickname}>
          <img
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
            <img
              src="/msgProfile.svg"
              alt="msg"
              className="h-[17px] w-[17px] "
            />
          </button>
          <button onClick={blockFriend}>
            <img src="/blockFriend.svg" alt="msg" className="h-[17px] w-[17]" />
          </button>
        </div>
      )}
    </div>
  );
}

export default Player;
