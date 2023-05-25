import { Channel } from '@/interfaces/Channel';
import StatusBubble from '../game/StatusBubble';
import { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import axios from 'axios';
import { useRouter } from 'next/router';
import { RadioInput } from '../game/StartGame';
import Link from 'next/link';

export default function DMDetails({
  nickname,
  channel,
  isVisible,
  toggleVisible,
  ws,
}: {
  nickname: string;
  channel: Channel;
  isVisible: boolean;
  toggleVisible: (isVisible: boolean) => void;
  ws: Socket;
}) {
  const [status, setStatus] = useState('');
  const [gameType, setGameType] = useState('NORMAL');
  const router = useRouter();

  async function blockUser(e: React.MouseEvent) {
    e.preventDefault();
    const response = await fetch(
      process.env.NEXT_PUBLIC_BACKEND_HOST + '/players/block',
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname: channel.name }),
        credentials: 'include',
      },
    );
    if (response.ok) {
      router.push('/chat');
    }
  }

  const inviteFriend = (user: {
    nickname: string;
    avatar: string;
    id: number;
  }) => {
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
    if (channel.isChannel) {
      setStatus('');
      return;
    }
    if (ws) {
      ws.emit('getUserStatus', { name: channel.name }, (data: any) => {
        console.log(data);
        setStatus(data);
      });
    }
    return () => {
      if (ws) {
        ws.off('statusChange');
      }
    };
  }, [ws, channel]);

  return (
    <div
      className={`absolute right-0 top-0 transition duration-500 ${
        !isVisible ? 'translate-x-[100%]' : ''
      } h-full w-[456px] rounded-[20px] bg-[#283775d1] backdrop-blur-[10px]`}
    >
      <button
        className="absolute left-6 top-6 flex h-[20px] w-[20px] items-center justify-center rounded-full bg-[#8BD9FF4D] hover:bg-[#8BD9FF66]"
        onClick={() => {
          toggleVisible(false);
        }}
      >
        <div className="absolute h-[0.1rem] w-[45%] rotate-45 transform rounded-sm bg-[#8BD9FF]"></div>
        <div className="absolute h-[0.1rem] w-[45%] -rotate-45 transform rounded-sm bg-[#8BD9FF]"></div>
      </button>
      <div className="absolute right-5 top-5 flex flex-col gap-2">
        <button
          className="flex h-6 w-16 items-center justify-center rounded-md bg-[#FF0D3EA8] hover:bg-[#FF0D3EBF] active:shadow-[inset_0px_4px_4px_rgba(0,0,0,0.35)]"
          onClick={blockUser}
        >
          <p className="fond-bold text-[10px] uppercase">Block</p>
        </button>
      </div>
      <div className="mt-10 flex w-full flex-col items-center justify-center gap-4">
        <StatusBubble
          avatar={channel.avatar}
          status={status}
          imageClassName="h-[100px] w-[100px]"
          isChannel={channel.isChannel}
        />
        <div className="flex flex-col items-center gap-1">
          <Link
            href={'/users/' + channel.name}
            className="text-base font-bold hover:underline"
          >
            {channel.topic}
          </Link>
          <Link
            href={'/users/' + channel.name}
            className="text-[15px] font-semibold text-[#B4B4B4] hover:underline"
          >
            @{channel.name}
          </Link>
        </div>
      </div>
      <div className="mt-16 flex flex-col items-center gap-6 px-20">
        <p className="translate-x-[-75%] text-sm font-semibold uppercase">
          Invite for a game:
        </p>
        <div className="flex flex-col items-center">
          <RadioInput
            id="invite-normal"
            label="Normal Game"
            onChange={(e: any) => {
              setGameType('NORMAL');
            }}
            className="text-sm font-light"
          />
          <RadioInput
            id="invite-time"
            label="Time Attack"
            onChange={(e: any) => {
              setGameType('TIME_ATTACK');
            }}
            className="text-sm font-light"
          />
          <RadioInput
            id="invite-survival"
            label="Survival Mode"
            onChange={(e: any) => {
              setGameType('SURVIVAL');
            }}
            className="text-sm font-light"
          />
        </div>
        <button
          className="mt-5 h-6 w-14 -translate-x-6 rounded-md bg-[#0097E2E6] text-sm font-normal hover:bg-[#0097E2] active:shadow-[inset_0px_4px_4px_rgba(0,0,0,0.35)]"
          onClick={(e) => {
            e.preventDefault();
            // inviteFriend(friend);
          }}
        >
          Invite
        </button>
      </div>
    </div>
  );
}
