import axios from 'axios';
import Link from 'next/link';
import React, { SetStateAction, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import StatusBubble from '../game/StatusBubble';

export interface Status {
  nickname: string;
  avatar: string;
  id: number;
  status: string;
}

function OnlineNow({ nickname, token, ws }: any) {
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
            return prev.filter((friend) => friend.id !== data.id);
          });
        } else {
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
        }
      });
    }
    return () => {
      if (ws) {
        ws.off('statusChange');
      }
    };
  }, [ws]);

  async function openDMs(event: React.FormEvent, nickname2: string) {
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
        router.push(`/chat/${dmData.channelId}`);
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="mt-3 flex h-[100px]  w-[100%] flex-col px-5">
      <h3 className="font-semibold uppercase">Online Now: </h3>
      <div
        className="scroll-hide flex h-full flex-row items-center gap-3
        overflow-hidden overflow-x-auto scrollbar-hide"
      >
        {friends.map((friend: any, key: number) => {
          return (
            <StatusBubble
              avatar={friend.avatar}
              status={friend.status}
              key={key}
              className="cursor-pointer"
              onClick={(e) => openDMs(e, friend.nickname)}
            />
          );
        })}
      </div>
      <div className="flex flex-wrap justify-center overflow-y-auto sm:justify-start"></div>
    </div>
  );
}

export default OnlineNow;
