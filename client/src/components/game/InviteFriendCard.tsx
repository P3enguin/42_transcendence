import Image from 'next/image';
import React from 'react';

interface invteFriendsProps {
  user: {
    nickname: string;
    avatar: string;
    id: number;
  };
  inviteFriend: (user:any) => void;
}

const InviteFriendCard = ({ user, inviteFriend }: invteFriendsProps) => {
  return (
    <div className="sm:px-8 m-3 flex  flex-col items-center rounded-2xl bg-[#8BD9FF] bg-opacity-30 px-5 py-3 sm:mb-10">
      <Image
        src={`${process.env.NEXT_PUBLIC_BACKEND_HOST}/avatars/${user.avatar}`}
        alt="Avatar"
        width={50}
        height={50}
        className="h-[50px] w-[50px] rounded-full"
      />
      <h3 className="my-1">{user.nickname}</h3>
      <button
        className="rounded-lg bg-[#0097E2]"
        onClick={(e) => {
          e.preventDefault();
          inviteFriend(user);
        }}
      >
        <h3 className="p-1">play with</h3>
      </button>
    </div>
  );
};

export default InviteFriendCard;
