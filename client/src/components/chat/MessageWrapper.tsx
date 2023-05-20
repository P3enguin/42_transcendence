import React, { useEffect, useState } from 'react';
import MessageLabel from './MessageLabel';
import Message from './Message';

export interface Message {
  sender: string;
  senderAvatar: string;
  time: string;
  message: string;
}

const MessageWrapper = ({ player, socket, id, setNew}: any) => {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (socket) {
      socket.on('message', (messageInfo: any) => {
        const message: Message = {
          sender: messageInfo.sender,
          senderAvatar: messageInfo.senderAvatar,
          time: messageInfo.time,
          message: messageInfo.message,
        };
        console.log('sender :', message.sender, 'receiver :', player.nickname);
        setMessages((prevMessages) => [message, ...prevMessages]);
        setNew()
        // handelReceivedMessage(message);
      });
    }
  }, [socket]);

  return (
    <div className="flex h-full w-full flex-col items-center ">
      <div
        className="flex h-full w-full flex-col-reverse overflow-y-auto
      px-14 pb-5 scrollbar-hide"
      >
        {messages.map((msg: any, key: number) => {
          let side = false;
          if (msg.sender === player.nickname) side = true;
          return <Message message={msg} side={side} key={key} />;
        })}
        <div className="h-14 w-full self-end"></div>
      </div>
      <MessageLabel socket={socket} id={id} />
    </div>
  );
};

export default MessageWrapper;
