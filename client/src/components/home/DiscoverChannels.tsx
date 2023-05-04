import Image from 'next/image';
import ChannelHome from './ChannelHome';

interface Rooms {
  channelId: number;
  name: string;
  Topic: string;
  memberLimit: number;
  memberCount: number;
  stats: string;
  avatar: string;
}

export default function DiscoverChannels({ rooms }: { rooms: Rooms[] }) {
  return (
    <div className="w-[90%] rounded-[20px] border border-white">
      <div className="flex pl-4 pt-4">
        <Image
          src="discoverChannels.svg"
          alt="discoverChannels"
          width={20}
          height={20}
        />
        <h1 className="pl-2 text-xl font-bold uppercase">Discover Channels:</h1>
      </div>
      <ul className="flex overflow-x-auto whitespace-nowrap py-4 px-9">
        {rooms.length == 0 && (
          <div className="flex h-[90px] w-full items-center justify-center">
            <p>No channels</p>
          </div>
        )}
        {rooms.map((room) => (
          <li key={room.name} className="p-2">
            <ChannelHome
              icon={'/' + room.avatar}
              name={room.name}
              memberCount={room.memberCount}
              channelLink={`/chat/${room.channelId}`}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
