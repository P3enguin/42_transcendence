import React, { useEffect, useState } from 'react';
import InviteFriendCard from './InviteFriendCard';
import axios from 'axios';
import { RadioInput } from './StartGame';
import { useRouter } from 'next/router';
import { Socket } from 'socket.io-client';

export interface friend {
  nickname: string;
  avatar: string;
  id: number;
}

export interface Status {
  friend: friend;
  status: string;
}

const OnlineFriends = ({ ws }: { ws: Socket }) => {
  const [onlineFriends, setOnlineFriends] = useState<Status[]>([]);
  const [gameType, setGameType] = useState('NORMAL');
  const router = useRouter();

  const inviteFriend = (user: {
    nickname: string;
    avatar: string;
    id: number;
  }) => {
    console.log(user);
    axios
      .get('/game/invite', { params: { user: user, gameType } })
      .then((res) => {
        console.log(res.data);
        router.push('/game/' + res.data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  useEffect(() => {
    if (ws) {
      ws.emit('getOnlineFriends', (res: []) => {
        setOnlineFriends(res);
      });

      ws.on('statusChange', (data: Status) => {
        setOnlineFriends((prev) => {
          const updatedFriends = prev.map((iter) => {
            if (iter.friend.id === data.friend.id) {
              return { ...iter, status: data.status };
            } else {
              return iter;
            }
          });

          if (data.status === 'OFFLINE') {
            return updatedFriends.filter(
              (friend) => friend.friend.id !== data.friend.id,
            );
          } else {
            return updatedFriends;
          }
        });
      });
    }
    return () => {
      if (ws) {
        ws.off('statusChange');
      }
    };
  }, [ws]);

  return (
    <div className="flex h-[50%] flex-col p-2 md:h-1/2 md:p-5">
      <h2 className="text-lg m-2 font-bold md:text-2xl">
        INVITE YOUR ONLINE FRIENDS TO PLAY:
      </h2>
      <div className="mx-5 flex flex-col flex-wrap items-center font-bold md:flex-row">
        <p className="self-start uppercase md:lowercase">select game mode:</p>
        <RadioInput
          id="invite-normal"
          label="Normal Game"
          onChange={(e: any) => {
            setGameType('NORMAL');
          }}
          className="mx-3 font-normal"
        />
        <RadioInput
          id="invite-time"
          label="Time Attack"
          onChange={(e: any) => {
            setGameType('TIME_ATTACK');
          }}
          className="mx-3 font-normal"
        />
        <RadioInput
          id="invite-survival"
          label="Survival Mode"
          onChange={(e: any) => {
            setGameType('SURVIVAL');
          }}
          className="mx-3 font-normal"
        />
      </div>

      {onlineFriends && (
        <div className="scrollbar flex flex-wrap justify-center overflow-y-auto">
          {onlineFriends.map((user: any, index: number) => (
            <InviteFriendCard
              key={index}
              data={user}
              inviteFriend={inviteFriend}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default OnlineFriends;
