import React, { useRef, useEffect } from 'react';

const Board = () => {
  const boardRef = useRef(null);

  useEffect(() => {
    const setBoardHeight = () => {
      if (boardRef.current.offsetHeight < window.innerHeight) {
        const boardWidth = boardRef.current.offsetWidth;
        boardRef.current.style.height = `${boardWidth * 1.4}px`;
      } else {
        boardRef.current.style.height = '';
      }
    };

    setBoardHeight();
    window.addEventListener('resize', setBoardHeight);

    return () => {
      window.removeEventListener('resize', setBoardHeight);
    };
  }, []);

  return (
    <div
      ref={boardRef}
      className="pong-board w-11/12 bg-cover bg-center"
      style={{
        backgroundImage: "url('../GameBoard.svg')",
        backgroundRepeat: 'no-repeat',
      }}
    >
      Board
    </div>
  );
};

export default Board;
