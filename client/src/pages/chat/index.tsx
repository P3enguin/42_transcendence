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
import { log } from 'console';

//use the chat :
function Chat({ jwt_token, data }: { jwt_token: string; data: any }) {


  const [showRecentChat, setShowRecentChat] = useState(true);
  const [showStartNew, setShowStartNew] = useState(true);
  const [showMobile, setShowMobile] = useState(false);

  const handleRecentChatClick = () => {
    setShowRecentChat(true);
    setShowStartNew(false);
  };

  const handleStartNewClick = () => {
    setShowRecentChat(false);
    setShowStartNew(true);
  };


  useEffect(() => {
    
    const MobilView = () =>{
      console.log('show mobile==>', showMobile);
      console.log('show StartNew==>', showStartNew);
      console.log('show RecentChat==>', showRecentChat);
      console.log('////////////////////////////////////////////////////////');
      
      if  (document.body.offsetWidth < 800) {
        setShowMobile(true);
        setShowStartNew(false);
        setShowRecentChat(true);
      }
      else
      {
        setShowMobile(false);
        setShowStartNew(true);
        setShowRecentChat(true);
      }
    }
    MobilView();
    window.addEventListener('resize', MobilView) 
    return (()=>{
      window.removeEventListener('resize', MobilView);
    })
  }, []);

  return (
    <>
      <div className="flex h-[70%] w-[80%] min-h-[600px] m-5 sm:m-20 flex-row rounded-2xl border  border-neutral-300 max-w-[1500px] ">
      {showRecentChat &&  (<div className="h-[100%] w-[100%] flex-col tx:border-r tx:max-w-[400px]">
          <div className="flex h-[5%] items-center border-b pl-5 w-[100%] ">
            <Link href={`/chat`}>Chat Room </Link>
          </div>
          {
            showRecentChat && <OnlineNow player={data.nickname} />
          }

          <div className="flex h-[80%] flex-col p-1 sm:p-5 sm:pt-0">
            <div className="flex flex-row justify-between  pt-1">
            <div className="cursor-pointer text-green-300" onClick={handleRecentChatClick}>Recent Chat</div>
            <div className="md:hidden cursor-pointer text-green-300" onClick={handleStartNewClick}>Start New</div>
            </div>
            <div className="flex-col h-full overflow-hidden overflow-y-auto space-y-3 mt-2 scrollbar-hide">
            {showRecentChat && <RecentChat avatar={data.avatar} player={data.nickname} /> }
            </div>
          </div>
        </div>)}
        {showStartNew && (<div className=" md:flex w-full justify-between flex-col">
         {(!showStartNew && <div className="flex flex-row justify-between  pt-1">
            <div className="cursor-pointer text-green-300" onClick={handleRecentChatClick}>Recent Chat</div>
            <div className="md:hidden cursor-pointer text-green-300" onClick={handleStartNewClick}>Start New</div>
            </div>)}
          <div className="flex h-[5%] w-full items-center border-b "></div>
          { <StartNew nickname={data.nickname}  token={jwt_token}/>}
        </div>)}
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
