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
  blocked,
}: {
  channel: Channel;
  nickname: string;
  member: Member;
  memberSettings: string;
  toggleMemberSettings: (memberSettings: string) => void;
  blocked: Member[];
}) {
  const [isBlocked, setBlocked] = useState(
    blocked.find((user) => user.nickname === nickname) ? true : false,
  );
  const [isMuted, setMuted] = useState(
    channel.mutes
      ? channel.mutes.find((user) => user.player.nickname === member.nickname)
        ? true
        : false
      : false,
  );
  const [isBanned, setBanned] = useState(
    channel.bans
      ? channel.bans.find((user) => user.player.nickname === member.nickname)
        ? true
        : false
      : false,
  );
  const [isAdmin, setAdmin] = useState(
    channel.admins && channel.admins
      ? channel.admins.find((admin) => admin.nickname === member.nickname)
        ? true
        : false
      : false,
  );

  const { owner, admins, members } = channel;

  let interval: NodeJS.Timeout;

  const redirect = (route: string) => {
    clearInterval(interval);
    interval = setTimeout(() => Router.push(route), 200);
  };

  async function openDMs(event: React.FormEvent) {
    event.preventDefault();

    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_HOST +
          `/chat/dm?nickname=${member.nickname}`,
        {
          credentials: 'include',
        },
      );

      if (response.ok) {
        const dmData = await response.json();
        Router.push(`/chat/${dmData.channelId}`);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function blockUser(block: boolean) {
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_HOST + '/players/' + (block
          ? ''
          : 'un') + 'block',
        {
          method: block ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nickname: member.nickname }),
          credentials: 'include',
        },
      );
      if (response.ok) {
        setBlocked(true);
        toggleMemberSettings('');
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function muteMember(mute: boolean) {
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_HOST + '/chat/mute',
        {
          method: mute ? 'POST' : 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            channelId: channel.channelId,
            memberNickname: member.nickname,
            duration: 3600000,
          }),
          credentials: 'include',
        },
      );
      if (response.ok) {
        setMuted(mute);
        toggleMemberSettings('');
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function kickMember() {
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_HOST + '/chat/members/',
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

  async function banMember(ban: boolean) {
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_HOST + '/chat/ban',
        {
          method: ban ? 'POST' : 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            channelId: channel.channelId,
            memberNickname: member.nickname,
          }),
          credentials: 'include',
        },
      );
      if (response.ok) {
        setBanned(ban);
        toggleMemberSettings('');
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function promoteMember(admin: boolean) {
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_HOST +
          '/chat/promote/' +
          channel.channelId +
          '?nickname=' +
          member.nickname,
        {
          method: admin ? 'POST' : 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        },
      );
      if (response.ok) {
        setAdmin(admin);
        toggleMemberSettings('');
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="ml-auto flex h-16 w-[95%] items-center gap-3 rounded-2xl bg-[#8BD9FF4D] px-3 transition duration-300 ease-in hover:bg-[#8BD9FF66]">
      <StatusBubble
        avatar={member.avatar}
        className="cursor-pointer"
        imageClassName="w-14 h-14"
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
              <li
                className="cursor-pointer rounded-md p-0.5 text-center text-[12px] font-semibold hover:bg-[#8BD9FF4D]"
                onClick={() => toggleMemberSettings('')}
              >
                <Link
                  className="inline-block w-full"
                  href={'/users/' + member.nickname}
                >
                  Profile
                </Link>
              </li>
              <li
                className="cursor-pointer rounded-md p-0.5 text-center text-[12px] font-semibold hover:bg-[#8BD9FF4D]"
                onClick={(e) => {
                  toggleMemberSettings('');
                  openDMs(e);
                }}
              >
                Message
              </li>
              {isBlocked ? (
                <li
                  className="cursor-pointer rounded-md p-0.5 text-center text-[12px] font-semibold text-red-500 hover:bg-red-500 hover:text-white"
                  onClick={() => blockUser(false)}
                >
                  Unblock
                </li>
              ) : (
                <li
                  className="cursor-pointer rounded-md p-0.5 text-center text-[12px] font-semibold text-red-500 hover:bg-red-500 hover:text-white"
                  onClick={() => blockUser(true)}
                >
                  Block
                </li>
              )}

              {member.nickname !== owner?.nickname &&
                ((owner && owner.nickname === nickname) ||
                  (admins &&
                    admins.find((admin) => admin.nickname === nickname))) && (
                  <>
                    <div className="my-0.5 h-0 w-full rounded-sm border-[0.01rem] bg-[#CFCFCF]"></div>

                    {isMuted ? (
                      <li
                        className="cursor-pointer rounded-md p-0.5 text-center text-[12px] font-semibold text-red-500 hover:bg-red-500 hover:text-white"
                        onClick={() => muteMember(false)}
                      >
                        Unmute
                      </li>
                    ) : (
                      <li
                        className="cursor-pointer rounded-md p-0.5 text-center text-[12px] font-semibold text-red-500 hover:bg-red-500 hover:text-white"
                        onClick={() => muteMember(true)}
                      >
                        Mute for 1h
                      </li>
                    )}
                    <li
                      className="cursor-pointer rounded-md p-0.5 text-center text-[12px] font-semibold text-red-500 hover:bg-red-500 hover:text-white"
                      onClick={kickMember}
                    >
                      Kick
                    </li>
                    {isBanned ? (
                      <li
                        className="cursor-pointer rounded-md p-0.5 text-center text-[12px] font-semibold text-red-500 hover:bg-red-500 hover:text-white"
                        onClick={() => banMember(false)}
                      >
                        Unban
                      </li>
                    ) : (
                      <li
                        className="cursor-pointer rounded-md p-0.5 text-center text-[12px] font-semibold text-red-500 hover:bg-red-500 hover:text-white"
                        onClick={() => banMember(true)}
                      >
                        Ban
                      </li>
                    )}
                  </>
                )}

              {owner?.nickname === nickname && (
                <>
                  <div className="my-0.5 h-0 w-full rounded-sm border-[0.01rem] bg-[#CFCFCF]"></div>

                  {isAdmin ? (
                    <li
                      className="cursor-pointer rounded-md p-0.5 text-center text-[12px] font-semibold text-red-500 hover:bg-red-500 hover:text-white"
                      onClick={() => promoteMember(false)}
                    >
                      Demote
                    </li>
                  ) : (
                    <li
                      className="cursor-pointer rounded-md p-0.5 text-center text-[12px] font-semibold text-red-500 hover:bg-red-500 hover:text-white"
                      onClick={() => promoteMember(true)}
                    >
                      Promote
                    </li>
                  )}
                </>
              )}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
