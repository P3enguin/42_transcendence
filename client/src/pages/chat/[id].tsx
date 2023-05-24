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
import Link from 'next/link';
import { Console } from 'console';

//use the chat :
function Chat({
  jwt_token,
  data,
  id,
  ws,
}: {
  jwt_token: string;
  data: any;
  id: string;
  ws: Socket;
}) {
  
  const [showRecentChat, setShowRecentChat] = useState(true);
  const [showMobile, setShowMobile] = useState(false);
  const [showConversation, setShowConversation] = useState(true);
  const [newMessages, setNewMessages] = useState<boolean>(true);

  const handleRecentChatClick = () => {
    setShowRecentChat(true);
    setShowConversation(false);
  };

  const handleStartNewClick = () => {
    console.log('change ', showMobile);

    setShowRecentChat(false);
    setShowConversation(true);
  };

  const changeToNewmessages = () => {
    setNewMessages((prev) => !prev);
  };

  useEffect(() => {
    const MobilView = () => {
      if (document.body.offsetWidth < 800) {
        if (!showMobile) {
          setShowMobile(true);
          setShowConversation(true);
          setShowRecentChat(false);
        }
      } else {
        setShowMobile(false);
        setShowConversation(true);
        setShowRecentChat(true);
      }
    };
    MobilView();
    window.addEventListener('resize', MobilView);
    return () => {
      window.removeEventListener('resize', MobilView);
    };
  }, [showMobile]);
  return (
    <>
      <div className="m-5 flex h-[70%] min-h-[600px] w-[80%] max-w-[1500px] flex-row rounded-2xl border  border-neutral-300 sm:m-20 ">
        {showRecentChat && (
          <div className="h-[100%] w-[100%] flex-col tx:border-r lg:max-w-[400px] ">
            <h1 className="flex h-14 w-[100%] items-center border-b pl-5 text-3xl font-light">
              <Link href={`/chat`}>Chat Room </Link>
            </h1>
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
                  className="cursor-pointer text-green-300 md:hidden"
                  onClick={handleStartNewClick}
                >
                  Start New
                </div>
              </div>
              <div className="mt-2 h-full flex-col overflow-hidden overflow-y-auto scrollbar-hide">
                {showRecentChat && (
                  <RecentChat
                    avatar={data.avatar}
                    player={data.nickname}
                    newmsgs={newMessages}
                  />
                )}
              </div>
            </div>
          </div>
        )}
        {showConversation && (
          <div className="flex w-full flex-col justify-between">
            {/* <div className="flex h-[5%] w-full items-center border-b "></div> */}
            {
              <Conversation
                player={data}
                jwt_token={jwt_token}
                id={id}
                ws={ws}
                setNew={changeToNewmessages}
              />
            }
          </div>
        )}
      </div>
    </>
  );
}
export async function getServerSideProps({ req, params }: any) {
  const jwt_token: string = req.cookies['jwt_token'];

  console.log('this is params', params.id);

  const id = params.id;

  if (jwt_token) {
    const res = await verifyToken(req.headers.cookie);
    if (res.ok) {
      try {
        console.log('here');
        const data = await res.json();
        console.log('data  ', { data });
        return {
          props: {
            data,
            jwt_token: jwt_token,
            id,
          },
        };
      } catch (error: any) {
        console.error(error.message);
        return {
          props: {
            data: [],
            jwt_token: jwt_token,
            id,
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
