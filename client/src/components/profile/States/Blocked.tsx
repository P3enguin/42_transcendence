import { useState, useEffect } from 'react';
import { Blocked } from '../Player';
function BlockedPlayers({ nickname }: { nickname: string }) {
  const [isLoading, setIsLoading] = useState(true);

  const [blockedList, setBlocked] = useState<any[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await fetch(
          process.env.NEXT_PUBLIC_BACKEND_HOST + '/players/blocked',
          {
            credentials: 'include',
          },
        );
        if (resp.ok) {
          const blocked = (await resp.json()) as any[];
          setBlocked(blocked);
          setIsLoading(false);
        }
      } catch (error) {
        console.log('An error has occurred');
      }
    };
    fetchData();
  }, [nickname]);

  async function unblockPlayer(e: React.MouseEvent, nickname: string) {
    e.preventDefault();
    try {
      const resp = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_HOST + '/players/unblock',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nickname: nickname }),
          credentials: 'include',
        },
      );
      if (resp.ok) {
        const newBlocklist = blockedList.filter(
          (blocked) => blocked.nickname != nickname,
        );
        setBlocked(newBlocklist);
        console.log('unblocked');
      } else {
        console.log('cannot unblock');
      }
    } catch (error) {
      console.log('An error has occurred');
    }
  }
  console.log(blockedList);
  if (isLoading) return <div className="text-center">Loading Data...</div>;
  else {
    if (blockedList.length === 0) {
      return <div className="text-center">You have no enemies </div>;
    } else {
      return (
        <div className="flex h-3/4 min-h-[233px] w-full flex-wrap justify-center p-6 sm:gap-10 ">
          {/* {blockedList.map((elem, index) => (
            <div key={index} className="w-[190px]">
              <Blocked
                nickname={elem.nickname}
                avatar={
                  process.env.NEXT_PUBLIC_BACKEND_HOST +
                  '/avatars/' +
                  elem.avatar
                }
                unblockPlayer={unblockPlayer}
              />
            </div>
          ))} */}
        </div>
      );
    }
  }
}

export default BlockedPlayers;
