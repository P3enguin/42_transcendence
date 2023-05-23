import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { SendIcon, OptionIcon } from '../icons/Icons';
import axios from 'axios';
import Message from './Message';
import { verifyToken } from '../VerifyToken';
import Image from 'next/image';
import MessageLabel from './MessageLabel';
import MessageWrapper from './MessageWrapper';
import ChannelHeader from './ChannelHeader';
import ChannelOptions from './ChannelOptions';
import { Channel } from '@/interfaces/Channel';
import Router from 'next/router';
import { InputDefault } from '../Input/Inputs';

let socket: any;

interface Message {
  sender: string;
  senderAvatar: string;
  time: string;
  message: string;
}

function Conversation({ player, jwt_token, id, setNew }: any) {
  const [showTopic, setShowTopic] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [memberSettings, setMemberSettings] = useState('');

  const [messages, setMessages] = useState<Message[]>([]);

  const [channel, setChannel] = useState<Channel | null | undefined>(null);
  const [isChannel, setIsChannel] = useState(false);

  const [message, setMessage] = useState('');

  const clientsMap = new Map();

  async function getChannel(id: any) {
    try {
      // Find Channel
      const response = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_HOST + `/chat/channels/${id}`,
        {
          credentials: 'include',
        },
      );

      const channelData = await response.json();
      const channelStatus = response.status;

      if (channelStatus === 200) {
        setChannel(channelData);
        setIsChannel(true);
        return;
      }

      // Find DM
      const response2 = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_HOST + `/chat/dms/${id}`,
        {
          credentials: 'include',
        },
      );

      const dmData = await response2.json();
      const dmStatus = response.status;

      if (dmStatus === 200) {
        setChannel(dmData);
        setIsChannel(false);
        return;
      }

      setChannel(undefined);

      // Do something with the channel data, such as updating state
    } catch (error) {
      console.error(error);
    }
  }

  async function joinChannel(e: React.FormEvent) {
    e.preventDefault();
    const details: {
      [key: string]: string;
    } = {};

    details.channelId = id;
    if (channel && channel.privacy === 'private') {
      details.key = (
        document.getElementById('channelKey') as HTMLInputElement
      ).value;
    }

    const res = await fetch(
      process.env.NEXT_PUBLIC_BACKEND_HOST + '/chat/join',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(details),
        credentials: 'include',
      },
    );

    if (res.status == 200) {
      getChannel(id);
    }
  }

  const sendMessage = (message: string) => {
    if (socket) {
      console.log('Sending message');
      socket.emit('sendMessage', { message: message, id });
    }
  };

  useEffect(() => {
    setShowSettings(false);
    setMemberSettings('');

    getChannel(id);

    socket = io(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/chat`, {
      auth: {
        token: jwt_token,
      },
    });

    socket.on('connected', () => {
      console.log(
        player.nickname,
        ' : connected to the socket with : ',
        socket.id,
      );
      clientsMap.set(socket.id, player.nickname);
      socket.emit('joinChat', { id });

      socket.on('disconnect', () => {
        console.log(player.nickname, ' : disconnected');
        clientsMap.delete(socket.id);
      });

      socket.on('message', (messageInfo: any) => {
        const message: Message = {
          sender: messageInfo.sender,
          senderAvatar: messageInfo.senderAvatar,
          time: messageInfo.time,
          message: messageInfo.message,
        };
        console.log('sender :', message.sender, 'receiver :', player.nickname);
        setMessages((prevMessages) => [message, ...prevMessages]);
        handelReceivedMessage(message);
      });
    });

    const handelReceivedMessage = (message: any) => {};

    return () => {
      socket.disconnect();
    };
  }, [id]);

  if (channel === null) {
    return (
      <div className="flex h-full w-full items-center justify-center text-center">
        Loading ...
      </div>
    );
  }

  if (channel === undefined) {
    return (
      <div className="flex h-full w-full items-center justify-center text-center">
        404 Channel Not Found
      </div>
    );
  }

  if (isChannel && channel && !channel.members) {
    return (
      <form
        onSubmit={(e) => joinChannel(e)}
        className="mx-auto flex h-full w-[75%] flex-col items-center justify-center gap-3"
      >
        <Image
          src={
            process.env.NEXT_PUBLIC_BACKEND_HOST + '/channels/' + channel.avatar
          }
          alt={channel.name}
          width={124}
          height={124}
          className="h-[124px] w-[124px] rounded-full"
        />
        <p className="w-full truncate text-center text-3xl font-semibold">
          {channel.name}
        </p>
        {channel.topic && channel.topic.length && (
          <p className="text-lg text-center text-gray-300">{channel.topic}</p>
        )}
        <p className="mb-5 text-center text-sm text-gray-300">
          {channel.membersCount} member
          {channel.membersCount && channel.membersCount > 1 ? 's' : ''}
        </p>
        {channel.privacy === 'private' && (
          <InputDefault
            className="group relative z-0 mx-auto mb-2 w-64"
            name="channelKey"
            type="password"
            id="channelKey"
            description="Channel key"
          />
        )}
        <button
          name="joinChannel"
          type="submit"
          className="hover:text-s mx-auto mt-1 transform rounded-full bg-[#0097E2] px-9 py-2 text-[10px] font-bold uppercase text-white shadow transition duration-300 hover:scale-[115%] hover:bg-[#2C3B7C]"
        >
          Join Channel
        </button>
      </form>
    );
  }

  const picture =
    process.env.NEXT_PUBLIC_BACKEND_HOST + '/channels/' + channel.avatar;

  return (
    <div className="relative h-full w-full overflow-hidden">
      <div className="absolute h-full w-full">
        <MessageWrapper
          socket={socket}
          id={id}
          player={player}
          setNew={setNew}
        />
      </div>
      <div
        className="absolute h-14 w-full rounded-tl-2xl rounded-tr-2xl border-b
          bg-[#283775] bg-opacity-20 backdrop-blur-[9px] tx:rounded-tl-none"
        onClick={(e) => {
          setShowSettings(!showSettings);
          setMemberSettings('');
        }}
      >
        <ChannelHeader id={id} />
      </div>
      <ChannelOptions
        nickname={player.nickname}
        channel={channel}
        isVisible={showSettings}
        toggleVisible={setShowSettings}
        memberSettings={memberSettings}
        toggleMemberSettings={setMemberSettings}
      />
    </div>
  );
}

export default Conversation;
