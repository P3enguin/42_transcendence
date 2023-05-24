import React from 'react';
import Image from 'next/image';

export interface StatusBubbleProps {
  avatar: string;
  status?: string;
  className?: string;
  imageClassName?: string;
  isChannel?: boolean;
  onClick?: (e: any) => Promise<void> | void;
}

const StatusBubble = ({
  avatar,
  status,
  className,
  imageClassName,
  isChannel,
  onClick,
}: StatusBubbleProps) => {
  const avatarLink =
    process.env.NEXT_PUBLIC_BE_CONTAINER_HOST +
    (isChannel ? '/channels/' : '/avatars/') +
    avatar;
  return (
    <div
      className={
        className
          ? className + ' relative rounded-full'
          : 'relative rounded-full'
      }
    >
      <Image
        src={avatarLink}
        alt="Avatar"
        width={200}
        height={200}
        className={`${
          imageClassName ? imageClassName : 'h-[60px] w-[60px]'
        } rounded-full border-2 border-[#0097E2] border-opacity-40
        object-cover transition duration-300 ease-in hover:border-opacity-100`}
        onClick={onClick}
      />
      {status && (
        <div
          className={`absolute right-[5%] top-[10%] h-[10px] w-[10px] rounded-full ${
            status === 'ONLINE'
              ? 'bg-[#01FD91]'
              : status === 'AWAY'
              ? 'bg-[#FFA500]'
              : status === 'IN_GAME'
              ? 'bg-[#C969F6]'
              : 'bg-[#B4B4B4]'
          }`}
        ></div>
      )}
    </div>
  );
};

export default StatusBubble;
