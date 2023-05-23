import Router from 'next/router';
import Image from 'next/image';
import StatusBubble from '../game/StatusBubble';
import { Channel, Member } from '@/interfaces/Channel';
import { useState } from 'react';
import Link from 'next/link';

export default function ChannelMember({
  channel,
  nickname,
  member,
  memberSettings,
  toggleMemberSettings,
}: {
  channel: Channel;
  nickname: string;
  member: Member;
  memberSettings: string;
  toggleMemberSettings: (memberSettings: string) => void;
}) {
  const { owner, admins, members } = channel;

  let interval: NodeJS.Timeout;

  const redirect = (route: string) => {
    clearInterval(interval);
    interval = setTimeout(() => Router.push(route), 200);
  };

  return (
    <div className="ml-auto flex h-[60px] w-[95%] items-center gap-3 rounded-2xl bg-[#8BD9FF4D] px-2 transition duration-300 ease-in hover:bg-[#8BD9FF66]">
      <StatusBubble
        avatar={member.avatar}
        imageClassName="w-[48px] h-[48px]"
        onClick={(e) => {
          return redirect('/users/' + member.nickname);
        }}
      />
      <p className="truncate text-[12px] font-semibold">@{member.nickname}</p>
      {nickname !== member.nickname && (
        <>
          <button
            className="ml-auto"
            onClick={() => {
              if (memberSettings === member.nickname) toggleMemberSettings('');
              else toggleMemberSettings(member.nickname);
            }}
          >
            <Image
              className="h-[20px] w-[20px]"
              src="/dots.svg"
              alt="dots"
              width={20}
              height={20}
            />
          </button>
          {memberSettings === member.nickname && (
            <ul
              className="absolute right-0 flex w-24 translate-x-[-50%] translate-y-[50%] flex-col gap-0.5 rounded-xl bg-[#283775] p-2 backdrop-blur-[10px]"
              onMouseDown={(e) => e.stopPropagation()}
            >
              {(owner?.nickname === nickname ||
                (member.nickname !== owner?.nickname &&
                  !admins?.includes(member))) && (
                <>
                  <li className="rounded-md p-0.5 text-center text-[12px] font-semibold hover:bg-[#8BD9FF4D]">
                    <button
                      className="w-full"
                      onMouseUp={() => toggleMemberSettings('')}
                    >
                      Mute
                    </button>
                  </li>
                  <li className="rounded-md p-0.5 text-center text-[12px] font-semibold hover:bg-[#8BD9FF4D]">
                    <button
                      className="w-full"
                      onMouseUp={() => toggleMemberSettings('')}
                    >
                      Kick
                    </button>
                  </li>
                  <li className="rounded-md p-0.5 text-center text-[12px] font-semibold hover:bg-[#8BD9FF4D]">
                    <button
                      className="w-full"
                      onMouseUp={() => toggleMemberSettings('')}
                    >
                      Ban
                    </button>
                  </li>

                  <div className="my-0.5 h-0 w-full rounded-sm border-[0.01rem] bg-[#CFCFCF]"></div>
                </>
              )}

              <li className="rounded-md p-0.5 text-center text-[12px] font-semibold hover:bg-[#8BD9FF4D]">
                <Link
                  onMouseUp={() => toggleMemberSettings('')}
                  href={'/users/' + member.nickname}
                >
                  View Profile
                </Link>
              </li>
              <li className="rounded-md p-0.5 text-center text-[12px] font-semibold text-red-500 hover:bg-red-500 hover:text-white">
                <button
                  className="w-full"
                  onMouseUp={() => toggleMemberSettings('')}
                >
                  Block User
                </button>
              </li>
            </ul>
          )}
        </>
      )}
    </div>
  );
}
