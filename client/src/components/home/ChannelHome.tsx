import Image from 'next/image';

interface Channel {
  icon: string;
  name: string;
  memberCount: number;
}

function ChannelHome({ icon, name, memberCount }: Channel) {
  return (
    <div className="inline flex h-[90px] w-[125px] flex-col items-center rounded-[20px] bg-[#88d9ff99] p-2">
      <Image
        src={icon}
        alt="channel"
        width={40}
        height={40}
        className="h-[40px] w-[40px] rounded-full"
      />
      <div className="w-full truncate text-center text-[15px] font-semibold">
        {name}
      </div>
      <small className="text-[7px] text-gray-300">{memberCount} members</small>
    </div>
  );
}

export default ChannelHome;
