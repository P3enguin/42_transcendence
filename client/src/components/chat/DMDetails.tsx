import { Channel, Member } from '@/interfaces/Channel';
import StatusBubble from '../game/StatusBubble';
import { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import axios from 'axios';
import { useRouter } from 'next/router';
import { RadioInput } from '../game/StartGame';
import Link from 'next/link';

interface GameInvite {
  nickname: string;
  avatar: string;
  id: number;
}

export default function DMDetails({
  nickname,
  member,
  isVisible,
  toggleVisible,
  ws,
  blocked,
}: {
  nickname: string;
  member: Member;
  isVisible: boolean;
  toggleVisible: (isVisible: boolean) => void;
  ws: Socket;
  blocked: Member[];
}) {
  const [status, setStatus] = useState('');
  const [gameType, setGameType] = useState('NORMAL');
  const [isBlocked, setBlocked] = useState(
    blocked.find((user) => user.nickname === member.nickname) ? true : false,
  );
  const router = useRouter();

  async function blockUser() {
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_HOST + '/players/block',
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nickname: member.nickname }),
          credentials: 'include',
        },
      );
      if (response.ok) {
        setBlocked(true);
        router.push('/chat');
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function unblockUser() {
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_HOST + '/players/unblock',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nickname: member.nickname }),
          credentials: 'include',
        },
      );
      if (response.ok) {
        setBlocked(false);
        toggleVisible(false);
      }
    } catch (error) {
      console.error(error);
    }
  }

  const inviteFriend = (user: GameInvite) => {
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
    if (ws) {
      ws.emit('getUserStatus', { name: member.nickname }, (data: any) => {
        console.log(data);
        setStatus(data);
      });
    }
    return () => {
      if (ws) {
        ws.off('statusChange');
      }
    };
  }, [ws, member]);

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
        {isBlocked ? (
          <button
            className="flex h-6 w-16 items-center justify-center rounded-md bg-[#FF0D3EA8] hover:bg-[#FF0D3EBF] active:shadow-[inset_0px_4px_4px_rgba(0,0,0,0.35)]"
            onClick={unblockUser}
          >
            <p className="fond-bold text-[10px] uppercase">Unblock</p>
          </button>
        ) : (
          <button
            className="flex h-6 w-16 items-center justify-center rounded-md bg-[#FF0D3EA8] hover:bg-[#FF0D3EBF] active:shadow-[inset_0px_4px_4px_rgba(0,0,0,0.35)]"
            onClick={blockUser}
          >
            <p className="fond-bold text-[10px] uppercase">Block</p>
          </button>
        )}
      </div>
      <div className="mt-10 flex w-full flex-col items-center justify-center gap-4">
        <StatusBubble
          avatar={member.avatar}
          status={status}
          imageClassName="h-[100px] w-[100px]"
          isChannel={false}
        />
        <div className="flex flex-col items-center gap-1">
          <Link
            href={'/users/' + member.nickname}
            className="text-base font-bold hover:underline"
          >
            {member.firstname + ' ' + member.lastname}
          </Link>
          <Link
            href={'/users/' + member.nickname}
            className="text-[15px] font-semibold text-[#B4B4B4] hover:underline"
          >
            @{member.nickname}
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
            if (!member.id) return;
            e.preventDefault();
            inviteFriend({
              nickname: member.nickname,
              avatar: member.avatar,
              id: member.id,
            });
          }}
        >
          Invite
        </button>
      </div>
    </div>
  );
}
