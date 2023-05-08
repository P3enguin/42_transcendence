import React from 'react';
import InviteFriendCard from './InviteFriendCard';

const OnlineFriends = ({ data }: { data: [] }) => {
  return (
    <div className="flex h-2/5 flex-col p-5 md:h-1/2">
      <h2 className="m-2 text-lg font-bold md:text-2xl">
        INVITE YOUR ONLINE FRIENDS TO PLAY:
      </h2>
      <div className="scrollbar flex flex-wrap justify-center overflow-y-auto">
        {data.map((user: any, index: number) => (
          <InviteFriendCard key={index} user={user} />
        ))}
      </div>
    </div>
  );
};

export default OnlineFriends;
