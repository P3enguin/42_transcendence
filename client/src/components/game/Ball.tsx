import React, { useEffect, useState } from 'react';

interface ballProps {
  boardRef?: React.RefObject<HTMLDivElement>;
  position: { x: number; y: number };
  type?: string;
}

const Ball = ({ boardRef, position, type }: ballProps) => {
  const ballRef = React.useRef<HTMLDivElement>(null);
  const [ballX, setBallX] = useState<number>(0);
  const [ballY, setBallY] = useState<number>(0);

  useEffect(() => {
    const resizeBall = () => {
      if (ballRef.current && boardRef && boardRef.current) {
        ballRef.current.style.width = boardRef.current?.offsetWidth / 35 + 'px';
        ballRef.current.style.height = ballRef.current.offsetWidth + 'px';
        if (!type) {
          setBallX((position.x * 100) / 700);
          setBallY((position.y * 100) / 980);
        } else {
          setBallX(position.x);
          setBallY(position.y);
        }
      }
    };
    resizeBall();
    window.addEventListener('resize', resizeBall);

    return () => {
      window.removeEventListener('resize', resizeBall);
    };
  }, [boardRef, position]);

  return (
    <div
      ref={ballRef}
      className="relative bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('../game/Ball.svg')",
        backgroundSize: '100%',
        top: ballY + '%',
        left: ballX + '%',
        transform: 'translate(50%, 50%)',
      }}
    ></div>
  );
};

export default Ball;
