import { Channel } from '@/interfaces/Channel';
import StatusBubble from '../game/StatusBubble';
import { InputDefault, TransparentInput } from '../Input/Inputs';
import { RadioInput } from '../game/StartGame';
import { useState } from 'react';

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
  let { bans } = channel;

  const [name, setName] = useState(channel.name);
  const [topic, setTopic] = useState(channel.topic);
  const [privacy, setPrivacy] = useState(channel.privacy);
  const [key, setKey] = useState(channel.key);
  const [memberLimit, setMemberLimit] = useState<string | number>(
    channel.memberLimit === 0 ? '∞' : channel.memberLimit,
  );

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
          avatar={channel.avatar}
          className="mb-2"
          imageClassName="h-20 w-20"
          isChannel={channel.isChannel}
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
      <div className="mt-4 flex gap-8 px-16">
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
              checked={privacy === 'public'}
            />
            <RadioInput
              id="privacy-private"
              label="Private"
              onChange={(e: any) => {
                setPrivacy('private');
              }}
              className="mr-0 min-w-0 text-sm font-light"
              checked={privacy === 'private'}
            />
            <RadioInput
              id="privacy-secret"
              label="Secret"
              onChange={(e: any) => {
                setPrivacy('secret');
              }}
              className="mr-0 min-w-0 text-sm font-light"
              checked={privacy === 'secret'}
            />
          </div>
        </div>
        {privacy === 'private' && (
          <InputDefault
            className="group relative"
            name="channelKey"
            id="channelKey"
            type="password"
            description="Channel key"
            defaultValue={key}
            setName={setKey}
          />
        )}
      </div>
      <div className="mt-4 flex items-center gap-4 px-16">
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
    </div>
  );
}
