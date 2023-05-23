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
import { Console, log } from 'console';
import axios from 'axios';

//use the chat :
function Chat({
  jwt_token,
  data,
  ws,
}: {
  jwt_token: string;
  data: any;
  ws: Socket;
}) {
  const [showRecentChat, setShowRecentChat] = useState(true);
  const [showMobile, setShowMobile] = useState(false);
  const [showStartNew, setShowStartNew] = useState(true);

  const handleRecentChatClick = () => {
    setShowRecentChat(true);
    setShowStartNew(false);
  };

  const handleStartNewClick = () => {
    console.log('change ', showMobile);

    setShowRecentChat(false);
    setShowStartNew(true);
  };

  useEffect(() => {
    const MobilView = () => {
      if (document.body.offsetWidth < 800) {
        if (!showMobile) {
          setShowMobile(true);
          setShowStartNew(false);
          setShowRecentChat(true);
        }
      } else {
        setShowMobile(false);
        setShowStartNew(true);
        setShowRecentChat(true);
      }
    };
    MobilView();
    window.addEventListener('resize', MobilView);
    return () => {
      window.removeEventListener('resize', MobilView);
    };
    // eslint-disable-next-line
  }, [showMobile]);

  return (
    <>
      <div className="m-5 flex h-[70%] min-h-[680px] w-[80%] max-w-[1500px] flex-row rounded-2xl border  border-neutral-300 sm:m-20 ">
        {showRecentChat && (
          <div className="h-[100%] w-[100%] flex-col tx:border-r lg:max-w-[400px]">
            <div className="flex h-[5%] w-[100%] items-center border-b pl-5 ">
              <Link href={`/chat`} className="p-1 text-2xl ">
                Chat Room{' '}
              </Link>
            </div>
            {showRecentChat && <OnlineNow nickname={data.nickname} ws={ws} />}

            <div className="flex h-[80%] flex-col p-1 sm:p-5 sm:pt-0">
              <div className="flex flex-row justify-between  pt-1">
                <div
                  className="cursor-pointer text-green-300"
                  onClick={handleRecentChatClick}
                >
                  Recent Chat
                </div>
                <div
                  className="cursor-pointer text-green-300 tx:hidden"
                  onClick={handleStartNewClick}
                >
                  Start New
                </div>
              </div>
              <div className="mt-2 h-full flex-col space-y-3 overflow-hidden overflow-y-auto scrollbar-hide">
                {showRecentChat && (
                  <RecentChat avatar={data.avatar} player={data.nickname} />
                )}
              </div>
            </div>
          </div>
        )}
        {showStartNew && (
          <div className=" w-full flex-col justify-between md:flex">
            {!showRecentChat && (
              <div className="flex flex-row justify-between border pt-1">
                <div
                  className="cursor-pointer text-green-300"
                  onClick={handleRecentChatClick}
                >
                  Recent Chat
                </div>
              </div>
            )}
            <div className="flex h-[5%] w-full items-center border-b "></div>
            {<StartNew nickname={data.nickname} token={jwt_token} />}
          </div>
        )}
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
