import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { Channel } from '@/interfaces/Channel';
import { Socket } from 'socket.io-client';
import { ClimbingBoxLoader } from 'react-spinners';
import StatusBubble from '../game/StatusBubble';
import { Status } from './OnlineNow';

export interface ChannelHeaderProps {
  channel: Channel;
  ws: Socket;
  wsConnected: boolean;
  onClick: () => void;
}

const ChannelHeader = ({
  channel,
  ws,
  onClick,
  wsConnected,
}: ChannelHeaderProps) => {
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (channel.isChannel) {
      setStatus('');
      return;
    }
    if (ws && wsConnected) {
      console.log('here',channel);
      
      ws.emit('getUserStatus', { name: channel.topic.substring(1) }, (data: any) => {
        setStatus(data);
      });

      ws.on('statusChange', (data: Status) => {
        if (data.nickname === channel.topic.substring(1)) {
          setStatus(data.status);
        }
      });
    }
    return () => {
      if (ws) {
        ws.off('statusChange');
      }
    };
  }, [ws, channel, wsConnected]);

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
          className="ml-auto h-[20px] w-[20px]"
          src="/dots.svg"
          alt="dots"
          width={20}
          height={20}
        />
      </button>
    </div>
  );
};

export default ChannelHeader;
