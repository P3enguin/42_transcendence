import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/router';
import Image from 'next/image';
import RecentConversation from './RecentConversation';

function RecentChat({ avatar, player, friendId }: any) {
  const router = useRouter();

  const [RecentChat, setRecentChat] = useState([]);

  async function getRecent() {

    await axios
    .get(process.env.NEXT_PUBLIC_BACKEND_HOST + '/chat/allChat', {
      withCredentials: true,
    })
    .then((response) => {
      const conversation = response.data.data.rooms;
      setRecentChat(conversation);
      console.log(conversation);
      
    })
    .catch((err) => console.log(err));
  }


  async function talk() {
    console.log('resent chat');

    // const res = await axios.get(
    //   process.env.NEXT_PUBLIC_BACKEND_HOST + '/chat/privateMessages',
    //   {
    //     params: {
      //       friendId: 2,
    //     },
    //   },
    // );
    // router.push('/chat/' + res.data.id);
  }

  useEffect( ()=> {
    getRecent();
  }, [])

  const picture = process.env.NEXT_PUBLIC_BACKEND_HOST + '/avatars/' + avatar;
  
  return (
    <>
      {
        RecentChat.map((chat: any, key: number)=> {
        <div
          className="item-start 
          flex h-[70px] w-[100%] cursor-pointer 
              flex-row rounded-2xl border bg-[#8BD9FF] bg-opacity-20
              text-sm shadow-xl tx:max-w-[350px]"
              onClick={(e) => {
                talk();
              }}
        >
          <RecentConversation room={chat} key={key} />
        </div>
        })
      }
    </>
  );
}

export default RecentChat;
