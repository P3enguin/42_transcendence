import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Channel } from '@/interfaces/Channel';
import RecentConversation from './RecentConversation';

function RecentChat({ player, newmsgs, ws, wsConnected }: any) {
  const [isLoading, setLoading] = useState(true);
  const [RecentChat, setRecentChat] = useState<Channel[]>([]);

  async function getRecentChat() {
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_HOST + '/chat/recentChat?page=1',
        {
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        },
      );
      if (response.ok) {
        const data = await response.json();

        const conversation = data.sort((convA: Channel, convB: Channel) => {
          if (!convA.messages || !convB.messages) return 0;
          if (convA.messages[0] && convB.messages[0]) {
            const sentAtA = new Date(convA.messages[0].sentAt).getTime();
            const sentAtB = new Date(convB.messages[0].sentAt).getTime();
            return sentAtB - sentAtA;
          } else if (convA.messages[0] && !convB.messages[0]) return -1;
          else if (!convA.messages[0] && convB.messages[0]) return 1;
          else return 0;
        });

        setRecentChat(conversation);
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getRecentChat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newmsgs]);

  return (
    <>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {RecentChat.map((channel: Channel, index: number) => (
            <RecentConversation
              key={index}
              player={player}
              channel={channel}
              ws={ws}
              wsConnected={wsConnected}
            />
          ))}
        </ul>
      )}
    </>
  );
}

export default RecentChat;
