import Image from 'next/image';
import { useEffect, useState } from 'react';
interface friendsInterface {
  nickname: string;
  avatar: string;
}
import Link from 'next/link';

function FriendStats({
  nickname,
  userProfile,
}: {
  nickname: string;
  userProfile: boolean;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [friends, setFriends] = useState<friendsInterface[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const resp = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_HOST +
          '/players/friends?' +
          new URLSearchParams({ nickname: nickname }),
        {
          credentials: 'include',
        },
      );
      if (resp.ok) {
        const friends = (await resp.json()) as friendsInterface[];
        setFriends(friends);
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) return <div className="text-center">Loading Data...</div>;
  else {
    if (friends.length === 0) {
      if (userProfile) {
        return <div className="text-center">You have no friends</div>;
      } else {
        return <div className="text-center">{nickname} has no friends</div>;
      }
    }
    return (
      <div className="flex h-3/4 min-h-[233px] w-full flex-wrap justify-center sm:gap-10 p-6 ">
        {friends.map((elem, index) => (
          <div
            className="flex h-1/4 w-[190px] items-center justify-between rounded-xl border  p-1"
            key={index}
          >
            <div className="flex w-3/4 flex-row items-center gap-1">
              <Link href={'/users/' + elem.nickname}>
                <img
                  className="w-[45px] rounded-full sm:w-[48px]"
                  src={
                    process.env.NEXT_PUBLIC_BACKEND_HOST +
                    '/avatars/' +
                    elem.avatar
                  }
                  alt="pfp"
                />
              </Link>
              <strong className="text-sm">{'@' + elem.nickname}</strong>
            </div>
            {userProfile && (
              <div className="flex flex-col gap-1 sm:gap-2 ">
                <button>
                  <img
                    src="/msgProfile.svg"
                    alt="msg"
                    className="h-[17px] w-[17px]"
                  />
                </button>
                <button>
                  <img
                    src="/blockFriend.svg"
                    alt="msg"
                    className="h-[17px] w-[17]"
                  />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }
}

export default FriendStats;
