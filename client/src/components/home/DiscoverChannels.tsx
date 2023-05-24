import Image from 'next/image';
import ChannelHome from './ChannelHome';
import { Channels } from '@/interfaces/Channels';

export default function DiscoverChannels({
  channels,
}: {
  channels: Channels[];
}) {
  return (
    <div className="w-[90%] rounded-[20px] border border-white md:w-[640px] xl:w-[90%] 2xl:w-[1323px]">
      <div className="flex items-center pl-4 pt-4">
        <Image
          className="h-[24px] w-[24px]"
          src="/discoverChannels.svg"
          alt="discoverChannels"
          width={24}
          height={24}
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
          <li key={channel.channelId} className="p-2">
            <ChannelHome
              avatar={
                process.env.NEXT_PUBLIC_BE_CONTAINER_HOST +
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
