import { useEffect, useState } from 'react';

interface ScoreBoardProps {
  P1: string;
  P1Score: number;
  P2: string;
  P2Score: number;
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
        <h1 className="text-center">ScoreBoard</h1>
        <p className="text-center">{formatTime(elapsedTime)}</p>
        <div className="flex flex-row justify-between">
          <div>
            <p>{props.P1}</p>
            <p>{props.P1Score}</p>
          </div>
          <div>
            <p>{props.P2}</p>
            <p>{props.P2Score}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ScoreBoard;
