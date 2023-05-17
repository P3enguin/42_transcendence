import Game from '@/pages/game';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

interface ScoreBoardProps {
  gameOn: boolean;
  player1: {
    nickname: string;
    avatar: string;
    score: number;
  };
  player2: {
    nickname: string;
    avatar: string;
    score: number;
  };
}

const START_DATE = new Date().getTime();

const ScoreBoard = (props: ScoreBoardProps) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [redirectTime, setRedirectTime] = useState(3);
  const router = useRouter();

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    const redirectAfter = (seconds: number) => {
      intervalId = setTimeout(() => {
        if (seconds >= 0) {
          setRedirectTime(seconds);
          redirectAfter(seconds - 1);
        } else router.push('/game');
      }, 1000);
    };

    if (props.gameOn) {
      const startTime = Date.now();
      intervalId = setInterval(() => {
        const currentTime = Date.now();
        const elapsed = currentTime - startTime;
        setElapsedTime(elapsed);
      }, 10);
    } else {
      redirectAfter(redirectTime);
    }

    // cleanup function to clear the interval when the component unmounts
    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.gameOn]);

  const getWinner = () => {
    if (props.player1.score > props.player2.score) {
      return props.player1;
    } else {
      return props.player2;
    }
  };

  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600000);
    const minutes = Math.floor((time % 3600000) / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    const milliseconds = Math.floor((time % 1000) / 10);
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}:${milliseconds.toString().padStart(2, '0')}`;
  };

  return (
    <>
      {props.gameOn && (
        <div className="felx w-[50%] min-w-[300px] max-w-[800px] rounded-2xl border p-3 my-6">
          <p className="text-center text-xl ">{formatTime(elapsedTime)}</p>
          <div className="flex justify-between">
            <div className="flex flex-col items-center">
              <Image
                src={`${process.env.NEXT_PUBLIC_BACKEND_HOST}/avatars/${props.player1.avatar}`}
                alt={`Avatar of ${props.player1.nickname}`}
                width={50}
                height={50}
                className="w-[50px] rounded-full"
              />
              <p>{props.player1.nickname}</p>
              <p>{props.player1.score}</p>
            </div>
            <div className="flex flex-col items-center">
              <Image
                src={`${process.env.NEXT_PUBLIC_BACKEND_HOST}/avatars/${props.player2.avatar}`}
                alt={`Avatar of ${props.player2.nickname}`}
                width={50}
                height={50}
                className="w-[50px] rounded-full"
              />
              <p>{props.player2.nickname}</p>
              <p>{props.player2.score}</p>
            </div>
          </div>
        </div>
      )}
      {!props.gameOn && (
        <div className="flex min-h-[300px] w-[50%] min-w-[300px] max-w-[800px] flex-col items-center justify-between rounded-2xl border p-5 text-center text-xl m-auto">
          <div>
            <Image
              src={`${process.env.NEXT_PUBLIC_BACKEND_HOST}/avatars/${getWinner().avatar
                }`}
              alt={`Avatar of ${getWinner().nickname}`}
              width={200}
              height={200}
              className="m-auto mb-3 rounded-full"
              quality={100}
            />

            <p className="">
              The winner is &ldquo;{getWinner().nickname}&rdquo;
            </p>
          </div>
          <p className="w-full text-right text-[13px]">
            redirecting after {redirectTime} seconds...
          </p>
        </div>
      )}
    </>
  );
};

export default ScoreBoard;
