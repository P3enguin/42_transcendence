import { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';

interface ballProps {
  boardRef?: React.RefObject<HTMLDivElement>;
  ballRef: React.RefObject<HTMLDivElement>;
  ws?: Socket;
}

const Ball = ({ boardRef, ballRef, ws }: ballProps) => {
  const [Position, setPosition] = useState({ x: 400, y: 565 });
  const [ballX, setBallX] = useState<number>(0);
  const [ballY, setBallY] = useState<number>(0);

  useEffect(() => {
    if (ws) {
      ws.on('moveBall', ({ x, y }: { x: number; y: number }) => {
        setPosition({ x: x, y: y });
      });
    }
    return () => {
      ws?.off('moveBall');
    };
  }, []);
  useEffect(() => {
    setBallX((Position.x * 100) / 700);
    setBallY((Position.y * 100) / 980);
  }, [Position]);

  useEffect(() => {
    const resizeBall = () => {
      if (ballRef.current && boardRef && boardRef.current) {
        ballRef.current.style.width =
          boardRef.current?.offsetWidth / 8 / 5 + 'px';
        ballRef.current.style.height = ballRef.current.offsetWidth + 'px';
      }
    };
    resizeBall();
    window.addEventListener('resize', resizeBall);

    return () => {
      window.removeEventListener('resize', resizeBall);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardRef?.current]);

  return (
    <div
      ref={ballRef}
      className="absolute bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('../game/Ball.svg')",
        backgroundSize: '100%',
        top: ballY + '%',
        left: ballX + '%',
        // transform: 'translate(50%, 50%)',
      }}
    ></div>
  );
};

export default Ball;
