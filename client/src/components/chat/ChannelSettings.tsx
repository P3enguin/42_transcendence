import { Channel } from '@/interfaces/Channel';
import StatusBubble from '../game/StatusBubble';
import { InputDefault, TransparentInput } from '../Input/Inputs';
import { RadioInput } from '../game/StartGame';
import { useState } from 'react';
import { EditIconProfile } from '../icons/Icons';
import ChannelMemberBans from './ChannelMemberBans';
import ChannelMemberInvites from './ChannelMemberInvites';

export default function ChannelSettings({
  channel,
  setChannel,
  isVisible,
  showDetails,
  showSettings,
  toggleMemberSettings,
}: {
  channel: Channel;
  setChannel: (channel: Channel) => void;
  isVisible: boolean;
  showDetails: (isVisible: boolean) => void;
  showSettings: (toggle: boolean) => void;
  toggleMemberSettings: (memberSettings: string) => void;
}) {
  let { bans, invited } = channel;

  const [name, setName] = useState(channel.name);
  const [topic, setTopic] = useState(channel.topic);
  const [privacy, setPrivacy] = useState(channel.privacy);
  const [key, setKey] = useState(channel.key ?? '');
  const [ChannelAvatar, setPicture] = useState(channel.avatar);
  const [memberLimit, setMemberLimit] = useState<string | number>(
    channel.memberLimit === 0 ? '∞' : channel.memberLimit,
  );

  const [selectedTab, setSelectedTab] = useState(1);

  async function saveSettings() {
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_HOST +
          `/chat/update/${channel.channelId}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            topic,
            privacy,
            key: privacy === 'private' ? key : '',
            memberLimit: memberLimit === '∞' ? 0 : (memberLimit as number),
          }),
          credentials: 'include',
        },
      );

      if (response.status == 200) {
        showSettings(false);
        channel.name = name;
        channel.topic = topic;
        channel.privacy = privacy;
        channel.memberLimit = memberLimit === '∞' ? 0 : (memberLimit as number);
        setChannel(channel);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function channelAvatarChange(event: React.ChangeEvent) {
    const ChannelAvatar = (event.target as HTMLInputElement).files?.[0];
    if (ChannelAvatar) {
      let formData = new FormData();
      formData.append('file', ChannelAvatar);
      const url =
        process.env.NEXT_PUBLIC_BACKEND_HOST +
        '/chat/avatar/' +
        channel.channelId;
      try {
        const resp = await fetch(url, {
          method: 'POST',
          body: formData,
          credentials: 'include',
        });
        if (resp.ok) {
          const data = (await resp.json()) as string;
          console.log(data);
          setPicture(data);
        } else {
          console.log('failed to upload');
        }
      } catch (error) {
        console.log('An error has occurred');
      }
    }
  }

  return (
    <div
      className={`absolute right-0 top-0 transition duration-500 ${
        !isVisible ? 'translate-x-[100%]' : ''
      } h-full w-full rounded-[20px] bg-[#283775d1] backdrop-blur-[10px] hl:w-[456px]`}
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
          className="flex h-6 w-20 items-center justify-center rounded-md bg-[#0097E2E6] hover:bg-[#0097E2] active:shadow-[inset_0px_4px_4px_rgba(0,0,0,0.35)]"
          onClick={() => {
            saveSettings();
          }}
        >
          <p className="fond-bold text-[10px] uppercase">Save</p>
        </button>
        <button
          className="flex h-6 w-20 items-center justify-center rounded-md bg-[#FF0D3EA8] hover:bg-[#FF0D3EBF] active:shadow-[inset_0px_4px_4px_rgba(0,0,0,0.35)]"
          onClick={() => {
            showSettings(false);
          }}
        >
          <p className="fond-bold text-[10px] uppercase">Cancel</p>
        </button>
      </div>

      <div className="mt-10 flex w-full flex-col items-center justify-center gap-1">
        <StatusBubble
          avatar={ChannelAvatar}
          className="mb-2"
          imageClassName="h-20 w-20"
          isChannel={channel.isChannel}
        />
        <label
          htmlFor="avatar-holder"
          className="absolute top-[40px] z-20 ml-10 cursor-pointer items-center"
        >
          <EditIconProfile />
        </label>
        <input
          className="hidden cursor-pointer"
          name="avatar-holder"
          id="avatar-holder"
          type="file"
          accept="image/*"
          onChange={channelAvatarChange}
        />

        <div className="text-base font-semibold">
          #
          <TransparentInput
            className="text-base font-semibold"
            id="channelName"
            value={channel.name}
            setValue={setName}
            required={true}
          />
        </div>
        <div>
          <TransparentInput
            className="text-[12px] font-semibold text-[#B4B4B4]"
            id="channelTopic"
            value={channel.topic}
            setValue={setTopic}
          />
        </div>
      </div>

      <div className="mt-6 flex gap-8 px-16">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold uppercase">Change Privacy:</p>
          <div className="ml-12 flex flex-col">
            <RadioInput
              id="privacy-public"
              label="Public"
              onChange={(e: any) => {
                setPrivacy('public');
              }}
              className="mr-0 min-w-0 text-sm font-light"
              isChecked={privacy === 'public'}
            />
            <RadioInput
              id="privacy-private"
              label="Private"
              onChange={(e: any) => {
                setPrivacy('private');
              }}
              className="mr-0 min-w-0 text-sm font-light"
              isChecked={privacy === 'private'}
            />
            <RadioInput
              id="privacy-secret"
              label="Secret"
              onChange={(e: any) => {
                setPrivacy('secret');
              }}
              className="mr-0 min-w-0 text-sm font-light"
              isChecked={privacy === 'secret'}
            />
          </div>
        </div>
        {privacy === 'private' && (
          <form className="flex">
            <InputDefault
              className="group relative"
              name="channelKey"
              id="channelKey"
              type="password"
              description="Channel key"
              defaultValue={key}
              setName={setKey}
            />
          </form>
        )}
      </div>
      <div className="mt-6 flex items-center gap-4 px-16">
        <p className="text-sm font-semibold uppercase">Member Limit:</p>
        <input
          type="range"
          min="0"
          max="100"
          defaultValue={channel.memberLimit}
          className="slider"
          id="memberLimit"
          onChange={(e: React.FormEvent<HTMLInputElement>) => {
            const memberLimit = parseInt(e.currentTarget.value);
            setMemberLimit(memberLimit > 0 ? memberLimit : '∞');
          }}
        />
        <div className="min-w-[48px] rounded-md border-2 border-[#B4B4B4] px-1 text-center text-sm font-medium text-[#B4B4B4]">
          {memberLimit}
        </div>
      </div>

      <div className="mt-6 px-16">
        <p className="text-sm font-semibold uppercase">User management:</p>
        <div className="mt-2 flex gap-5">
          <div className="flex flex-row flex-wrap justify-center gap-3 pr-2 lg:flex-col lg:border-r-2">
            <button
              className={`w-18 flex flex-col rounded-xl ${
                selectedTab === 1 ? 'bg-[#0097E2]' : 'border border-[#0097E2]'
              } px-2 py-1`}
              onClick={() => setSelectedTab(1)}
            >
              <span className="text-sm font-semibold uppercase text-[#D0CFCF]">
                Bans:
              </span>
              <span className="text-[10px] font-medium">{bans?.length}</span>
            </button>
            <button
              className={`w-18 flex flex-col rounded-xl ${
                selectedTab === 2 ? 'bg-[#0097E2]' : 'border border-[#0097E2]'
              } px-2 py-1`}
              onClick={() => setSelectedTab(2)}
            >
              <span className="text-sm font-semibold uppercase text-[#D0CFCF]">
                Invites:
              </span>
              <span className="text-[10px] font-medium">
                {invited?.length ?? 0}
              </span>
            </button>
          </div>
          <ul className="scrollbar absolute bottom-0 right-[55%] mb-2 flex h-[calc(100%-470px)] w-full translate-x-[50%] flex-col gap-2 overflow-y-auto px-6 lg:right-[37%] lg:h-[calc(100%-400px)] lg:w-[70%]">
            {selectedTab === 1 &&
              bans?.map((ban) => (
                <ChannelMemberBans
                  key={ban.player.nickname}
                  channel={channel}
                  member={ban.player}
                  showSettings={showSettings}
                />
              ))}
            {selectedTab === 2 &&
              invited?.map((invite) => (
                <ChannelMemberInvites
                  key={invite.player.nickname}
                  channel={channel}
                  member={invite.player}
                  showSettings={showSettings}
                />
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
