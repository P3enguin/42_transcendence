import React, { useEffect, useState } from 'react';
import MessageLabel from './MessageLabel';
import Message from './Message';
import axios from 'axios';
export interface Message {
  sender: string;
  senderAvatar: string;
  time: string;
  message: string;
}

const MessageWrapper = ({ player, socket, id, setNew }: any) => {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const LoadOldMessages = async () => {
      try {
        const response = await axios.get(
          process.env.NEXT_PUBLIC_BACKEND_HOST + `/chat/msg/${id}`,
          {
            withCredentials: true,
          }
          );
          const messageData = response.data;

        // Transform the response data into Message objects
        const NewMessage = messageData.map((message: any) => ({
          sender: message.sender,
          senderAvatar: message.senderAvatar,
          time: message.time,
          message: message.message,
        }));
        console.log("messages : ",messages);
        
        // Append the new messages to the existing messages in state
        setMessages(() => []);
        setMessages((prevMessages) => [...prevMessages, ...NewMessage]);
      } catch (error) {
        console.error(error);
      }
    };

    LoadOldMessages();
  },[id]);

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
        setNew();
        // handelReceivedMessage(message);
      });
    }
    return () => {
      if (socket) {
        socket.off('message');
      }
    };
  }, [socket]);

  return (
    <div className="flex h-full w-full flex-col items-center ">
      <div
        className="flex h-full w-full flex-col-reverse overflow-y-auto
      px-14 pb-5 scrollbar-hide pt-14"
      >
        {messages.map((msg: any, key: number) => {
          let side = false;
          if (msg.sender === player.nickname) side = true;
          return <Message message={msg} side={side} key={key} />;
        })}
      </div>
      <MessageLabel socket={socket} id={id} />
    </div>
  );
};

export default MessageWrapper;
