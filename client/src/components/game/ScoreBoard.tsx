import { useEffect, useState } from 'react';

interface ScoreBoardProps {
  player1: string;
  player1Score: number;
  player2: string;
  player2Score: number;
}

const START_DATE = new Date().getTime();

const ScoreBoard = (props: ScoreBoardProps) => {
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const intervalId = setInterval(() => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      setElapsedTime(elapsed);
    }, 10);

    // cleanup function to clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

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
      <div className="felx min-w-[300px] flex-col">
        <p className="text-center">{formatTime(elapsedTime)}</p>
        <div className="flex flex-row justify-between">
          <div>
            <p>{props.player1}</p>
            <p>{props.player1Score}</p>
          </div>
          <div>
            <p>{props.player2}</p>
            <p>{props.player2Score}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ScoreBoard;
