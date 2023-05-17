import { useRouter } from 'next/router';
import React from 'react';

const StartTraining = () => {
  const router = useRouter();

  return (
    <div className="flex h-full flex-col rounded-2xl pl-5 pr-5 md:p-5 md:w-[50%]">
      <h2 className="text-lg m-2 font-bold md:text-2xl">START TRAINING</h2>
      <div className="felx m-auto flex-row md:p-5 md:mb-8">
        You don’t know how things are going? <br />
        Don’t worry, you can always train and play with our AI.
      </div>
      <button
        className="m-auto mt-1 w-[200px] rounded-xl bg-[#0097E2] p-1"
        onClick={() => {
          router.push('/game/ai');
        }}
      >
        PLAY WITH AI
      </button>
    </div>
  );
};

export default StartTraining;
