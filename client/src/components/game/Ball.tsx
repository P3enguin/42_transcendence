import React, { useEffect, useState } from 'react';

interface ballProps {
  boardRef?: React.RefObject<HTMLDivElement>;
  ballRef: React.RefObject<HTMLDivElement>;
  position: { x: number; y: number };
}

const Ball = ({ boardRef, position, ballRef }: ballProps) => {
  const [ballX, setBallX] = useState<number>(0);
  const [ballY, setBallY] = useState<number>(0);

  useEffect(() => {
    setBallX((position.x * 100) / 700);
    setBallY((position.y * 100) / 980);
    const resizeBall = () => {
      if (ballRef.current && boardRef && boardRef.current) {
        ballRef.current.style.width = boardRef.current?.offsetWidth / 35 + 'px';
        ballRef.current.style.height = ballRef.current.offsetWidth + 'px';
        console.log(position.x, position.y);
        console.log(ballX, ballY);
      }
    };
    resizeBall();
    window.addEventListener('resize', resizeBall);

    return () => {
      window.removeEventListener('resize', resizeBall);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardRef, position]);

  return (
    <div
      ref={ballRef}
      className="absolute bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('../game/Ball.svg')",
        backgroundSize: '100%',
        top: ballY + '%',
        left: ballX + '%',
        // transform: 'translate(50%, 50%)',
      }}
    ></div>
  );
};

export default Ball;
