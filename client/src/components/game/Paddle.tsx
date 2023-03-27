import React, { useState } from 'react';

interface paddleProps {
  boardRef?: React.RefObject<HTMLDivElement>;
  position: 'top' | 'bottom';
}

const Paddle = ({ boardRef, position }: paddleProps) => {
  const [paddleOffset, setPaddleOffset] = useState<number>(0);
  const paddleRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const resizePaddle = () => {
      if (paddleRef.current && boardRef && boardRef.current) {
        paddleRef.current.style.width =
          boardRef.current?.offsetWidth / 8 + 'px';
        paddleRef.current.style.height =
          paddleRef.current.offsetWidth / 5 + 'px';
        setPaddleOffset(paddleRef.current.offsetHeight / 1.5);
      }
    };
    resizePaddle();
    window.addEventListener('resize', resizePaddle);

    return () => {
      window.removeEventListener('resize', resizePaddle);
    };
  }, []);

const paddleStyle = {
  top: position === 'top' ? paddleOffset + 'px' : undefined,
  bottom: position === 'bottom' ? paddleOffset +'px' : undefined,
  left: position === 'top' ? '60%' : '30%',
};
  return (
    <div
      ref={paddleRef}
      className="absolute bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('../game/Paddle.svg')",
        backgroundSize: '100%',
        ...paddleStyle
      }}
    ></div>
  );
};

export default Paddle;
