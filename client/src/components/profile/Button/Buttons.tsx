import {
  CancelIcon,
  AddFriendIcon,
  IsFriendIcon,
} from '@/components/icons/Icons';
import { Dispatch, SetStateAction } from 'react';
import Router from 'next/router';

interface ButtonProps {
  nickname: string;
  blockedByFriend?: boolean;
  blockedByPlayer?: boolean;
  isFriend: boolean | undefined;
  requestFriend?: {
    status: string | undefined;
    id: string | undefined;
  };
  setRequest?: Dispatch<
    SetStateAction<{
      status: string | undefined;
      id: string | undefined;
    }>
  >;
  setreply: Dispatch<SetStateAction<string>>;
  setSuccess: Dispatch<SetStateAction<boolean>>;
  setError: Dispatch<SetStateAction<boolean>>;
}

function AddFriend({
  nickname,
  isFriend,
  blockedByPlayer,
  blockedByFriend,
  requestFriend,
  setRequest,
  setreply,
  setSuccess,
  setError,
}: ButtonProps) {
  async function SendFriendRequest(event: React.MouseEvent) {
    event.preventDefault();
    const response = await fetch(
      process.env.NEXT_PUBLIC_BACKEND_HOST + '/players/addRequest',
      {
        method: 'POST',
        body: JSON.stringify({ receiver: nickname }),
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      },
    );
    if (response.ok) {
      const result = await response.json();
      const updatedValue = { status: 'pending', id: result.requestId };
      setRequest?.(updatedValue);
      setreply('Friend Request Sent !');
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
      return;
    } else {
      setreply('Failed to send Friend Request');
      setError(true);
      Router.reload();
      setTimeout(() => {
        setError(false);
      }, 3000);
    }
  }

  async function CancelFriendRequest(event: React.MouseEvent) {
    event.preventDefault();
    const response = await fetch(
      process.env.NEXT_PUBLIC_BACKEND_HOST + '/players/cancelRequest',
      {
        method: 'POST',
        body: JSON.stringify({ requestId: requestFriend?.id }),
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      },
    );
    if (response.ok) {
      const updatedValue = { status: undefined, id: undefined };
      setRequest?.(updatedValue);
      setreply('Request has been cancelled!');
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
      return;
    } else {
      setreply('Failed to cancel  Friend Request');
      setError(true);
      Router.reload();
      setTimeout(() => {
        setError(false);
      }, 3000);
    }
  }

  async function UnblockPlayer(event: React.MouseEvent) {
    event.preventDefault();
    const response = await fetch(
      process.env.NEXT_PUBLIC_BACKEND_HOST + '/players/unblock',
      {
        method: 'POST',
        body: JSON.stringify({ nickname: nickname }),
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      },
    );
    if (response.ok) {
      blockedByPlayer = false;
      Router.reload();
      setreply('unblocked !');
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
      return;
    } else {
      setreply('Failed to unblock');
      setError(true);
      Router.reload();
      setTimeout(() => {
        setError(false);
      }, 3000);
    }
  }
  return (
    <>
      {blockedByPlayer ? (
        <>
          <button
            onClick={UnblockPlayer}
            type="button"
            className=" left-20 flex  items-center rounded-lg bg-red-700
            px-2  py-1 text-[13px] font-medium text-white hover:bg-red-600 focus:outline-none"
          >
            unblock Player <CancelIcon />
          </button>
        </>
      ) : blockedByFriend ? (
        <>
          <div
            className=" text-xs left-20  flex items-center rounded-lg
            bg-red-500  px-2 py-1 font-medium text-white "
          >
            you are blocked
          </div>
        </>
      ) : requestFriend?.status === 'pending' ? (
        <>
          <button
            onClick={CancelFriendRequest}
            type="button"
            className=" left-20 flex  items-center rounded-lg bg-red-700
            px-2  py-1 text-[11.7px] font-medium text-white hover:bg-red-600 focus:outline-none"
          >
            Cancel Request <CancelIcon />
          </button>
        </>
      ) : isFriend ? (
        <>
          <div
            className=" text-xs left-20  flex items-center rounded-lg
            bg-[#39ce77]  px-2 py-1 font-medium text-white "
          >
            Friend <IsFriendIcon />
          </div>
        </>
      ) : (
        <button
          onClick={SendFriendRequest}
          type="button"
          className=" text-xs  left-20 flex gap-1 rounded-lg
        bg-[#102272]  px-2 py-1 
        font-medium text-white hover:bg-[#0e1949] focus:outline-none"
        >
          Add friend <AddFriendIcon />
        </button>
      )}
    </>
  );
}

export default AddFriend;
