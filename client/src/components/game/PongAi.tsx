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
  const ballRef = useRef<HTMLDivElement>(null);
  const [ballPosition, setBallPosition] = useState({ x: 0, y: 0 });
  const [ballVelocity, setBallVelocity] = useState({ x: -1, y: 1 });
  const [Paddle1Position, setPaddle1Position] = useState({ x: 525, y: 1 });
  const [Paddle2Position, setPaddle2Position] = useState({ x: 175, y: -1 });

  const handleMouseMove: MouseEventHandler<HTMLDivElement> = (e) => {
    if (boardRef.current) {
      const mousePosition = e.pageX - boardRef.current.offsetLeft;
      if (mousePosition > 0 && mousePosition < 700) {
        setPaddle2Position((prev) => ({ x: mousePosition, y: prev.y }));
      }
    }
  };

  const handleTouchMove: TouchEventHandler<HTMLDivElement> = (e) => {};

  const checkWallCollision = () => {
    if (ballRef.current && boardRef.current) {
      if (
        ballPosition.x < 0 ||
        ballPosition.x + ballRef.current?.offsetWidth >= 700
      ) {
        ballVelocity.x = -ballVelocity.x;
        setBallVelocity((prev) => ({ x: -prev.x, y: prev.y }));
      }
      if (
        ballPosition.y < 0 ||
        ballPosition.y + ballRef.current?.offsetHeight >= 980
      ) {
        ballVelocity.y = -ballVelocity.y;
        setBallVelocity((prev) => ({ x: prev.x, y: -prev.y }));
      }
      if (
        ballPosition.x + ballRef.current?.offsetWidth >= Paddle2Position.x &&
        ballPosition.x <= Paddle2Position.x + 100 &&
        ballPosition.y + ballRef.current?.offsetHeight >= 980
      ) {
        ballVelocity.y = -ballVelocity.y;
        setBallVelocity((prev) => ({ x: prev.x, y: -prev.y }));
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (ballRef.current) {
        checkWallCollision();
        ballPosition.x += ballVelocity.x;
        ballPosition.y += ballVelocity.y;
        setBallPosition((prev) => ({
          x: prev.x + ballVelocity.x,
          y: prev.y + ballVelocity.y,
        }));
      }
    }, 1);
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
      <Paddle position={Paddle1Position} /*Top paddle*/ />
      <Ball position={ballPosition} ballRef={ballRef} />
      <Paddle position={Paddle2Position} /*Bottom paddle*/ />
    </Board>
  );
};

export default PongAi;
