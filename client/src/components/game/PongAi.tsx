import Board from './Board';
import Paddle from './Paddle';
import Ball from './Ball';
import {
  MouseEventHandler,
  TouchEventHandler,
  useEffect,
  useRef,
  useState,
} from 'react';

const PongAi = ({ gameRef }: { gameRef: React.RefObject<HTMLDivElement> }) => {
  const boardRef = useRef<HTMLDivElement>(null);
  const [ballPosition, setBallPosition] = useState({ x: 90, y: 10 });
  const [ballVelocity, setBallVelocity] = useState({ x: -1, y: 1 });
  const [Paddle1Position, setPaddle1Position] = useState({ x: 525, y: 1 });
  const [Paddle2Position, setPaddle2Position] = useState({ x: 175, y: -1 });

  const handleMouseMove: MouseEventHandler<HTMLDivElement> = (e) => {};

  const handleTouchMove: TouchEventHandler<HTMLDivElement> = (e) => {};
  useEffect(() => {
      const interval = setInterval(() => {
        console.log(boardRef.current?.offsetWidth, ballPosition.x);
        if (ballPosition.x < 0 || ballPosition.x > boardRef.current?.offsetWidth) {
          ballVelocity.x = -ballVelocity.x;
          setBallVelocity((prev) => ({ x: -prev.x, y: prev.y }));
        }
        if (ballPosition.y < 0 || ballPosition.y > boardRef.current?.offsetHeight) {
          ballVelocity.y = -ballVelocity.y;
          setBallVelocity((prev) => ({ x: prev.x, y: -prev.y }));
        }
        ballPosition.x += ballVelocity.x;
        ballPosition.y += ballVelocity.y;
        setBallPosition((prev) => ({
          x: prev.x + ballVelocity.x,
          y: prev.y + ballVelocity.y,
        }));
    }, 1000/30);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Board
      position="Bottom"
      parentRef={gameRef}
      boardRef={boardRef}
      mouseHandler={handleMouseMove}
      touchHandler={handleTouchMove}
    >
      <Paddle position={Paddle1Position} />
      <Ball position={ballPosition} type="ai"/>
      <Paddle position={Paddle2Position} />
    </Board>
  );
};

export default PongAi;
