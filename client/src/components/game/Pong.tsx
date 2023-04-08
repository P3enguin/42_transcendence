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
  position: string;
}

const Pong = ({ gameRef, socket, position }: PongProps) => {
  const boardRef = useRef<HTMLDivElement>(null);
  const [ballPosition, setBallPosition] = useState({ x: 300, y: 100 });
  const [Paddle1Position, setPaddle1Position] = useState({ x: 525, y: 1 });
  const [Paddle2Position, setPaddle2Position] = useState({ x: 175, y: -1 });

  socket.on('move it', ({ position, x }: any) => {
    if (position === 'Top') {
      setPaddle1Position({ x, y: 1 });
    } else {
      setPaddle2Position({ x, y: -1 });
    }
  });

  const handleMouseMove: MouseEventHandler<HTMLDivElement> = (e) => {
    if (boardRef.current && position !== 'spectator') {
      const rec = boardRef.current.getBoundingClientRect();
      const x = (700 * (e.clientX - rec.left)) / boardRef.current.offsetWidth;
      socket.emit('move', { x, position });
    }
  };

  const handleTouchMove: TouchEventHandler<HTMLDivElement> = (e) => {
    if (boardRef.current && position !== 'spectator') {
      const rec = boardRef.current.getBoundingClientRect();
      const x =
        (700 * (e.touches[0].clientX - rec.left)) /
        boardRef.current.offsetWidth;
      if (x < 0 || x > 700) return;
      socket.emit('move', { x, position });
    }
  };

  return (
    <Board
      position={position}
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
