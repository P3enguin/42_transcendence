import React, { use, useEffect, useState } from 'react';
import InviteFriendCard from './InviteFriendCard';
import axios from 'axios';
import { RadioInput } from './StartGame';
import { useRouter } from 'next/router';

const OnlineFriends = ({ data }: { data: [] }) => {
  const [friends, setFriends] = useState([]);
  const [gameType, setGameType] = useState('NORMAL');
  const router = useRouter();
  const inviteFriend = (user: {
    nickname: string;
    avatar: string;
    id: number;
  }) => {
    axios.get('/game/gameInvite', {
      params: {
        user: user,
        gameType,
      },
    }).then((res) => {
      console.log(res.data);
      router.push('/game/' + res.data);
    }).catch((err) => {
      console.log(err.message);
      
    });
  };

  useEffect(() => {
    axios
      .get('/players/friends')
      .then((res) => {
        setFriends(res.data);
      })
      .catch((err) => {});
  }, []);

  return (
    <div className="flex h-1/2 flex-col p-2 md:h-1/2 md:p-5">
      <h2 className="text-lg m-2 font-bold md:text-2xl">
        INVITE YOUR ONLINE FRIENDS TO PLAY:
      </h2>
      <div className="mx-5 flex flex-col flex-wrap items-center font-bold md:flex-row">
        <p className="self-start uppercase md:lowercase">select game mode:</p>
        <RadioInput
          id="invite-normal"
          label="Normal Game"
          onChange={(e: any) => {
            e.preventDefault();
            setGameType('NORMAL');
          }}
          className="mx-3 font-normal"
        />
        <RadioInput
          id="invite-time"
          label="Time Attack"
          onChange={(e: any) => {
            e.preventDefault();
            setGameType('TIME_ATTACK');
          }}
          className="mx-3 font-normal"
        />
        <RadioInput
          id="invite-survival"
          label="Survival"
          onChange={(e: any) => {
            e.preventDefault();
            setGameType('SURVIVAL');
          }}
          className="mx-3 font-normal"
        />
      </div>

      {friends && (
        <div className="scrollbar flex flex-wrap justify-center overflow-y-auto">
          {friends.map((user: any, index: number) => (
            <InviteFriendCard
              key={index}
              user={user}
              inviteFriend={inviteFriend}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default OnlineFriends;
