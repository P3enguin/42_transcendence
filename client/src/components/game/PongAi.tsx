import Board from './Board';
import PaddleAi from './PaddleAi';
import BallAi from './BallAi';
import {
  MouseEventHandler,
  TouchEventHandler,
  useEffect,
  useRef,
  useState,
} from 'react';
import Simulation from '../home/Simulation';

const BOARD_WIDHT = 700;
const BOARD_HEIGHT = BOARD_WIDHT * 1.4;
const PADDLE_OFFSET = 10;
const PADDLE_WIDTH = BOARD_WIDHT / 8;
const PADDLE_HEIGHT = PADDLE_WIDTH / 5;
const BALL_DIAMETER = PADDLE_HEIGHT;
const BALL_RADIUS = BALL_DIAMETER / 2;

interface PongAiProps {
  gameRef: React.RefObject<HTMLDivElement>;
  newScore: (player: string) => void;
  isSimulation: boolean;
}

const PongAi = ({ gameRef, newScore, isSimulation }: PongAiProps) => {
  const HitRef = useRef<HTMLAudioElement>(null);
  const WallRef = useRef<HTMLAudioElement>(null);
  const ComScoreRef = useRef<HTMLAudioElement>(null);
  const UserScoreRef = useRef<HTMLAudioElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const ballRef = useRef<HTMLDivElement>(null);
  const [ballPosition, setBallPosition] = useState({ x: 400, y: 565 });
  const [ballVelocity, setBallVelocity] = useState({ x: 1, y: -1 });
  const [ballSpeed, setBallSpeed] = useState(5);
  const [Paddle1Position, setPaddle1Position] = useState({
    x: 350,
    y: PADDLE_OFFSET,
  });
  const [Paddle2Position, setPaddle2Position] = useState({
    x: 350,
    y: BOARD_HEIGHT - PADDLE_OFFSET - PADDLE_HEIGHT,
  });

  const PlayAudio = (audio: React.RefObject<HTMLAudioElement>) => {
    if (audio.current && !isSimulation) {
      audio.current.play().catch(() => {});
    }
  };

  const handleMouseMove: MouseEventHandler<HTMLDivElement> = (e) => {
    if (boardRef.current && !isSimulation) {
      const rec = boardRef.current.getBoundingClientRect();
      const mousePosition =
        (700 * (e.clientX - rec.left)) / boardRef.current.offsetWidth -
        PADDLE_WIDTH / 2;
      if (mousePosition < 0 || mousePosition > 700 - PADDLE_WIDTH) return;
      setPaddle2Position((prev) => ({ x: mousePosition, y: prev.y }));
    }
  };

  const handleTouchMove: TouchEventHandler<HTMLDivElement> = (e) => {
    if (boardRef.current && !isSimulation) {
      const rec = boardRef.current.getBoundingClientRect();
      const touchPosition =
        (700 * (e.touches[0].clientX - rec.left)) /
          boardRef.current.offsetWidth -
        PADDLE_WIDTH / 2;
      if (
        touchPosition < 0 + PADDLE_WIDTH / 2 ||
        touchPosition > 700 - PADDLE_WIDTH / 2
      )
        return;
      // setPaddle2Position((prev) => ({ x: touchPosition, y: prev.y }));
    }
  };

  function resetBall() {
    console.log('GOOOOOOOAAAAALLLLLLL!!!');
    if (ballPosition.y > BOARD_HEIGHT / 2) {
      console.log(ballPosition, Paddle2Position);
      PlayAudio(ComScoreRef);
      newScore('AI');
    } else {
      console.log(ballPosition, Paddle1Position);
      PlayAudio(UserScoreRef);
      newScore('Player');
    }
    setBallPosition((prev) => ({ x: prev.x, y: BOARD_HEIGHT / 2 }));
  }

  function checkWallCollision() {
    if (
      ballPosition.x + ballVelocity.x <= 5 ||
      ballPosition.x + BALL_DIAMETER + ballVelocity.x >= 695
    ) {
      PlayAudio(WallRef);
      setBallVelocity((prev) => ({ x: -prev.x, y: prev.y }));
    }
    if (
      ballPosition.y + ballVelocity.y <= 5 ||
      ballPosition.y + BALL_DIAMETER + ballVelocity.y >= 975
    ) {
      // setBallVelocity((prev) => ({ x: prev.x, y: -prev.y }));
      resetBall();
    }
  }

  function checkPaddleCollision() {
    if (
      ballPosition.x + BALL_DIAMETER + ballVelocity.x >= Paddle2Position.x &&
      ballPosition.x + ballVelocity.x <= Paddle2Position.x + PADDLE_WIDTH
    ) {
      if (
        ballPosition.y + ballVelocity.y >=
        Paddle2Position.y - BALL_DIAMETER
      ) {
        PlayAudio(HitRef);
        setBallVelocity((prev) => ({ x: prev.x, y: Math.abs(prev.y) * -1 }));
      }
    }
    if (
      ballPosition.x + BALL_DIAMETER + ballVelocity.x >= Paddle1Position.x &&
      ballPosition.x + ballVelocity.x <= Paddle1Position.x + PADDLE_WIDTH
    ) {
      if (
        ballPosition.y + ballVelocity.y <=
        Paddle1Position.y + PADDLE_HEIGHT
      ) {
        PlayAudio(HitRef);
        setBallVelocity((prev) => ({ x: prev.x, y: Math.abs(prev.y) }));
      }
    }
  }

  function chaseBall() {
    if (ballVelocity.y < 0) {
      if (
        ballPosition.x > PADDLE_WIDTH / 2 - BALL_RADIUS &&
        ballPosition.x < BOARD_WIDHT - PADDLE_WIDTH / 2 - BALL_RADIUS
      ) {
        setPaddle1Position((prev) => ({
          x: prev.x + (ballPosition.x - (prev.x + PADDLE_WIDTH / 2)) * 0.05,
          y: prev.y,
        }));
      }
    }
    // FOR SECOND PADDLE 'BOTTOM'
    else {
      if (isSimulation) {
        if (
          ballPosition.x > PADDLE_WIDTH / 2 - BALL_RADIUS &&
          ballPosition.x < BOARD_WIDHT - PADDLE_WIDTH / 2 - BALL_RADIUS
        ) {
          setPaddle2Position((prev) => ({
            x: prev.x + (ballPosition.x - (prev.x + PADDLE_WIDTH / 2)) * 0.05,
            y: prev.y,
          }));
        }
      }
    }
  }

  useEffect(() => {
    // console.log(Paddle1Position.y + PADDLE_HEIGHT, ballPosition.y);

    const interval = setInterval(() => {
      setBallPosition((prev) => ({
        x: prev.x + ballVelocity.x,
        y: prev.y + ballVelocity.y,
      }));
      checkWallCollision();
      checkPaddleCollision();
      chaseBall();
    }, 1000 / 550);
    return () => {
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ballPosition, ballVelocity]);

  return (
    <>
      <audio src="../game/sounds/hit.mp3" ref={HitRef}></audio>
      <audio src="../game/sounds/wall.mp3" ref={WallRef}></audio>
      <audio src="../game/sounds/comScore.mp3" ref={ComScoreRef}></audio>
      <audio src="../game/sounds/userScore.mp3" ref={UserScoreRef}></audio>
      <Board
        position="Bottom"
        parentRef={gameRef}
        boardRef={boardRef}
        mouseHandler={handleMouseMove}
        touchHandler={handleTouchMove}
      >
        <PaddleAi position={Paddle1Position} boardRef={boardRef} />
        <BallAi position={ballPosition} ballRef={ballRef} />
        <PaddleAi position={Paddle2Position} boardRef={boardRef} />
      </Board>
    </>
  );
};

export default PongAi;
