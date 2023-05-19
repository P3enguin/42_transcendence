import Image from 'next/image';
import Player from '../Player';
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
  }, [nickname]);

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
      <div className="flex h-3/4 min-h-[233px] w-full flex-wrap justify-center p-6 sm:gap-10 ">
        {friends.map((elem, index) => (
          <div key={index} className="w-[190px]">
            <Player
              nickname={elem.nickname}
              avatar={
                process.env.NEXT_PUBLIC_BACKEND_HOST + '/avatars/' + elem.avatar
              }
              userProfile={userProfile}
            />
          </div>
        ))}
      </div>
    );
  }
}

export default FriendStats;
