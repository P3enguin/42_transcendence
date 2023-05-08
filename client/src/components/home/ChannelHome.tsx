import Image from 'next/image';
import Link from 'next/link';

interface Channel {
  avatar: string;
  name: string;
  memberCount: number;
  channelLink: string;
}

export default function ChannelHome({
  avatar,
  name,
  memberCount,
  channelLink,
}: Channel) {
  return (
    <Link
      href={channelLink}
      className="inline flex h-[90px] w-[125px] flex-col items-center rounded-[20px] bg-[#88d9ff99] p-2"
    >
      <Image
        src={avatar}
        alt="channel"
        width={40}
        height={40}
        className="h-[40px] w-[40px] rounded-full"
      />
      <div className="w-full truncate text-center text-[15px] font-semibold">
        {name}
      </div>
      <small className="text-[7px] text-gray-300">
        {memberCount} member{memberCount > 1 ?? 's'}
      </small>
    </Link>
  );
}
