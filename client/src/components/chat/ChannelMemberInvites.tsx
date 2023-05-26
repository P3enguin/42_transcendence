import Router from 'next/router';
import StatusBubble from '../game/StatusBubble';
import { Channel, Member } from '@/interfaces/Channel';

export default function ChannelMemberInvites({
  channel,
  member,
  toggleMemberSettings,
}: {
  channel: Channel;
  member: Member;
  toggleMemberSettings: (memberSettings: string) => void;
}) {
  let interval: NodeJS.Timeout;

  const redirect = (route: string) => {
    clearInterval(interval);
    interval = setTimeout(() => Router.push(route), 200);
  };

  async function removeInvite() {
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_HOST + '/chat/ban',
        {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            channelId: channel.channelId,
            memberNickname: member.nickname,
          }),
          credentials: 'include',
        },
      );
      if (response.ok) {
        toggleMemberSettings('');
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <li className="ml-auto flex h-16 w-[95%] items-center gap-3 rounded-2xl bg-[#a29e9f4d] px-3 transition duration-300 ease-in hover:bg-[#a29e9f66]">
      <StatusBubble
        avatar={member.avatar}
        className="cursor-pointer"
        imageClassName="w-14 h-14"
        onClick={(e) => {
          return redirect('/users/' + member.nickname);
        }}
      />
      <p className="truncate text-[12px] font-semibold">@{member.nickname}</p>
      <button
        className="ml-auto flex h-[20px] w-[20px] items-center justify-center rounded-full bg-[#a29e9f4d] hover:bg-[#a29e9f66]"
        onClick={removeInvite}
      >
        <div className="absolute h-[0.1rem] w-[2%] rotate-45 transform rounded-sm bg-[#a29e9f]"></div>
        <div className="absolute h-[0.1rem] w-[2%] -rotate-45 transform rounded-sm bg-[#a29e9f]"></div>
      </button>
    </li>
  );
}
