import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Socket } from 'socket.io-client';
import { useRouter } from 'next/router';

export const InvitationPopup = ({ invitation, rmInvitation }: any) => {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      rmInvitation(invitation, 'deny');
    }, 10000);
    return () => clearTimeout(timer);
  }, [invitation]);

  return (
    <div className="rounded-[18px]  ">
      <div
        className="relative flex h-[100px] w-full items-center  rounded-2xl
      border-[3px] border-[#0097E2]  bg-[#44659C] bg-opacity-20 p-2 backdrop-blur-[9px] sm:p-5"
      >
        <Image
          src={`${process.env.NEXT_PUBLIC_BE_CONTAINER_HOST}/avatars/${invitation.user.avatar}`}
          alt="avatar"
          width={100}
          height={100}
          className="mr-2 h-[60px] w-[60px] rounded-full border-2 border-[#0097E2]
            border-opacity-50 transition duration-300 ease-in hover:border-opacity-100
            sm:mr-5"
        />
        <p className="mb-4 text-left sm:mb-0">
          {invitation.user.nickname} wants to play with you a{' '}
          {invitation.gameType}
        </p>
        <div className="absolute bottom-0  right-[5px]">
          <button
            className="m-1 h-[25px] w-[70px] rounded-lg bg-[#01FD91] bg-opacity-50 uppercase"
            onClick={() => {
              rmInvitation(invitation, 'accept');
              router.push('/game/' + invitation.gameId);
            }}
          >
            Accept
          </button>
          <button
            className="m-1 h-[25px] w-[70px] rounded-lg bg-[#FF0D32] bg-opacity-50 uppercase"
            onClick={() => {
              rmInvitation(invitation, 'deny');
            }}
          >
            Deny
          </button>
        </div>
      </div>
    </div>
  );
};

const GameInvitation = ({ ws }: { ws: Socket }) => {
  const [gameInvitations, setGameInvitations] = useState<any[]>([]);

  const denyInvitation = (invitation: any, action: string) => {
    if (ws) {
      if (action === 'deny') ws.emit('denyInvitation', invitation);
      setGameInvitations((prev) =>
        prev.filter((invitation) => invitation.gameId !== invitation.gameId),
      );
    }
  };

  useEffect(() => {
    if (ws) {
      ws.on('gameInvite', (data) => {
        console.log('gameInvite', data);
        setGameInvitations((prev) => {
          if (prev.find((invitation) => invitation.user.id === data.user.id)) {
            return prev.map((invitation) => {
              if (invitation.user.id === data.user.id) {
                return data;
              }
              return invitation;
            });
          }
          return [...prev, data];
        });
      });
    }
    return () => {
      if (ws) {
        ws.off('gameInvite');
      }
    };
  }, [ws]);

  return (
    <div
      className="absolute right-[50%] top-[70px] 
      max-h-[calc(100vh-70px)] w-[70%] min-w-[300px] translate-x-[50%] overflow-y-auto p-2
      sm:right-6 sm:w-[500px] sm:translate-x-0"
    >
      <div className="flex h-full w-full flex-col gap-5">
        {gameInvitations.map((invitation, index) => (
          <InvitationPopup
            key={index}
            invitation={invitation}
            rmInvitation={denyInvitation}
          />
        ))}
      </div>
    </div>
  );
};

export default GameInvitation;
