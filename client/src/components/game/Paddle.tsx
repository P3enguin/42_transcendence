import React, { useState } from 'react';

interface paddleProps {
  boardRef?: React.RefObject<HTMLDivElement>;
  position: { x: number; y: number };
}

const Paddle = ({ boardRef, position }: paddleProps) => {
  const [paddleOffset, setPaddleOffset] = useState<number>(0);
  const [paddleX, setPaddleX] = useState<number>(0);
  const paddleRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const resizePaddle = () => {
      if (paddleRef.current && boardRef && boardRef.current) {
        paddleRef.current.style.width =
          boardRef.current?.offsetWidth / 8 + 'px';
        paddleRef.current.style.height =
          paddleRef.current.offsetWidth / 5 + 'px';
        setPaddleOffset(paddleRef.current.offsetHeight / 1.5);
        setPaddleX((position.x * 100) / 700);
      }
    };
    resizePaddle();
    window.addEventListener('resize', resizePaddle);

    return () => {
      window.removeEventListener('resize', resizePaddle);
    };
  }, [boardRef, position]);

  const paddleStyle = {
    top: position.y === 1 ? paddleOffset : undefined,
    bottom: position.y === -1 ? paddleOffset : undefined,
    left: position.y === 1 ? 100 - paddleX + '%' : paddleX + '%',
  };
  return (
    <div
      ref={paddleRef}
      className="absolute bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('../game/Paddle.svg')",
        backgroundSize: '100%',
        ...paddleStyle,
      }}
    ></div>
  );
};

export default Paddle;
