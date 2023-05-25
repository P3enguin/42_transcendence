import React, { useEffect, useState } from 'react';
import InviteFriendCard from './InviteFriendCard';
import axios from 'axios';
import { RadioInput } from './StartGame';
import { useRouter } from 'next/router';
import { Socket } from 'socket.io-client';

export interface Status {
  nickname: string;
  avatar: string;
  id: number;
  status: string;
}

const OnlineFriends = ({
  ws,
  wsConnected,
}: {
  ws: Socket;
  wsConnected: boolean;
}) => {
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
        if (ws) {
          ws.emit('gameInvite', { user, gameType, gameId: res.data });
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  useEffect(() => {
    if (ws && wsConnected) {
      console.log('getOnlineFriends');

      ws.emit('getOnlineFriends', (res: []) => {
        setOnlineFriends(
          res.filter((friend: Status) => friend.status !== 'OFFLINE' && friend.status !== 'IN_GAME'),
        );
      });

      ws.on('statusChange', (data: Status) => {
        if (data.status === 'OFFLINE' || data.status === 'IN_GAME') {
          setOnlineFriends((prev) => {
            return prev.filter((friend) => friend.id !== data.id);
          });
        } else {
          setOnlineFriends((prev) => {
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
        console.log('data', data);
      });
    }
    return () => {
      if (ws) {
        ws.off('statusChange');
      }
    };
  }, [ws, wsConnected]);

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
              friend={user}
              inviteFriend={inviteFriend}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default OnlineFriends;
