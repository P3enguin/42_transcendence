import React, { useEffect } from 'react';

interface ballProps {
  boardRef?: React.RefObject<HTMLDivElement>;
}

const Ball = ({ boardRef }: ballProps) => {
  const ballRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const resizeBall = () => {
      if (ballRef.current && boardRef && boardRef.current) {
        ballRef.current.style.width = boardRef.current?.offsetWidth / 35 + 'px';
        ballRef.current.style.height = ballRef.current.offsetWidth + 'px';
      }
    };
    resizeBall();
    window.addEventListener('resize', resizeBall);

    return () => {
      window.removeEventListener('resize', resizeBall);
    };
  }, []);

  return (
    <div
      ref={ballRef}
      className="relative bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('../game/Ball.svg')",
        backgroundSize: '100%',
        top: '50%',
        left: '70%',
        transform: 'translate(50%, 50%)',
      }}
    ></div>
  );
};

export default Ball;
