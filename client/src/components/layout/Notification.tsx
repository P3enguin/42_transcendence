import { useState, useEffect } from 'react';
import Link from 'next/link';
import React from 'react';
import Router from 'next/router';
import Image from 'next/image';
interface NotifInterface {
  nickname: string;
  image: string;
  requestId: string;
  requests: Array<object>;
  senderId?: number;
  channelName?: string;
  channelId?: string;
  handleUpdateRequestStatus?: (requestId: string) => void;
  handleUpdateInvite?: (channelId: string) => void;
}

interface request {
  fromPlayer?: {
    nickname: string;
    avatar: string;
  };
  id: string;
  receivedAt: string;
  toPlayerId: number;
  type: string;
  fromPlayerId: number;

  status: string;
  toPlayer?: {
    nickname: string;
    avatar: string;
  };
}

function NotiJoinChannel({
  channelId,
  channelName,
  nickname,
  handleUpdateInvite,
}: any) {
  
  async function rejectRequest(e: React.MouseEvent) {
    e.preventDefault();
    const data = {
      channelId: channelId,
      playerNickname: nickname,
    };
    const updateURL: string =
      process.env.NEXT_PUBLIC_BACKEND_HOST + '/chat/cancelInvite';

    try {
      const response = await fetch(updateURL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include',
      });
      if (response.ok) {
        handleUpdateInvite?.(channelId!);
        console.log('rejected!');
      } else if (response.status == 400) {
        const result = await response.json();
        console.log('didnt reject');
      }
    } catch (error) {
      console.log('An error has occurred');
    }
  }
  return (
    <div className="-mx-2 flex items-center border-b px-4 py-3">
      <div className="w-4/5 text-sm ">
        <span>You are invited you to join </span>
        <span className="font-bold ">{channelName} </span>
      </div>
      <div className="font-bold">
        <button
          onClick={() => Router.push('/chat/' + channelId)}
          className="mr-2 text-blue-600 hover:text-blue-300"
        >
          Accept
        </button>
        <button
          onClick={rejectRequest}
          className="text-red-500 hover:text-red-700"
        >
          Decline
        </button>
      </div>
    </div>
  );
}

function NotiAddFriend({
  nickname,
  senderId,
  image,
  requestId,
  handleUpdateRequestStatus,
}: NotifInterface) {
  async function acceptRequest(e: React.MouseEvent) {
    e.preventDefault();
    const data = {
      senderId: senderId,
      requestId: requestId,
    };
    const updateURL: string =
      process.env.NEXT_PUBLIC_BACKEND_HOST + '/players/AcceptRequest';
    try {
      const response = await fetch(updateURL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include',
      });
      if (response.ok) {
        handleUpdateRequestStatus?.(requestId);
        console.log('accepted!');
        // setreply('Password Changed !');
        // setSuccess(true);
        // setTimeout(() => {
        //   setSuccess(false);
        // }, 3000);
      } else if (response.status == 400) {
        const result = await response.json();
        Router.reload();
        console.log('didnt accept');
        // const err = await response.json();
        // setreply('An Error has Occurred!');
        // setError(true);
        // setTimeout(() => {
        //   setError(false);
        // }, 3000);
      }
    } catch (error) {
      console.log('An Error has occurred');
    }
  }

  async function rejectRequest(e: React.MouseEvent) {
    e.preventDefault();
    const data = {
      senderId: senderId,
      requestId: requestId,
    };
    const updateURL: string =
      process.env.NEXT_PUBLIC_BACKEND_HOST + '/players/RejectRequest';

    try {
      const response = await fetch(updateURL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include',
      });
      if (response.ok) {
        handleUpdateRequestStatus?.(requestId);
        console.log('rejected!');
      } else if (response.status == 400) {
        const result = await response.json();
        console.log('didnt reject');
      }
    } catch (error) {
      console.log('An error has occurred');
    }
  }

  return (
    <div className="-mx-2 flex items-center border-b px-4 py-3">
      <Link href={'/users/' + nickname} className="w-1/5">
        <Image
          width={200}
          height={200}
          className="h-12 w-12 rounded-full border-2 border-[#0097E2] border-opacity-40 object-cover transition
          duration-300 ease-in hover:border-opacity-100 sm:h-[48px] sm:w-[48px]"
          src={image}
          alt="user image"
        />
      </Link>
      <div className="w-4/5 text-sm ">
        <div>
          <span className="font-bold ">{nickname} </span>
          <span>wants to be your friend</span>
        </div>
        <div className="font-bold">
          <button
            onClick={acceptRequest}
            className="mr-2 text-blue-600 hover:text-blue-300"
          >
            Accept
          </button>
          <button
            onClick={rejectRequest}
            className="text-red-500 hover:text-red-700"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}

function NotiAccepted({ nickname, image }: NotifInterface) {
  return (
    <div className="-mx-2 flex items-center border-b px-4 py-3">
      <Link href={'/users/' + nickname} className="w-1/5">
        <Image
          width={200}
          height={200}
          className="h-12 w-12 rounded-full border-2 border-[#0097E2] border-opacity-40 object-cover shadow-sm
          transition duration-300 ease-in hover:border-opacity-100 sm:h-[48px] sm:w-[48px]"
          src={image}
          alt="user image"
        />
      </Link>
      <div className="w-4/5 text-sm ">
        <div>
          <span className="font-bold ">{nickname} </span>
          <span>
            <strong className="text-blue-400">accepted</strong> your friend
            request!
          </span>
        </div>
      </div>
    </div>
  );
}

function NotiRejected({
  nickname,
  image,
  requestId,
  senderId,
}: NotifInterface) {
  return (
    <div className="-mx-2 flex items-center border-b px-4 py-3">
      <Link href={'/users/' + nickname} className="w-1/5">
        <Image
          width={200}
          height={200}
          className="h-12 w-12 rounded-full border-2 border-[#0097E2] border-opacity-40 object-cover transition
          duration-300 ease-in hover:border-opacity-100 sm:h-[48px] sm:w-[48px]"
          src={image}
          alt="user image"
        />
      </Link>
      <div className="w-4/5 text-sm">
        <div>
          <span className="font-bold ">{nickname} </span>
          <span>
            <strong className="text-red-500">rejected</strong> your friend
            request!
          </span>
        </div>
      </div>
    </div>
  );
}

function NotiDrop() {
  const [requests, setRequests] = useState<request[]>([]);
  const [invitation, setInvite] = useState([]);
  const [Nick, setNickName] = useState('');
  function handleUpdateRequestsTo(requestId: string) {
    setRequests((current) =>
      current.filter((request: request) => request.id != requestId),
    );
  }
  function handleUpdateInvite(channelId: string) {
    setInvite((current) =>
      current.filter((invite: any) => invite.channelId != channelId),
    );
  }

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const resp = await fetch(
          process.env.NEXT_PUBLIC_BACKEND_HOST + '/players/requests',
          {
            credentials: 'include',
          },
        );
        if (resp.ok) {
          const result = await resp.json();
          setRequests(result.requests);
        }
      } catch (error) {
        console.log('An error has occurred');
      }
    };
    const fetchInvite = async () => {
      try {
        const resp = await fetch(
          process.env.NEXT_PUBLIC_BACKEND_HOST + '/chat/invitations',
          {
            credentials: 'include',
          },
        );
        if (resp.ok) {
          const result = await resp.json();
          console.log('res', result);
          setInvite(result.invitations);
          setNickName(result.nickname);
        }
      } catch (error) {
        console.log('An error has occurred');
      }
    };

    fetchRequests();
    fetchInvite();
  }, []);

  console.log('hi', invitation);
  return (
    <div
      x-show="dropdownOpen"
      className="absolute right-12 top-[56px] z-50 mt-2 h-[400px] w-[21rem] overflow-hidden 
                  overflow-x-hidden rounded-md bg-[#283775] shadow-lg"
    >
      {!requests ? (
        <div className="text-lg  "> You have no requests</div>
      ) : (
        <div className="py-2">
          {requests.map((request: request, i: number) => {
            return request.type === 'to' && request.status === 'pending' ? (
              <NotiAddFriend
                key={request.id}
                requestId={request.id}
                requests={requests}
                handleUpdateRequestStatus={handleUpdateRequestsTo}
                nickname={request.fromPlayer!.nickname}
                image={
                  process.env.NEXT_PUBLIC_BE_CONTAINER_HOST +
                  '/avatars/' +
                  request.fromPlayer!.avatar
                }
                senderId={request.fromPlayerId}
              />
            ) : request.type === 'from' && request.status === 'accepted' ? (
              <NotiAccepted
                key={request.id}
                requestId={request.id}
                requests={requests}
                nickname={request.toPlayer!.nickname}
                image={
                  process.env.NEXT_PUBLIC_BE_CONTAINER_HOST +
                  '/avatars/' +
                  request.toPlayer!.avatar
                }
              />
            ) : request.type === 'from' && request.status === 'rejected' ? (
              <NotiRejected
                key={request.id}
                requestId={request.id}
                requests={requests}
                nickname={request.toPlayer!.nickname}
                image={
                  process.env.NEXT_PUBLIC_BE_CONTAINER_HOST +
                  '/avatars/' +
                  request.toPlayer!.avatar
                }
              />
            ) : (
              <div key={i}></div>
            );
          })}
          <>
            {invitation.map((invite: any, i: number) => (
              <NotiJoinChannel
                key={invite.channel.channelId}
                handleUpdateInvite={handleUpdateInvite}
                channelId={invite.channel.channelId}
                channelName={invite.channel.name}
                nickname={Nick}
              />
            ))}
          </>
        </div>
      )}
    </div>
  );
}

export { NotiAddFriend, NotiAccepted, NotiDrop, NotiJoinChannel };
