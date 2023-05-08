import { useEffect, useState, useRef } from 'react';
import { Socket } from 'socket.io-client';

interface paddleProps {
  boardRef?: React.RefObject<HTMLDivElement>;
  position: string;
  ws?: Socket;
}

const BOARD_WIDHT = 700;
const BOARD_HEIGHT = BOARD_WIDHT * 1.4;
const PADDLE_OFFSET = 10;
const PADDLE_WIDTH = BOARD_WIDHT / 8;
const PADDLE_HEIGHT = PADDLE_WIDTH / 5;
const BALL_DIAMETER = PADDLE_HEIGHT;
const BALL_RADIUS = BALL_DIAMETER / 2;

const Paddle = ({ boardRef, position, ws }: paddleProps) => {
  const [PaddlePosition, setPaddlePosition] = useState({
    x: 350,
    y:
      position === 'Top'
        ? PADDLE_OFFSET
        : BOARD_HEIGHT - PADDLE_OFFSET - PADDLE_HEIGHT,
  });
  const [paddleX, setPaddleX] = useState<number>(0);
  const [paddleY, setPaddleY] = useState<number>(0);
  const paddleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ws) {
      ws.on('movePaddle', ({ topPaddle, bottomPaddle }: any) => {
        if (position === 'Top' && PaddlePosition.y < BOARD_HEIGHT / 2) {
          setPaddlePosition((prev) => ({
            x: topPaddle.x - PADDLE_WIDTH / 2,
            y: prev.y,
          }));
        } else if (
          position === 'Bottom' &&
          PaddlePosition.y > BOARD_HEIGHT / 2
        ) {
          setPaddlePosition((prev) => ({
            x: bottomPaddle.x - PADDLE_WIDTH / 2,
            y: prev.y,
          }));
        }
      });
    }
    return () => {
      ws?.off('movePaddle');
    };
  }, []);

  useEffect(() => {
    const resizePaddle = () => {
      if (paddleRef.current && boardRef && boardRef.current) {
        paddleRef.current.style.width =
          boardRef.current?.offsetWidth / 8 + 'px';
        paddleRef.current.style.height =
          paddleRef.current.offsetWidth / 5 + 'px';
        setPaddleX((PaddlePosition.x * 100) / 700);
        setPaddleY((PaddlePosition.y * 100) / 980);
      }
    };
    resizePaddle();
    window.addEventListener('resize', resizePaddle);

    return () => {
      window.removeEventListener('resize', resizePaddle);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardRef?.current, PaddlePosition]);

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

export default Paddle;
