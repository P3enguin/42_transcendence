import { useEffect, useState, useRef } from 'react';

interface paddleProps {
  boardRef?: React.RefObject<HTMLDivElement>;
  position: { x: number; y: number };
}

const PaddleAi = ({ boardRef, position }: paddleProps) => {
  const [paddleOffset, setPaddleOffset] = useState<number>(0);
  const [paddleX, setPaddleX] = useState<number>(0);
  const [paddleY, setPaddleY] = useState<number>(0);
  const paddleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const resizePaddle = () => {
      if (paddleRef.current && boardRef && boardRef.current) {
        paddleRef.current.style.width =
          boardRef.current?.offsetWidth / 8 + 'px';
        paddleRef.current.style.height =
          paddleRef.current.offsetWidth / 5 + 'px';
        setPaddleOffset(paddleRef.current.offsetHeight / 1.5);
        setPaddleX((position.x * 100) / 700);
        setPaddleY((position.y * 100) / 980);
      }
    };
    resizePaddle();
    window.addEventListener('resize', resizePaddle);

    return () => {
      window.removeEventListener('resize', resizePaddle);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardRef?.current, position]);

  const paddleStyle = {
    top: paddleY + '%',
    left: paddleX + '%',
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

export default PaddleAi;
