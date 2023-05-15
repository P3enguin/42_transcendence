import { useEffect, useState } from 'react';

interface ballProps {
  boardRef?: React.RefObject<HTMLDivElement>;
  ballRef: React.RefObject<HTMLDivElement>;
  position: { x: number; y: number };
}

const BallAi = ({ boardRef, position, ballRef }: ballProps) => {
  // const [ballX, setBallX] = useState<number>(0);
  // const [ballY, setBallY] = useState<number>(0);

  // useEffect(() => {
  //   setBallX((position.x * 100) / 700);
  //   setBallY((position.y * 100) / 980);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [position]);

  useEffect(() => {
    const resizeBall = () => {
      if (ballRef.current && boardRef && boardRef.current) {
        ballRef.current.style.width =
          boardRef.current?.offsetWidth / 8 / 5 + 'px';
        ballRef.current.style.height = ballRef.current.offsetWidth + 'px';
      }
    };
    resizeBall();
    window.addEventListener('resize', resizeBall);

    return () => {
      window.removeEventListener('resize', resizeBall);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardRef?.current]);

  return (
    <div
      ref={ballRef}
      className="absolute translate-x-[-50%] translate-y-[-50%] bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('../game/Ball.svg')",
        backgroundSize: '100%',
        top: (position.y * 100) / 980 + '%',
        left: (position.x * 100) / 700 + '%',
        // transform: 'translate(50%, 50%)',
      }}
    ></div>
  );
};

export default BallAi;
