/* eslint-disable @next/next/no-img-element */
import Layout from '@/components/layout/layout';
import { verifyToken } from '@/components/VerifyToken';
import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { useState } from 'react';
import axios from 'axios';


import Conversation from '@/components/chat/Conversation';
import OnlineNow from '@/components/chat/OnlineNow';
import RecentChat from '@/components/chat/recent_chat';

let socket: Socket;
//use the chat :
function Chat({ jwt_token, data }: { jwt_token: string; data: any }) {

  const [pictures, changePictures] = useState({ pfp: '', wp: '' });
  const [isLoading, setLoading] = useState(true);

  const [showRecentChat, setShowRecentChat] = useState(true);
  const [showConversation, setShowConversation] = useState(false);

  const handleRecentChatClick = () => {
    setShowRecentChat(true);
    setShowConversation(false);
  };

  const handleConversationClick = () => {
    setShowRecentChat(false);
    setShowConversation(true);
  };

  useEffect(() => {
    socket = io(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/chat`, {
      auth: {
        token: jwt_token,
      },
    });
    socket.on('connect', () => {
      socket.emit('message', { username: 'test', message: 'hello' });
    });
    return () => {
      socket.disconnect();
    };
    
  }, []);
  
  return (
    <>
      <div className="flex w-[80%] h-[600px] md:h-[800px] mt-10 flex-row rounded-2xl border border-neutral-300 max-w-[1200px] ">
      <div className="h-[100%] w-[100%] md:w-[360px] flex-col  md:border-r ">
          <div className="flex h-[8%] items-center sm:border-b pl-5 w-[100%]">
            Chat Room
          </div>

          {
            showRecentChat && <OnlineNow player={data.friends} />
          }
          <div className="flex h-[92%] sm:h-[95%] flex-col p-1 sm:p-5 sm:pt-0">
            <div className="flex flex-row justify-between border-t pt-1 h-[5%]">
              <div className="cursor-pointer text-green-300" onClick={handleRecentChatClick}>Recent Chat</div>
              <div className="md:hidden cursor-pointer text-green-300" onClick={handleConversationClick}>message</div>
            </div>
            <div className="flex-col h-full overflow-hidden overflow-y-auto space-y-3 mt-2 scrollbar-hide">
            {showRecentChat && <RecentChat avatar={data.avatar} player={data.nickname} /> }
            {showConversation && <Conversation player={data.nickname} avatar={data.avatar} />}
            </div>
          </div>
        </div>
        <div className="hidden md:flex w-full justify-between flex-col h-full">
          { <Conversation player={data.nickname} avatar={data.avatar} />}
        </div>
      </div>
    </>
  );
}
export async function getServerSideProps({ req }: any) {
  const jwt_token: string = req.cookies['jwt_token'];

  if (jwt_token) {
    const res = await verifyToken(req.headers.cookie);
    if (res.ok) {
      try {
        console.log("here")
        const data = await res.json();
        console.log("data  ", {data});
        return {
          props: {
            data,
            jwt_token: jwt_token,
          },
        };
      } catch (error: any) {
        console.error(error.message);
        return {
          props: {
            data: [],
            jwt_token: jwt_token,
          },
        };
      }
    }
  }
  return {
    redirect: {
      destination: '/',
      permanent: true,
    },
  };
}

Chat.getLayout = function getLayout(page: React.ReactNode) {
  return <Layout>{page}</Layout>;
};
export default Chat;
