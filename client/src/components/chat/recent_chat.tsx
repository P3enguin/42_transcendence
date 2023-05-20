import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/router';
import Image from 'next/image';
import RecentConversation from './RecentConversation';

function RecentChat({hasChanged, setHasChanged}:any) {
  const router = useRouter();

  const [RecentChat, setRecentChat] = useState([]);
  const [loading, setLoading] = useState(true);
  async function getRecent() {
    await axios
    .get(process.env.NEXT_PUBLIC_BACKEND_HOST + '/chat/allChat?page={1}', 
    {
      withCredentials: true,
    })
    .then((response) => {
      const conversation = response.data.data.rooms;

        conversation.sort((roomA: any, roomB: any) => {
        const latestMessageTimeA = roomA.messages[0];
        const latestMessageTimeB = roomB.messages[0];
        if (latestMessageTimeA && !latestMessageTimeB) {
          return -1;
        } else if (!latestMessageTimeA && latestMessageTimeB) {
          return 1;
        }else if (!latestMessageTimeB && !latestMessageTimeA) {
          return 0;
        }
        console.log('comparing times');
        
        const TimeA = roomA.messages[0].sendAt;
        const TimeB = roomB.messages[0].sendAt;
          return -(TimeB - TimeA);
      });
     
      setRecentChat(conversation);
      setLoading(false);
      console.log("=>",RecentChat);
    })
    .catch((err) => console.log(err));
  }

  async function talk(channelId: string) {
    if (channelId)
      router.push('/chat/' + channelId);
  }

  useEffect( ()=> {
    getRecent();
    console.log("hasChanged : ",hasChanged);
    
    if (hasChanged)
      setHasChanged(false);
  }, [hasChanged])

  return (
    <>
      {
        loading ? (
          <p>Loading...</p>
        ) : 
        (
          RecentChat.map((chat: any, index: number) =>
          <div
          className="item-start relative self-center
          flex h-[70px] w-[100%] cursor-pointer 
          flex-row rounded-2xl border bg-[#53bd9c] bg-opacity-20
          text-sm shadow-xl tx:max-w-[350px] mt-1"
          onClick={(e) => {
            if (chat)
              talk(chat.channelId);
            else
              console.log('empty');
          }}
          key={index}
          >

          <RecentConversation room={chat} />
        </div>
        ))
      }
    </>
  );
}

export default RecentChat;
