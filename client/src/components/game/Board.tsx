import Description from '../home/Description';
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
  isRotated: boolean;
}

const Board = ({
  position,
  children,
  parentRef,
  boardRef,
  mouseHandler,
  touchHandler,
  isRotated,
}: BoardProps) => {
  const text0Ref = useRef<HTMLDivElement>(null);
  const text1Ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const resizeBoard = () => {
      if (boardRef.current && parentRef.current) {
        let parentWidth;
        let parentHeight;
        if (!isRotated) {
          parentWidth = parentRef.current.offsetWidth;
          parentHeight = parentRef.current.offsetHeight;
        } else {
          parentWidth = parentRef.current.offsetHeight;
          parentHeight = parentRef.current.offsetWidth;
        }
        if (parentWidth < parentHeight / 1.4) {
          boardRef.current.style.width = parentWidth * 0.9 + 'px';
          boardRef.current.style.height =
            boardRef.current.offsetWidth * 1.4 + 'px';
        } else if (parentWidth > parentHeight / 1.4) {
          boardRef.current.style.height = (parentHeight - 64) * 0.9 + 'px';
          boardRef.current.style.width =
            boardRef.current.offsetHeight / 1.4 + 'px';
        }
      }
    };
    resizeBoard();
    const resizeText = () => {
      if (boardRef.current && text0Ref.current && text1Ref.current) {
        text0Ref.current.style.height = boardRef.current.offsetWidth/2 + 'px';
        text0Ref.current.style.width = boardRef.current.offsetHeight/2 + 'px';
        text0Ref.current.style.fontSize =  (boardRef.current.offsetWidth/2 +  boardRef.current.offsetHeight/2)/50 + 'px'
        text1Ref.current.style.height = boardRef.current.offsetWidth/2 + 'px';
        text1Ref.current.style.width = boardRef.current.offsetHeight/2 + 'px';
        text1Ref.current.style.fontSize = (boardRef.current.offsetWidth/2 +  boardRef.current.offsetHeight/2)/50 + 'px'

      }

    };
    resizeBoard();
    resizeText();
    window.addEventListener('resize', () => {
      resizeBoard();
      resizeText();
    });
    return () => {
      window.removeEventListener('resize', () => {
        resizeBoard();
        resizeText();
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardRef.current, parentRef.current, isRotated]);

  return (
    <div
      onMouseMove={mouseHandler}
      onTouchMove={touchHandler}
      ref={boardRef}
      className="relative w-full rounded-[3%] bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('../game/GameBoard.svg')",
        backgroundSize: '100%',
        rotate: position === 'Top' ? '180deg' : '0deg',
      }}
    >
      {isRotated && (
       <Description  text0Ref={text0Ref} text1Ref={text1Ref}/>
      )}
      {React.Children.map(children, (child) => {
        return React.cloneElement(child as React.ReactElement, {
          boardRef: boardRef,
        });
      })}
    </div>
  );
};

export default Board;
