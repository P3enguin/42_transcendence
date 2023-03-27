import React, { useRef } from 'react';
import Board from './Board';
import Paddle from './Paddle';
import Ball from './Ball';

const Pong = ({ gameRef }: any) => {
  return (
    <Board parentRef={gameRef}>
      <Paddle position="top" />
      <Ball />
      <Paddle position="bottom" />
    </Board>
  );
};

export default Pong;
