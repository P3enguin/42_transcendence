import { useEffect, useRef, useState } from 'react';
import { Socket } from 'socket.io-client';

interface ballProps {
  boardRef?: React.RefObject<HTMLDivElement>;
  ws?: Socket;
}

const BOARD_WIDHT = 700;
const BOARD_HEIGHT = BOARD_WIDHT * 1.4;
const PADDLE_OFFSET = 10;
const PADDLE_WIDTH = BOARD_WIDHT / 8;
const PADDLE_HEIGHT = PADDLE_WIDTH / 5;
const BALL_DIAMETER = PADDLE_HEIGHT;
const BALL_RADIUS = BALL_DIAMETER / 2;
const INIT_BALL_X = BOARD_WIDHT / 2 - BALL_RADIUS;
const INIT_BALL_Y = BOARD_HEIGHT / 2 - BALL_RADIUS;

const Ball = ({ boardRef, ws }: ballProps) => {
  const ballRef = useRef<HTMLDivElement>(null);
  const [Position, setPosition] = useState({ x: INIT_BALL_X, y: INIT_BALL_Y });

  useEffect(() => {
    if (ws) {
      ws.on('updateBall', ({ x, y }: { x: number; y: number }) => {
        setPosition({ x, y });
      });
    }
    return () => {
      if (ws) ws.off('updateBall');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const resizeBall = () => {
      if (ballRef.current && boardRef && boardRef.current) {
        ballRef.current.style.width =
          (boardRef.current?.offsetWidth / 8) / 5 + 'px';
        ballRef.current.style.height = ballRef.current.offsetWidth + 'px';
      }
    };
    resizeBall();
    setPosition((prev) => ({ x: prev.x, y: prev.y }));
    window.addEventListener('resize', resizeBall);

    return () => {
      window.removeEventListener('resize', resizeBall);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardRef?.current, ballRef.current]);

  return (
    <div
      ref={ballRef}
      className="absolute translate-x-[-50%] translate-y-[-50%] bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('../game/Ball.svg')",
        backgroundSize: '100%',
        left: (Position.x * 100) / 700 + '%',
        top: (Position.y * 100) / 980 + '%',
        // transform: 'translate(50%, 50%)',
      }}
    ></div>
  );
};

export default Ball;
