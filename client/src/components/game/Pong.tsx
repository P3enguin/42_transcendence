import React, {
  MouseEventHandler,
  TouchEventHandler,
  useEffect,
  useRef,
  useState,
} from 'react';
import Board from './Board';
import Paddle from './Paddle';
import Ball from './Ball';
import { Socket } from 'socket.io-client';

interface PongProps {
  gameRef: React.RefObject<HTMLDivElement>;
  socket: Socket;
  position: 'top' | 'bottom' | 'spectator';
}

const Pong = ({ gameRef, socket, position }: PongProps) => {
  const boardRef = useRef<HTMLDivElement>(null);
  const [ballPosition, setBallPosition] = useState({ x: 300, y: 100 });
  const [Paddle1Position, setPaddle1Position] = useState({ x: 525, y: 1 });
  const [Paddle2Position, setPaddle2Position] = useState({ x: 175, y: -1 });

  const handleMouseMove: MouseEventHandler<HTMLDivElement> = (e) => {
    if (boardRef.current) {
      const rec = boardRef.current.getBoundingClientRect();
      const X = (700 * (e.clientX - rec.left)) / boardRef.current.offsetWidth;
      socket.emit('move', { x: X });
      console.log('move it move it');
    }
  };

  const handleTouchMove: TouchEventHandler<HTMLDivElement> = (e) => {
    if (boardRef.current) {
      const rec = boardRef.current.getBoundingClientRect();
      const X = (700 * (e.touches[0].clientX - rec.left)) / boardRef.current.offsetWidth;
      if (X < 0 || X > 700) return;
      socket.emit('move', { x: X });
      console.log('touch it touch it');
    }
  };

  useEffect(() => {
    return () => {};
  }, [position]);
  return (
    <Board
      parentRef={gameRef}
      boardRef={boardRef}
      mouseHandler={handleMouseMove}
      touchHandler={handleTouchMove}
    >
      <Paddle position={Paddle1Position} />
      <Ball position={ballPosition} />
      <Paddle position={Paddle2Position} />
    </Board>
  );
};

export default Pong;
