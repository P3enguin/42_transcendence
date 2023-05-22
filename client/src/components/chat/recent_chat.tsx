import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/router';
import Image from 'next/image';
import RecentConversation from './RecentConversation';

function RecentChat({ avatar, player, friendId, newmsgs }: any) {
  const router = useRouter();

  const [RecentChat, setRecentChat] = useState([]);
  const [loading, setLoading] = useState(true);

  async function getRecent() {
    await axios
      .get(process.env.NEXT_PUBLIC_BACKEND_HOST + '/chat/allChat?page={1}', {
        withCredentials: true,
      })
      .then((response) => {
        let conversation = response.data.data.rooms;
        conversation = conversation.sort((convA: any, convB: any) => {
          if (convA.messages[0] && convB.messages[0]) {
            const sendAtA = new Date(convA.messages[0].sendAt).getTime();
            const sendAtB = new Date(convB.messages[0].sendAt).getTime();
            return sendAtB - sendAtA;
          } else if (convA.messages[0] && !convB.messages[0])
              return -1
            else if (!convA.messages[0] && convB.messages[0])
              return 1;
            else
              return 0;
        });

        setRecentChat(conversation);
        setLoading(false);
        console.log('=>', RecentChat);
      })
      .catch((err) => console.log(err));
  }

  async function talk(channelId: string) {
    if (channelId) router.push('/chat/' + channelId);
  }

  useEffect(() => {
    getRecent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newmsgs]);

  return (
    <>
      {loading ? (
        <p>Loading...</p>
      ) : (
        RecentChat.map((chat: any, index: number) => (
          <div
            className="item-start relative mt-1
          flex h-[70px]  w-full cursor-pointer flex-row self-center rounded-2xl
          border bg-[#53bd9c] bg-opacity-20 text-sm shadow-xl tx:max-w-[350px]"
            onClick={(e) => {
              if (chat) talk(chat.channelId);
              else console.log('empty');
            }}
            key={index}
          >
            <RecentConversation room={chat} />
          </div>
        ))
      )}
    </>
  );
}

export default RecentChat;
