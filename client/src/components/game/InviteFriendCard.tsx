import React from 'react';
import StatusBubble from './StatusBubble';

interface inviteFriendsProps {
  friend: {
    nickname: string;
    avatar: string;
    id: number;
    status: string;
  };
  inviteFriend: (friend: any) => void;
}

const InviteFriendCard = ({ friend, inviteFriend }: inviteFriendsProps) => {
  return (
    <div className="m-3 flex flex-col  items-center rounded-2xl bg-[#8BD9FF] bg-opacity-30 px-5 py-3 sm:px-8 md:mb-10">
      <StatusBubble avatar={friend.avatar} status={friend.status} />
      <h3 className="my-1">{friend.nickname}</h3>
      <button
        className="rounded-lg bg-[#0097E2]"
        onClick={(e) => {
          e.preventDefault();
          inviteFriend(friend);
        }}
      >
        <h3 className="p-1">play with</h3>
      </button>
    </div>
  );
};

export default InviteFriendCard;
