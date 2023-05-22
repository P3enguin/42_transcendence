import { Member } from '@/interfaces/Channel';
import ChannelMember from './ChannelMember';

export default function ChannelCategory({
  category,
  members,
  memberSettings,
  toggleMemberSettings,
}: {
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
            <div className="text-[12px] font-semibold text-[#CFCFCF]">
              {category}:
            </div>
            <div className="h-0 w-full rounded-sm border-[0.01rem] bg-[#CFCFCF]"></div>
          </div>
          {members.map((member) => (
            <div key={member.nickname}>
              <ChannelMember
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
