import Player from '../Player';
import { useEffect, useState } from 'react';
import Router from 'next/router';
import { Socket } from 'socket.io-client';

interface friendsInterface {
  nickname: string;
  avatar: string;
  id?: number;
  status?: string;
}

function FriendStats({
  nickname,
  userProfile,
  ws,
  wsConnected,
}: {
  nickname: string;
  userProfile: boolean;
  ws: Socket;
  wsConnected: boolean;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [friends, setFriends] = useState<friendsInterface[]>([]);

  const statusDisconnect = (id: number) => {
    if (ws && wsConnected) {
      ws.emit('unfollowStatus', id);
    }
  };

  useEffect(() => {
    if (!userProfile) {
      const fetchData = async () => {
        try {
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
        } catch (error) {
          console.log('An error has occurred');
        }
      };
      fetchData();
    } else {
      if (ws && wsConnected) {
        ws.emit('getOnlineFriends', (res: []) => {
          setFriends(res);
          setIsLoading(false);
        });

        ws.on('statusChange', (data: friendsInterface) => {
          setFriends((prev) => {
            if (prev.find((friend) => friend.id === data.id)) {
              return prev.map((friend) => {
                if (friend.id === data.id) {
                  return data;
                }
                return friend;
              });
            } else return [...prev, data];
          });
        });
      }
      return () => {
        if (ws) {
          ws.off('statusChange');
        }
      };
    }
    //eslint-disable-next-line
  }, [nickname, ws, wsConnected]);

  async function openDMs(event: React.MouseEvent, nickname2: string) {
    event.preventDefault();
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_HOST + `/chat/dm?nickname=${nickname2}`,
        {
          credentials: 'include',
        },
      );

      if (response.ok) {
        const dmData = await response.json();
        Router.push(`/chat/${dmData.channelId}`);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function blockFriend(
    e: React.MouseEvent,
    nickname: string,
    id: number,
  ) {
    e.preventDefault();
    try {
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
        statusDisconnect(id);
        const newFriendList = friends.filter(
          (friend) => friend.nickname != nickname,
        );
        setFriends(newFriendList);
        console.log('blocked');
      } else {
        console.log('not blocked');
      }
    } catch (error) {
      console.log('An error has occurred');
    }
  }

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
      <div className="flex h-3/4 min-h-[233px] w-full flex-wrap justify-center gap-4 p-6 sm:gap-10 ">
        {friends.map((elem, index) => (
          <div key={index} className="w-[190px]">
            <Player
              nickname={elem.nickname}
              avatar={elem.avatar}
              openDMs={openDMs}
              userProfile={userProfile}
              blockFriend={blockFriend}
              status={elem.status}
              id={elem.id}
            />
          </div>
        ))}
      </div>
    );
  }
}

export default FriendStats;
