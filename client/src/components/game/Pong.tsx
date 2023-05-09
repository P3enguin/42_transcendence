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

const BOARD_WIDHT = 700;
const BOARD_HEIGHT = BOARD_WIDHT * 1.4;
const PADDLE_OFFSET = 10;
const PADDLE_WIDTH = BOARD_WIDHT / 8;
const PADDLE_HEIGHT = PADDLE_WIDTH / 5;
const BALL_DIAMETER = PADDLE_HEIGHT;
const BALL_RADIUS = BALL_DIAMETER / 2;

const Pong = ({ gameRef, socket, position }: PongProps) => {
  const boardRef = useRef<HTMLDivElement>(null);
  const ballRef = useRef<HTMLDivElement>(null);
  let prevX = 0;

  const handleMouseMove: MouseEventHandler<HTMLDivElement> = (e) => {
    if (boardRef.current && position !== 'spectator') {
      const rec = boardRef.current.getBoundingClientRect();
      const mousePosition = e.clientX - rec.left;
      let x = Math.round((700 * mousePosition) / boardRef.current.offsetWidth);
      if (x < 0 + PADDLE_WIDTH / 2 || x > 700 - PADDLE_WIDTH / 2) return;
      if (position === 'Top') x = (x - 700) * -1;
      if (x === prevX) return;
      prevX = x;
      socket.emit('move', { x, position });
    }
  };
  
  const handleTouchMove: TouchEventHandler<HTMLDivElement> = (e) => {
    if (boardRef.current && position !== 'spectator') {
      const rec = boardRef.current.getBoundingClientRect();
      const touchPosition = e.touches[0].clientX - rec.left;
      let x = Math.round((700 * touchPosition) / boardRef.current.offsetWidth);
      if (x < 0 || x > 700) return;
      if (position === 'Top') x = Math.abs(x - 700);
      if (x === prevX) return;
      prevX = x;
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
      <Paddle position="Top" ws={socket} />
      <Ball ws={socket} ballRef={ballRef} />
      <Paddle position="Bottom" ws={socket} />
    </Board>
  );
};

export default Pong;
