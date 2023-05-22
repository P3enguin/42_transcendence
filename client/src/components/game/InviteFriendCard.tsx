import React from 'react';
import StatusBubble from './StatusBubble';

interface invteFriendsProps {
  data: {
    friend: {
      nickname: string;
      avatar: string;
      id: number;
    };
    status: string;
  };
  inviteFriend: (data: any) => void;
}

const InviteFriendCard = ({ data, inviteFriend }: invteFriendsProps) => {
  return (
    <div className="m-3 flex flex-col  items-center rounded-2xl bg-[#8BD9FF] bg-opacity-30 px-5 py-3 sm:px-8 md:mb-10">
      <StatusBubble data={data} />
      <h3 className="my-1">{data.friend.nickname}</h3>
      <button
        className="rounded-lg bg-[#0097E2]"
        onClick={(e) => {
          e.preventDefault();
          inviteFriend(data.friend);
        }}
      >
        <h3 className="p-1">play with</h3>
      </button>
    </div>
  );
};

export default InviteFriendCard;
