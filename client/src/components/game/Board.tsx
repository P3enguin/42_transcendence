import React, {
  useRef,
  useEffect,
  ReactNode,
  MouseEventHandler,
  TouchEventHandler,
} from 'react';

interface BoardProps {
  position: string;
  parentRef: React.RefObject<HTMLDivElement>;
  boardRef: React.RefObject<HTMLDivElement>;
  children: ReactNode;
  mouseHandler: MouseEventHandler<HTMLDivElement>;
  touchHandler: TouchEventHandler<HTMLDivElement>;
}

const Board = ({
  position,
  children,
  parentRef,
  boardRef,
  mouseHandler,
  touchHandler,
}: BoardProps) => {
  useEffect(() => {
    const resizeBoard = () => {
      if (boardRef.current && parentRef.current) {
        const parentWidth = parentRef.current.offsetWidth;
        const parentHeight = parentRef.current.offsetHeight;
        if (parentWidth < parentHeight / 1.4) {
          boardRef.current.style.width = parentWidth * 0.9 + 'px';
          boardRef.current.style.height =
            boardRef.current.offsetWidth * 1.4 + 'px';
        } else if (parentWidth > parentHeight / 1.4) {
          boardRef.current.style.height = (parentHeight - 64) * 0.91 + 'px';
          boardRef.current.style.width =
            boardRef.current.offsetHeight / 1.4 + 'px';
        }
      }
    };
    resizeBoard();
    window.addEventListener('resize', resizeBoard);
    return () => {
      window.removeEventListener('resize', resizeBoard);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardRef.current, parentRef.current]);

  return (
    <div
      onMouseMove={mouseHandler}
      onTouchMove={touchHandler}
      ref={boardRef}
      className="rounded-[3%] bg-center bg-no-repeat w-full"
      style={{
        backgroundImage: "url('../game/GameBoard.svg')",
        backgroundSize: '100%',
        rotate: position === 'Top' ? '180deg' : '0deg',
      }}
    >
      {React.Children.map(children, (child) => {
        return React.cloneElement(child as React.ReactElement, {
          boardRef: boardRef,
        });
      })}
    </div>
  );
};

export default Board;
