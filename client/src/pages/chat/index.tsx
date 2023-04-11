/* eslint-disable @next/next/no-img-element */
import Layout from '@/components/layout/layout';
import { verifyToken } from '@/components/VerifyToken';
import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { useState } from 'react';
import Link from 'next/link';

import StartNew from '@/components/chat/startNew';
import OnlineNow from '@/components/chat/OnlineNow';
import RecentChat from '@/components/chat/recent_chat';

let socket: Socket;
//use the chat :
function Chat({ jwt_token, data }: { jwt_token: string; data: any }) {

  const [pictures, changePictures] = useState({ pfp: '', wp: '' });
  const [isLoading, setLoading] = useState(true);

  const [showRecentChat, setShowRecentChat] = useState(true);
  const [showStartNew, setShowStartNew] = useState(false);

  const handleRecentChatClick = () => {
    setShowRecentChat(true);
    setShowStartNew(false);
  };

  const handleStartNewClick = () => {
    setShowRecentChat(false);
    setShowStartNew(true);
  };

  useEffect(() => {
    const clientsMap = new Map();

    socket = io(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/chat`, {
      auth: {
        token: jwt_token,
      },
    });
    socket.on('connect', () => {
      console.log(data.nickname," : connected to the socket")
      clientsMap.set(socket.id, data.nickname);
    });

    socket.on('disconnect', () =>{
      console.log(data.nickname," : disconnected");
      clientsMap.delete(socket.id);
    });
    
    socket.on('message', (message: any) => {
      console.log(`Received message from ${message.username}: ${message.message}`);
    });
    const handelReceivedMesage = (message: string) => {
      const nickname = data.nickname;
      console.log(`Sending message from ${nickname}: ${message}`);
      socket.emit('message', {nickname, message});
    };

    return () => socket.disconnect()

  }, []);

  return (
    <>
      <div className="flex w-[80%] h-[600px] md:h-[800px] mt-10 flex-row rounded-2xl border border-neutral-300 max-w-[1200px] ">
      <div className="h-[100%] w-[100%] md:w-[360px] flex-col  md:border-r">
          <div className="flex h-[5%] items-center border-b pl-5 w-[100%]">
            <Link href={`/chat`}>Chat Room </Link>
          </div>
          {
            showRecentChat && <OnlineNow player={data.friends} />
          }

          <div className="flex h-[80%] flex-col p-1 sm:p-5 sm:pt-0">
            <div className="flex flex-row justify-between border-t pt-1">
            <div className="cursor-pointer text-green-300" onClick={handleRecentChatClick}>Recent Chat</div>
            <div className="md:hidden cursor-pointer text-green-300" onClick={handleStartNewClick}>Start New</div>
            </div>
            <div className="flex-col h-full overflow-hidden overflow-y-auto space-y-3 mt-2 scrollbar-hide">
            {showRecentChat && <RecentChat avatar={data.avatar} player={data.nickname} /> }
            {showStartNew && <StartNew data={data} />}
            </div>
          </div>
        </div>
        <div className="hidden md:flex w-full justify-between flex-col ">
          <div className="flex h-[5%] w-full items-center border-b "></div>
          { <StartNew />}
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
        const data = await res.json();
        console.log("player: ",data);
        
        return {
          props: {
            data,
            jwt_token: jwt_token,
          },
        };
      } catch (error: any) {
        console.error(error.message);
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
