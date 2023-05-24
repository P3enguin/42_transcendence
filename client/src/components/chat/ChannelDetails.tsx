import { Channel } from '@/interfaces/Channel';
import ChannelCategory from './ChannelCategory';
import Router from 'next/router';
import StatusBubble from '../game/StatusBubble';

export default function ChannelDetails({
  nickname,
  channel,
  isVisible,
  showDetails,
  showSettings,
  memberSettings,
  toggleMemberSettings,
}: {
  nickname: string;
  channel: Channel;
  isVisible: boolean;
  showDetails: (isVisible: boolean) => void;
  showSettings: (toggle: boolean) => void;
  memberSettings: string;
  toggleMemberSettings: (memberSettings: string) => void;
}) {
  let { owner, admins, members } = channel;

  admins = admins?.filter((admin) => admin.nickname !== owner?.nickname);
  members = members?.filter(
    (member) =>
      member.nickname !== owner?.nickname && !admins?.includes(member),
  );

  async function leaveChannel(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch(
      process.env.NEXT_PUBLIC_BACKEND_HOST + '/chat/leave/' + channel.channelId,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      },
    );

    if (res.status == 204) {
      Router.push(`/chat`);
    }
  }

  return (
    <div
      className={`absolute right-0 top-0 transition duration-500 ${
        !isVisible ? 'translate-x-[100%]' : ''
      } h-full w-[456px] rounded-[20px] bg-[#283775d1] backdrop-blur-[10px]`}
      onMouseDown={() => toggleMemberSettings('')}
    >
      <button
        className="absolute left-6 top-6 flex h-[20px] w-[20px] items-center justify-center rounded-full bg-[#8BD9FF4D] hover:bg-[#8BD9FF66]"
        onClick={() => {
          showDetails(false);
          toggleMemberSettings('');
        }}
      >
        <div className="absolute h-[0.1rem] w-[45%] rotate-45 transform rounded-sm bg-[#8BD9FF]"></div>
        <div className="absolute h-[0.1rem] w-[45%] -rotate-45 transform rounded-sm bg-[#8BD9FF]"></div>
      </button>
      <div className="absolute right-5 top-5 flex flex-col gap-2">
        <button
          className="flex h-6 w-28 items-center justify-center rounded-md bg-[#0097E2E6] hover:bg-[#0097E2] active:shadow-[inset_0px_4px_4px_rgba(0,0,0,0.35)]"
          onClick={() => {
            showSettings(true);
          }}
        >
          <p className="fond-bold text-[10px] uppercase">Channel Settings</p>
        </button>
        <button
          className="flex h-6 w-28 items-center justify-center rounded-md bg-[#FF0D3EA8] hover:bg-[#FF0D3EBF] active:shadow-[inset_0px_4px_4px_rgba(0,0,0,0.35)]"
          onClick={leaveChannel}
        >
          <p className="fond-bold text-[10px] uppercase">Leave Channel</p>
        </button>
      </div>
      <div className="mt-10 flex w-full flex-col items-center justify-center gap-1">
        <StatusBubble
          avatar={channel.avatar}
          className="mb-2"
          imageClassName="h-20 w-20"
          isChannel={channel.isChannel}
        />
        <p className="text-base font-semibold">#{channel.name}</p>
        <p className="text-[12px] font-semibold text-[#B4B4B4]">
          {channel.topic}
        </p>
        <p className="text-[12px] font-semibold text-[#B4B4B4]">
          {channel.members?.length} member
          {channel.members && channel.members.length > 1 ? 's' : ''}
        </p>
      </div>
      <ul className="scrollbar absolute bottom-0 right-[50%] mb-2 flex h-[calc(100%-230px)] w-[90%] translate-x-[50%] flex-col gap-2 overflow-y-auto px-6">
        <li>
          <ChannelCategory
            channel={channel}
            nickname={nickname}
            category="owner"
            members={owner ? [owner] : []}
            memberSettings={memberSettings}
            toggleMemberSettings={toggleMemberSettings}
          />
        </li>
        <li>
          <ChannelCategory
            channel={channel}
            nickname={nickname}
            category="admin"
            members={admins ?? []}
            memberSettings={memberSettings}
            toggleMemberSettings={toggleMemberSettings}
          />
        </li>
        <li>
          <ChannelCategory
            channel={channel}
            nickname={nickname}
            category="member"
            members={members ?? []}
            memberSettings={memberSettings}
            toggleMemberSettings={toggleMemberSettings}
          />
        </li>
      </ul>
    </div>
  );
}
