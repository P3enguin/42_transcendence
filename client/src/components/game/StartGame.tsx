import axios from 'axios';
import { Radio } from 'flowbite-react';
import { useRouter } from 'next/router';
import { useState } from 'react';

// radio input component
export const RadioInput = ({ id, label, onChange }: any) => {
  return (
    <div className="mr-6 inline-flex items-center self-center whitespace-nowrap">
      <input type="radio" id={id} name="type" onChange={onChange} />
      <label htmlFor={id} className="m-1 whitespace-nowrap">
        {label}
      </label>
    </div>
  );
};

// start game component
const StartGame = () => {
  const [gametype, setGametype] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const router = useRouter();

  async function joinMatchmaking(gametype: string) {
    const res = await axios.get(
      process.env.NEXT_PUBLIC_BACKEND_HOST + '/game/join',
      {
        withCredentials: true,
        params: {
          gametype: gametype,
        },
      },
    );
    router.push('/game/' + res.data);
  }

  return (
    <div className="flex h-full flex-col rounded-2xl pl-5 pr-5 sm:p-5 md:w-[50%] ">
      <h2 className="m-2 text-lg font-bold md:text-2xl">START A GAME</h2>
      <div className="felx m-auto mb-0 flex-row ">
        <RadioInput
          id="normal"
          label="Normal Game"
          onChange={() => {
            setGametype('NORMAL');
            setIsButtonDisabled(false);
          }}
        />
        <RadioInput
          id="ranked"
          label="Ranked Game"
          onChange={() => {
            setGametype('RANKED');
            setIsButtonDisabled(false);
          }}
        />
      </div>
      <button
        className="m-auto mt-5 w-[200px] rounded-xl bg-[#0097E2] p-1"
        onClick={(e) => {
          e.preventDefault();
          joinMatchmaking(gametype);
        }}
        disabled={isButtonDisabled}
      >
        JOIN MATCHMAKING
      </button>
    </div>
  );
};

export default StartGame;
