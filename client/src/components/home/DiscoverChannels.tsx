import Image from 'next/image';
import ChannelHome from './ChannelHome';

function DiscoverChannels() {
  return (
    <div className="mt-[55px] w-[90%] rounded-[20px] border border-white">
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
        <li className="p-2">
          <ChannelHome
            icon="/game.png"
            name="#Ponginators"
            memberCount={1337}
            channelLink="/chat/id"
          />
        </li>
        <li className="p-2">
          <ChannelHome
            icon="/game.png"
            name="#Ponginators"
            memberCount={1337}
            channelLink="/chat/id"
          />
        </li>
        <li className="p-2">
          <ChannelHome
            icon="/game.png"
            name="#Ponginators"
            memberCount={1337}
            channelLink="/chat/id"
          />
        </li>
        <li className="p-2">
          <ChannelHome
            icon="/game.png"
            name="#Ponginators"
            memberCount={1337}
            channelLink="/chat/id"
          />
        </li>
        <li className="p-2">
          <ChannelHome
            icon="/game.png"
            name="#Ponginators"
            memberCount={1337}
            channelLink="/chat/id"
          />
        </li>
        <li className="p-2">
          <ChannelHome
            icon="/game.png"
            name="#Ponginators"
            memberCount={1337}
            channelLink="/chat/id"
          />
        </li>
        <li className="p-2">
          <ChannelHome
            icon="/game.png"
            name="#Ponginators"
            memberCount={1337}
            channelLink="/chat/id"
          />
        </li>
        <li className="p-2">
          <ChannelHome
            icon="/game.png"
            name="#Ponginators"
            memberCount={1337}
            channelLink="/chat/id"
          />
        </li>
        <li className="p-2">
          <ChannelHome
            icon="/game.png"
            name="#Ponginators"
            memberCount={1337}
            channelLink="/chat/id"
          />
        </li>
        <li className="p-2">
          <ChannelHome
            icon="/game.png"
            name="#Ponginators"
            memberCount={1337}
            channelLink="/chat/id"
          />
        </li>
      </ul>
    </div>
  );
}

export default DiscoverChannels;
