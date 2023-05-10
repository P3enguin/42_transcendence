import Description from '../home/Description';
import Contact from '../home/Contact';
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
  isContact: boolean;
}

const Board = ({
  position,
  children,
  parentRef,
  boardRef,
  mouseHandler,
  touchHandler,
  isRotated,
  isContact,
}: BoardProps) => {
  const text0Ref = useRef<HTMLDivElement>(null);
  const text1Ref = useRef<HTMLDivElement>(null);

  const contact1Ref = useRef<HTMLDivElement>(null);
  const contact2Ref = useRef<HTMLDivElement>(null);
  const contact3Ref = useRef<HTMLDivElement>(null);
  const contact4Ref = useRef<HTMLDivElement>(null);

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
          boardRef.current.style.width = parentWidth * 0.8 + 'px';
          boardRef.current.style.height =
            boardRef.current.offsetWidth * 1.4 + 'px';
        } else if (parentWidth > parentHeight / 1.4) {
          boardRef.current.style.height = (parentHeight - 64) * 0.8 + 'px';
          boardRef.current.style.width =
            boardRef.current.offsetHeight / 1.4 + 'px';
        }
      }
    };
    const resizeText = () => {
      if (boardRef.current && text0Ref.current && text1Ref.current) {
        text0Ref.current.style.height = boardRef.current.offsetWidth / 2 + 'px';
        text0Ref.current.style.width = boardRef.current.offsetHeight / 2 + 'px';
        text0Ref.current.style.fontSize =
          (boardRef.current.offsetWidth / 2 +
            boardRef.current.offsetHeight / 2) /
            50 +
          'px';
        text1Ref.current.style.height = boardRef.current.offsetWidth / 2 + 'px';
        text1Ref.current.style.width = boardRef.current.offsetHeight / 2 + 'px';
        text1Ref.current.style.fontSize =
          (boardRef.current.offsetWidth / 2 +
            boardRef.current.offsetHeight / 2) /
            50 +
          'px';
      }
    };

    const resizeContact = () => {
      if (
        boardRef.current &&
        contact1Ref.current &&
        contact2Ref.current &&
        contact3Ref.current &&
        contact4Ref.current
      ) {
        contact1Ref.current.style.height =
          boardRef.current.offsetWidth / 2 + 'px';
        contact1Ref.current.style.width =
          boardRef.current.offsetHeight / 2 + 'px';

        contact2Ref.current.style.height =
          boardRef.current.offsetWidth / 2 + 'px';
        contact2Ref.current.style.width =
          boardRef.current.offsetHeight / 2 + 'px';

        contact3Ref.current.style.height =
          boardRef.current.offsetWidth / 2 + 'px';
        contact3Ref.current.style.width =
          boardRef.current.offsetHeight / 2 + 'px';

        contact4Ref.current.style.height =
          boardRef.current.offsetWidth / 2 + 'px';
        contact4Ref.current.style.width =
          boardRef.current.offsetHeight / 2 + 'px';
      }
    };

    resizeBoard();
    resizeText();
    resizeContact();
    window.addEventListener('resize', () => {
      resizeBoard();
      resizeText();
      resizeContact();
    });
    return () => {
      window.removeEventListener('resize', () => {
        resizeBoard();
        resizeText();
        resizeContact();
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardRef.current, parentRef.current, parentRef, isRotated, isContact]);

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
      {isRotated && !isContact && (
        <Description text0Ref={text0Ref} text1Ref={text1Ref} />
      )}
      {isRotated && isContact && (
        <Contact
          contact1Ref={contact1Ref}
          contact2Ref={contact2Ref}
          contact3Ref={contact3Ref}
          contact4Ref={contact4Ref}
        />
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
