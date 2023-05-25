import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { Channel } from '@/interfaces/Channel';
import { Socket } from 'socket.io-client';
import { ClimbingBoxLoader } from 'react-spinners';
import StatusBubble from '../game/StatusBubble';

export interface ChannelHeaderProps {
  channel: Channel;
  ws: Socket;
  onClick: () => void;
}

const ChannelHeader = ({ channel, ws, onClick }: ChannelHeaderProps) => {
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (channel.isChannel) {
      setStatus('');
      return;
    }
    if (ws) {
      ws.emit('getUserStatus', { name: channel.topic }, (data: any) => {
        console.log(data);
        setStatus(data);
      });
    }
    return () => {
      if (ws) {
        ws.off('statusChange');
      }
    };
  }, [ws, channel]);

  if (!channel) {
    return <div className="self-center">Loading...</div>;
  }

  return (
    <div className="flex h-full flex-row items-center gap-5 px-5">
      <StatusBubble
        avatar={channel.avatar}
        status={status}
        imageClassName="h-[48px] w-[48px]"
        isChannel={channel.isChannel}
      />
      <div className="">
        <button onClick={onClick} className="hover:underline">
          {channel.name}
        </button>
        <p className="text-sm text-gray-300">{channel.topic}</p>
      </div>
      <button className="ml-auto" onClick={onClick}>
        <Image
          className="ml-auto h-[26px] w-[26px]"
          src="/dots.svg"
          alt="dots"
          width={26}
          height={26}
        />
      </button>
    </div>
  );
};

export default ChannelHeader;
