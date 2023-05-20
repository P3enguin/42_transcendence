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

let socket: any;
interface Message {
  sender: string;
  senderAvatar: string;
  time: string;
  message: string;
}

function Conversation({ player, jwt_token, id, setNew }: any) {
  const [showTopic, setShowTopic] = useState(true);

  const [messages, setMessages] = useState<Message[]>([]);

  const [channel, setChannel] = useState<{
    avatar: string;
    name: string;
    topic: string;
  }>();
  const [message, setMessage] = useState('');

  const clientsMap = new Map();

  async function getRoomData(id: any) {
    try {
      const response = await axios.get(
        process.env.NEXT_PUBLIC_BACKEND_HOST + `/chat/channels/${id}`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${jwt_token}` },
        },
      );
      const channel = response.data;
      console.log(channel);
      setChannel(channel);

      // Do something with the channel data, such as updating state
    } catch (error) {
      console.error(error);
    }
  }
  const sendMessage = (message: string) => {
    if (socket) {
      console.log('Sending message');
      socket.emit('sendMessage', { message: message, id });
    }
  };

  useEffect(() => {
    // setChannel(NULL);
    getRoomData(id);

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
  if (!channel) {
    return <div className="self-center">Loading...</div>;
  }
  const picture =
    process.env.NEXT_PUBLIC_BACKEND_HOST + '/channels/' + channel.avatar;
  return (
    <div className="relative h-full w-full">
      <div className="absolute h-full w-full">
        <MessageWrapper
          socket={socket}
          id={id}
          player={player}
          setNew={setNew} />
      </div>
      <div
        className="absolute h-14 w-full rounded-tl-2xl rounded-tr-2xl border-b
          bg-[#283775] bg-opacity-20 backdrop-blur-[9px] tx:rounded-tl-none"
      >
        <ChannelHeader />
      </div>
    </div>
  );
}

export default Conversation;
