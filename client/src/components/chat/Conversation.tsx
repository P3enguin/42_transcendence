import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { SendIcon, SettingIcon } from '../icons/Icons';
import axios from 'axios';
import Message from './Message';
import { verifyToken } from '../VerifyToken';

let socket: any;
interface Message {
  sender: string;
  senderAvatar: string;
  time: string;
  message: string;
}


function Conversation({ nickname, jwt_token, id }: any) {
 
useEffect(()=>{
  
  console.log("from conv : ",nickname);
},[nickname])


  const [showTopic, setShowTopic] = useState(true);

  const [messages, setMessages] = useState<Message[]>([]);

  const [channel, setChannel] = useState(null);
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
    getRoomData(id);

    socket = io(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/chat`, {
      auth: {
        token: jwt_token,
      },
    });
    socket.on('connected', () => {
      console.log(nickname, ' : connected to the socket with : ', socket.id);
      clientsMap.set(socket.id, nickname);
      socket.emit('joinChat', { id });

      socket.on('disconnect', () => {
        console.log(nickname, ' : disconnected');
        clientsMap.delete(socket.id);
      });

      socket.on('message', (messageInfo: any) => {
        const message: Message = {
          sender: messageInfo.sender,
          senderAvatar: messageInfo.senderAvatar,
          time: messageInfo.time,
          message: messageInfo.message,
        };
        console.log("sender :",message.sender, "receiver :",nickname);
        setMessages(prevMessages => [message, ...prevMessages]);
        handelReceivedMessage(message);
      });
    });

    const handelReceivedMessage = (message: any) => {};
    return () => {
      socket.disconnect();
    };
  }, []);
  if (!channel) {
    return <div className="self-center">Loading...</div>;
  }
  const picture =
    process.env.NEXT_PUBLIC_BACKEND_HOST + '/channels/' + channel.avatar;
  return (
    <div className="flex h-full w-full flex-col justify-between ">
      <div className="flex h-[8%] w-full items-center justify-between p-2 sm:border-b">
        <div className="mt-3 flex w-full flex-row items-center justify-between px-3 py-2 sm:mt-0">
          <div className="flex w-full flex-row border-b border-red-500 pb-2 pt-2 md:border">
            <div className="min-w[300px] text-lg ml-2 flex flex-row justify-between">
              <img
                className="rounded-full border"
                src={picture}
                alt="avatar"
                width={45}
                height={45}
              />
              <div className="ml-4 flex flex-col items-center">
                <h3 className=" text-sx font-bold text-red-500">
                  {channel.name}
                </h3>
                <h4 className="flex text-ss md:text-sm">{channel.topic}</h4>
              </div>
            </div>
          </div>

          <div>
            <button className="p-1">
              <SettingIcon />
            </button>
          </div>
        </div>
      </div>
      <div
        className="flex h-[95%] w-[100%] flex-col
            items-center"
            >
        {/* from-them */}
        <div className="h-[90%] w-full flex flex-col-reverse border border-blue-600 overflow-hidden overflow-y-auto scrollbar-hide">
          {messages.map((msg: any, key: number) => {
            let side = "from-them"
            if (msg.sender ===  nickname)
              side = "from-me";
              return <Message message={msg} side="from-me" key={key} />; 
            })}
        </div>
        <div className="relative mb-2 w-[90%]  flex-col items-center border sm:flex">
        <input
            type="text"
            name="nickname"
            id="nickname"
            className="text-xs peer block w-[70%] w-full appearance-none overflow-hidden rounded-full border-2 border-white bg-transparent px-3 py-2.5 text-white focus:border-blue-600 focus:outline-none focus:ring-0 sm:text-sm"
            placeholder="Message . . ."
            required
            value={message}
            onChange={(e) => {
                e.preventDefault();
                setMessage(e.target.value)
              }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && message != '') {
                e.preventDefault();
                sendMessage(message);
                setMessage("");
              }
            }}
          />

          <button
            type="submit"
            className="absolute right-[10px] top-[50%] m-auto translate-y-[-50%] rounded-full"
            onClick={(e) => {
              e.preventDefault();
              if (message != '') {
              sendMessage(message);
              setMessage("");
              }
            }}
          >
            <SendIcon />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Conversation;
