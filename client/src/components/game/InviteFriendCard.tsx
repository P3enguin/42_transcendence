import React from 'react';

const InviteFriendCard = ({ user }: any) => {
  return (
    <div className="m-3 mb-10 flex w-[170px] flex-col items-center rounded-2xl bg-[#8BD9FF] bg-opacity-30 p-5">
      <img className="h-12 w-12 rounded-full" src={user.avatar} alt="Avatar" />
      <h3>{user.nickname}</h3>
      <button className="rounded-lg bg-[#0097E2]">
        <h3 className="p-1">play with</h3>
      </button>
    </div>
  );
};

export default InviteFriendCard;
