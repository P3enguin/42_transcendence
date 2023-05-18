import Image from 'next/image';
import ChannelHome from './ChannelHome';
import { Channels } from '@/interfaces/Channels';

export default function DiscoverChannels({
  channels,
}: {
  channels: Channels[];
}) {
  return (
    <div className="w-[90%] rounded-[20px] border border-white 2xl:w-[1495px]">
      <div className="flex pl-4 pt-4">
        <Image
          src="/discoverChannels.svg"
          alt="discoverChannels"
          width={20}
          height={20}
        />
        <h1 className="pl-2 text-xl font-bold uppercase">Discover Channels:</h1>
      </div>
      <ul className="scrollbar mx-2 mb-2 flex overflow-x-auto whitespace-nowrap px-9 py-4">
        {channels.length == 0 && (
          <div className="flex h-[90px] w-full items-center justify-center">
            <p>No channels</p>
          </div>
        )}
        {channels.map((channel) => (
          <li key={channel.name} className="p-2">
            <ChannelHome
              avatar={
                process.env.NEXT_PUBLIC_BACKEND_HOST +
                '/channels/' +
                channel.avatar
              }
              name={channel.name}
              memberCount={channel.memberCount}
              channelLink={`/chat/${channel.channelId}`}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
