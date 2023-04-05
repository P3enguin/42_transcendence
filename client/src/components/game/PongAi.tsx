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
  const [ballPosition, setBallPosition] = useState({ x: 400, y: 565 });
  const [ballVelocity, setBallVelocity] = useState({ x: -5, y: 5 });
  const [Paddle1Position, setPaddle1Position] = useState({ x: 525, y: 1 });
  const [Paddle2Position, setPaddle2Position] = useState({ x: 350, y: -1 });

  const handleMouseMove: MouseEventHandler<HTMLDivElement> = (e) => {
    if (boardRef.current) {
      const rec = boardRef.current.getBoundingClientRect();
      const mousePosition =
        (700 * (e.clientX - rec.left)) / boardRef.current.offsetWidth +
        87.5 / 2;
      if (mousePosition - 87.5 > 5 && mousePosition < 695) {
        setPaddle1Position((prev) => ({ x: mousePosition, y: prev.y }));
      }
    }
  };

  const handleTouchMove: TouchEventHandler<HTMLDivElement> = (e) => {};

  const checkWallCollision = () => {
    if (ballPosition.x <= 5 || ballPosition.x + 20 >= 695) {
      ballVelocity.x = -ballVelocity.x;
      setBallVelocity((prev) => ({ x: -prev.x, y: prev.y }));
    }
    if (ballPosition.y <= 5 || ballPosition.y + 20 >= 975) {
      ballVelocity.y = -ballVelocity.y;
      setBallVelocity((prev) => ({ x: prev.x, y: -prev.y }));
    }
  };

  const chaseBall = () => {
    // if (ballVelocity.y > 0) {
      if (Paddle1Position.x + 87.5 >= 695) return;
      if (Paddle1Position.x <= 5) return;
      setPaddle2Position((prev) => ({
        x: ballPosition.x - 87.5 / 2,
        y: prev.y,
      }));
    // }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (ballRef.current) {
        checkWallCollision();
        chaseBall();
        ballPosition.x += ballVelocity.x;
        ballPosition.y += ballVelocity.y;
        setBallPosition((prev) => ({
          x: prev.x + ballVelocity.x,
          y: prev.y + ballVelocity.y,
        }));
      }
    }, 1000 / 40);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Board
      position="Top"
      parentRef={gameRef}
      boardRef={boardRef}
      mouseHandler={handleMouseMove}
      touchHandler={handleTouchMove}
    >
      <Paddle position={Paddle1Position} boardRef={boardRef} />
      <Ball position={ballPosition} ballRef={ballRef} />
      <Paddle position={Paddle2Position} boardRef={boardRef} />
    </Board>
  );
};

export default PongAi;
