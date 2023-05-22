import React from 'react';
import Image from 'next/image';

export interface StatusBubbleProps {
  data: {
    friend: {
      nickname: string;
      avatar: string;
      id: number;
    };
    status: string;
  };
  className?: string;
  onClick?: (e: any) => Promise<void>;
}

const StatusBubble = ({ data, className, onClick }: StatusBubbleProps) => {
  return (
    <div
      className={
        className
          ? className + ' relative rounded-full'
          : 'relative rounded-full'
      }
    >
      <Image
        src={`${process.env.NEXT_PUBLIC_BE_CONTAINER_HOST}/avatars/${data.friend.avatar}`}
        alt="Avatar"
        width={200}
        height={200}
        className="h-[60px] w-[60px] rounded-full border-2 border-[#0097E2] border-opacity-40
        object-cover transition duration-300 ease-in hover:border-opacity-100"
        onClick={onClick}
      />
      <div
        className={`absolute right-[5%] top-[10%] h-[10px] w-[10px] rounded-full ${
          data.status === 'ONLINE'
            ? 'bg-[#01FD91]'
            : data.status === 'AWAY'
            ? 'bg-[#FFA500]'
            : data.status === 'IN_GAME'
            ? 'bg-[#C969F6]'
            : 'bg-[#B4B4B4]'
        }`}
      ></div>
    </div>
  );
};

export default StatusBubble;
