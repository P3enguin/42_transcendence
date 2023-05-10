import { useEffect, useState, useRef } from 'react';
import { Socket } from 'socket.io-client';

interface paddleProps {
  boardRef: React.RefObject<HTMLDivElement>;
  position: string;
  ws?: Socket;
}

const BOARD_WIDHT = 700;
const BOARD_HEIGHT = BOARD_WIDHT * 1.4;
const PADDLE_OFFSET = 10;
const PADDLE_WIDTH = BOARD_WIDHT / 8;
const PADDLE_HEIGHT = PADDLE_WIDTH / 5;
const INIT_TPAD_POS = {
  x: BOARD_WIDHT / 4 - PADDLE_WIDTH / 2,
  y: PADDLE_OFFSET,
};
const INIT_BPAD_POS = {
  x: 3 * (BOARD_WIDHT / 4) - PADDLE_WIDTH / 2,
  y: BOARD_HEIGHT - PADDLE_OFFSET - PADDLE_HEIGHT,
};

const Paddle = ({ boardRef, position, ws }: paddleProps) => {
  const paddleRef = useRef<HTMLDivElement>(null);
  const [PaddlePosition, setPaddlePosition] = useState({
    x: position === 'Top' ? INIT_TPAD_POS.x : INIT_BPAD_POS.x,
    y: position === 'Top' ? INIT_TPAD_POS.y : INIT_BPAD_POS.y,
  });

  useEffect(() => {
    if (ws) {
      ws.on(
        'updatePaddle',
        ({ top, bottom }: { top: { x: number }; bottom: { x: number } }) => {
          if (position === 'Top' && PaddlePosition.y < BOARD_HEIGHT / 2)
            setPaddlePosition((prev) => ({ x: top.x, y: prev.y }));
          else if (position === 'Bottom' && PaddlePosition.y > BOARD_HEIGHT / 2)
            setPaddlePosition((prev) => ({ x: bottom.x, y: prev.y }));
        },
      );
    }
    return () => {
      if (ws) ws.off('updatePaddle');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const resizePaddle = () => {
      if (paddleRef.current && boardRef.current) {
        paddleRef.current.style.width =
          boardRef.current?.offsetWidth / 8 + 'px';
        paddleRef.current.style.height =
          paddleRef.current.offsetWidth / 5 + 'px';
      }
    };
    setPaddlePosition((prev) => ({ x: prev.x, y: prev.y }));
    resizePaddle();
    window.addEventListener('resize', resizePaddle);

    return () => {
      window.removeEventListener('resize', resizePaddle);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardRef.current, paddleRef.current]);

  return (
    <div
      ref={paddleRef}
      className="absolute bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('../game/Paddle.svg')",
        backgroundSize: '100%',
        top: (PaddlePosition.y * 100) / 980 + '%',
        left: (PaddlePosition.x * 100) / 700 + '%',
      }}
    ></div>
  );
};

export default Paddle;
