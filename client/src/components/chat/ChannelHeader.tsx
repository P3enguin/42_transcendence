import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { Channel } from '@/interfaces/Channel';

const ChannelHeader = (id: any) => {
  const [channel, setChannel] = useState<Channel>();

  async function getRoomData(id: any) {
    try {
      const response = await axios.get(
        process.env.NEXT_PUBLIC_BACKEND_HOST + `/chat/channels/${id.id}`,
        {
          withCredentials: true,
        },
      );
      const channel = response.data;
      setChannel(channel);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getRoomData(id);
  }, []);
  if (!channel) {
    return <div className="self-center">Loading...</div>;
  }
  const picture =
    process.env.NEXT_PUBLIC_BACKEND_HOST + '/channels/' + channel.avatar;
  return (
    <div className="flex flex-row p-2">
      <Image
        className="h-[45px] w-[45px] rounded-full border"
        src={picture}
        width={60}
        height={60}
        alt="picture"
      />
      <div className="pl-5">
        <p className="text-green-600">{channel.name}</p>
        <p className="text-sm">{channel.topic}</p>
      </div>
    </div>
  );
};

export default ChannelHeader;
