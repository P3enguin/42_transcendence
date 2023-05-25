import axios from 'axios';
import { useRouter } from 'next/router';
import { useState } from 'react';

export const RadioInput = ({
  id,
  label,
  onChange,
  className,
  checked = false,
}: {
  id: string;
  label: string;
  onChange: (e: any) => void;
  className?: string;
  checked?: boolean;
}) => {
  return (
    <div
      className={
        'mr-6 min-w-[130px] items-center justify-start whitespace-nowrap sm:inline-flex ' +
        className
      }
    >
      {checked ? (
        <input type="radio" id={id} name="type" onChange={onChange} checked />
      ) : (
        <input type="radio" id={id} name="type" onChange={onChange} />
      )}
      <label
        htmlFor={id}
        className="ml-2 cursor-pointer whitespace-nowrap text-left"
      >
        {label}
      </label>
    </div>
  );
};

const StartGame = () => {
  const router = useRouter();
  const [gametype, setGametype] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  async function joinMatchmaking(gametype: string) {
    const res = await axios.get(
      process.env.NEXT_PUBLIC_BACKEND_HOST + '/game/join',
      {
        withCredentials: true,
        params: {
          gametype,
        },
      },
    );
    router.push('/game/' + res.data);
  }

  return (
    <div className="flex h-full flex-col rounded-2xl pl-5 pr-5 md:w-[50%] md:p-5 ">
      <h2 className="text-lg m-1 font-bold sm:m-2 md:text-2xl">START A GAME</h2>
      <div className="felx m-auto flex flex-row flex-wrap justify-center px-2 md:p-5">
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
        <RadioInput
          id="time"
          label="Time Attack"
          onChange={() => {
            setGametype('TIME_ATTACK');
            setIsButtonDisabled(false);
          }}
        />
        <RadioInput
          id="survival"
          label="Survival Mode"
          onChange={() => {
            setGametype('SURVIVAL');
            setIsButtonDisabled(false);
          }}
        />
      </div>
      <button
        className="m-auto mt-1 w-[200px] rounded-xl bg-[#0097E2] p-1"
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
