import axios from 'axios';
import Link from 'next/link';
import React, { SetStateAction, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import StatusBubble from '../game/StatusBubble';

export interface friend {
  nickname: string;
  avatar: string;
  id: number;
}

export interface Status {
  friend: friend;
  status: string;
}

function OnlineNow({ player, token, ws }: any) {
  const [friends, setFriends] = useState<Status[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (ws) {
      ws.emit('getOnlineFriends', (res: []) => {
        setFriends(res);
      });
      ws.on('statusChange', (data: Status) => {
        if (data.status === 'OFFLINE') {
          setFriends((prev) => {
            return prev.filter((friend) => friend.friend.id !== data.friend.id);
          });
        } else {
          setFriends((prev) => {
            if (prev.find((friend) => friend.friend.id === data.friend.id)) {
              return prev.map((friend) => {
                if (friend.friend.id === data.friend.id) {
                  return data;
                }
                return friend;
              });
            } else return [...prev, data];
          });
        }
      });
    }
    return () => {
      if (ws) {
        ws.off('statusChange');
      }
    };
  }, [ws]);

  async function getRoom(event: React.FormEvent, player1: any, player2: any) {
    event.preventDefault();

    const room = player1 + player2;

    const res = await axios
      .get(
        `${process.env.NEXT_PUBLIC_BACKEND_HOST}/chat/getRoom?player1=${player1}&creator=${player2}`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      .then((res) => {
        // console.log(res.data);
        router.push(`/chat/${res.data}`);
      })
      .catch((err) => console.log(err));
  }

  return (
    <div className="flex h-[100px] w-[100%]  flex-col px-5 mt-3">
      <h3 className='uppercase font-semibold'>Online Now: </h3>
      <div
        className="scroll-hide flex h-full flex-row items-center gap-3
        overflow-hidden overflow-x-auto scrollbar-hide"
      >
        {friends.map((friend: any, key: number) => {
          return (
            <StatusBubble
              data={friend}
              key={key}
              className="cursor-pointer"
              onClick={(e) => getRoom(e, player, friend.nickname)}
            />
          );
        })}
      </div>
      <div className="flex flex-wrap justify-center overflow-y-auto sm:justify-start"></div>
    </div>
  );
}

export default OnlineNow;
