import Router from 'next/router';
import React, { useEffect, useState } from 'react';
import StatusBubble from '../game/StatusBubble';
import { Socket } from 'socket.io-client';
import { Channel, Member } from '@/interfaces/Channel';

function RecentConversation({
  player,
  channel,
  ws,
}: {
  player: Member;
  channel: Channel;
  ws: Socket;
}) {
  const [status, setStatus] = useState('');

  if (!channel.isChannel && channel.members) {
    const user = channel.members.filter(
      (member: Member) => member.nickname != player.nickname,
    )[0];
    channel.name = user.firstname + ' ' + user.lastname;
    channel.avatar = user.avatar;
  }

  useEffect(() => {
    if (channel.isChannel) {
      setStatus('');
      return;
    }

    if (ws) {
      ws.emit('getUserStatus', { name: channel.topic }, (data: any) => {
        console.log(data);
        setStatus(data);
      });
    }
    return () => {
      if (ws) {
        ws.off('statusChange');
      }
    };
  }, [ws, channel]);

  const date = channel.messages
    ? new Date(channel.messages[0].sentAt)
    : undefined;

  return (
    <li
      className="item-start relative flex h-16 w-full cursor-pointer items-center gap-3 rounded-xl bg-[#8BD9FF4D] bg-opacity-20 px-2 shadow-xl tx:max-w-[350px]"
      onClick={(e) => {
        Router.push('/chat/' + channel.channelId);
      }}
    >
      <StatusBubble
        avatar={channel.avatar}
        status={status}
        imageClassName="h-[59px] w-[59px]"
        isChannel={channel.isChannel}
      />
      <div className="flex max-w-[250px] flex-col">
        <p className="font-semibold">{channel.name}</p>
        <p className="truncate text-sm font-light">
          {channel.messages ? channel.messages[0].message : ''}
        </p>
      </div>
      {date && (
        <p className="mb-1 ml-auto mt-auto text-sm font-extralight">
          {`${(date as Date).getHours().toString().padStart(2, '0')}:${(
            date as Date
          )
            .getMinutes()
            .toString()
            .padStart(2, '0')}`}
        </p>
      )}
    </li>
  );
}

export default RecentConversation;
