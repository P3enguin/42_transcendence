import React, { useRef } from 'react';
import Board from './Board';
import Paddle from './Paddle';
import Ball from './Ball';
import { Socket } from 'socket.io-client';

interface PongProps {
  gameRef: React.RefObject<HTMLDivElement>;
  socket: Socket;
}

const Pong = ({ gameRef, socket }: PongProps) => {
  return (
    <Board parentRef={gameRef}>
      <Paddle position="top" />
      <Ball />
      <Paddle position="bottom" />
    </Board>
  );
};

export default Pong;
