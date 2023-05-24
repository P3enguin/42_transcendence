import { Channel, Member } from '@/interfaces/Channel';
import ChannelMember from './ChannelMember';

export default function ChannelCategory({
  channel,
  nickname,
  category,
  members,
  memberSettings,
  toggleMemberSettings,
}: {
  channel: Channel;
  nickname: string;
  category: string;
  members: Member[];
  memberSettings: string;
  toggleMemberSettings: (memberSettings: string) => void;
}) {
  return (
    <>
      {members.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="mb-1 flex items-center gap-2">
            <div className="text-[12px] font-semibold capitalize text-[#CFCFCF]">
              {category + (category == 'owner' ? '' : 's')}:
            </div>
            <div className="h-0 w-full rounded-sm border-[0.01rem] bg-[#CFCFCF]"></div>
          </div>
          {members.map((member) => (
            <div key={member.nickname}>
              <ChannelMember
                channel={channel}
                nickname={nickname}
                member={member}
                memberSettings={memberSettings}
                toggleMemberSettings={toggleMemberSettings}
              />
            </div>
          ))}
        </div>
      )}
    </>
  );
}
