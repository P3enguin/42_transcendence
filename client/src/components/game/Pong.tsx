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
  let prevX = 0;

  const handleMouseMove: MouseEventHandler<HTMLDivElement> = (e) => {
    if (boardRef.current && position !== 'spectator') {
      const rec = boardRef.current.getBoundingClientRect();
      const mousePosition = e.clientX - rec.left;
      let x = Math.round(
        (BOARD_WIDHT * mousePosition) / boardRef.current.offsetWidth,
      );
      x = position === 'Top' ? x + PADDLE_WIDTH / 2 : x - PADDLE_WIDTH / 2;
      if (position === 'Top') x = (x - BOARD_WIDHT) * -1;
      if (x < 0 || x > BOARD_WIDHT - PADDLE_WIDTH) return;
      if (x === prevX) return;
      prevX = x;
      socket.emit('move', { x, position });
    }
  };

  const handleTouchMove: TouchEventHandler<HTMLDivElement> = (e) => {
    if (boardRef.current && position !== 'spectator') {
      const rec = boardRef.current.getBoundingClientRect();
      const touchPosition = e.touches[0].clientX - rec.left;
      let x = Math.round(
        (BOARD_WIDHT * touchPosition) / boardRef.current.offsetWidth,
      );
      x = position === 'Top' ? x + PADDLE_WIDTH / 2 : x - PADDLE_WIDTH / 2;
      if (position === 'Top') x = (x - BOARD_WIDHT) * -1;
      if (x < 0 || x > BOARD_WIDHT - PADDLE_WIDTH) return;
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
      isContact={false}
      isRotated={false}
    >
      <Paddle position="Top" ws={socket} boardRef={boardRef} />
      <Ball ws={socket} boardRef={boardRef} />
      <Paddle position="Bottom" ws={socket} boardRef={boardRef} />
    </Board>
  );
};

export default Pong;
