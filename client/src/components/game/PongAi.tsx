import Board from './Board';
import PaddleAi from './PaddleAi';
import BallAi from './BallAi';
import {
  MouseEventHandler,
  TouchEventHandler,
  use,
  useEffect,
  useRef,
  useState,
} from 'react';

//CONSTANTS AND VARIABLES
const BOARD_WIDTH = 700;
const BOARD_HEIGHT = BOARD_WIDTH * 1.4;
const BOARD_OFFSET = 5;
const PADDLE_OFFSET = 10;
const PADDLE_WIDTH = BOARD_WIDTH / 8;
const PADDLE_HEIGHT = PADDLE_WIDTH / 5;
const BALL_DIAMETER = PADDLE_HEIGHT;
const BALL_RADIUS = BALL_DIAMETER / 2;
const angleRad = Math.PI / 4; // 45 degrees
let newBallX: number;
let newBallY: number;
let GAME_INTERVAL: NodeJS.Timeout;
let P0Score: number = 0;
let P1Score: number = 0;

interface PongAiProps {
  gameRef: React.RefObject<HTMLDivElement>;
  newScore: (player: string, score: number) => void;
  isSimulation: boolean;
  isRotated: boolean;
  isContact: boolean;
  gamePaused: boolean;
}

const PongAi = ({
  gameRef,
  newScore,
  isSimulation,
  isRotated,
  isContact,
  gamePaused,
}: PongAiProps) => {
  //SOUNDS
  const HitRef = useRef<HTMLAudioElement>(null);
  const WallRef = useRef<HTMLAudioElement>(null);
  const ComScoreRef = useRef<HTMLAudioElement>(null);
  const UserScoreRef = useRef<HTMLAudioElement>(null);

  //STATE
  const boardRef = useRef<HTMLDivElement>(null);
  const ballRef = useRef<HTMLDivElement>(null);
  const [ballPosition, setBallPosition] = useState({
    x: BOARD_WIDTH / 2,
    y: BOARD_HEIGHT / 2,
  });
  let [ballSpeed, setBallSpeed] = useState(10);
  const [ballVelocity, setBallVelocity] = useState({
    x: ballSpeed * Math.sin(angleRad),
    y: ballSpeed * Math.cos(angleRad),
  });
  const [Paddle0Position, setPaddle0Position] = useState({
    x: 350 - PADDLE_WIDTH / 2,
    y: BOARD_HEIGHT - PADDLE_OFFSET - PADDLE_HEIGHT,
  });
  const [Paddle1Position, setPaddle1Position] = useState({
    x: 350 - PADDLE_WIDTH / 2,
    y: PADDLE_OFFSET,
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
      setPaddle0Position((prev) => ({ x: mousePosition, y: prev.y }));
    }
  };

  const handleTouchMove: TouchEventHandler<HTMLDivElement> = (e) => {
    if (boardRef.current && !isSimulation) {
      const rec = boardRef.current.getBoundingClientRect();
      const touchPosition =
        (700 * (e.touches[0].clientX - rec.left)) /
          boardRef.current.offsetWidth -
        PADDLE_WIDTH / 2;
      if (touchPosition < 0 || touchPosition > 700 - PADDLE_WIDTH) return;
      setPaddle0Position((prev) => ({ x: touchPosition, y: prev.y }));
    }
  };

  function chaseBall() {
    if (ballVelocity.y < 0) {
      if (Paddle1Position.x < BOARD_OFFSET) {
        setPaddle1Position((prev) => ({ x: BOARD_OFFSET, y: prev.y }));
        return;
      } else if (
        Paddle1Position.x >
        BOARD_WIDTH - PADDLE_WIDTH - BOARD_OFFSET
      ) {
        setPaddle1Position((prev) => ({
          x: BOARD_WIDTH - PADDLE_WIDTH - BOARD_OFFSET,
          y: prev.y,
        }));
        return;
      }
      setPaddle1Position((prev) => ({
        x: prev.x + (newBallX - (prev.x + PADDLE_WIDTH / 2)) * 0.2,
        y: prev.y,
      }));
    }
    // FOR SECOND PADDLE 'BOTTOM'
    else if (ballVelocity.y > 0) {
      if (isSimulation) {
         if (Paddle0Position.x < BOARD_OFFSET) {
           setPaddle0Position((prev) => ({ x: BOARD_OFFSET, y: prev.y }));
           return;
         } else if (
           Paddle0Position.x >
           BOARD_WIDTH - PADDLE_WIDTH - BOARD_OFFSET
         ) {
           setPaddle0Position((prev) => ({
             x: BOARD_WIDTH - PADDLE_WIDTH - BOARD_OFFSET,
             y: prev.y,
           }));
           return;
         }
        setPaddle0Position((prev) => ({
          x: prev.x + (newBallX - (prev.x + PADDLE_WIDTH / 2)) * 0.2,
          y: prev.y,
        }));
      }
    }
  }

  const checkWallCollision = () => {
    // calculate the intersection point _x _y form y=mx+b
    if (newBallX - BALL_RADIUS <= BOARD_OFFSET) {
      const m = (newBallY - ballPosition.y) / (newBallX - ballPosition.x);
      const b = newBallY - m * newBallX;
      newBallX = BOARD_OFFSET + BALL_RADIUS;
      newBallY = m * newBallX + b;
      PlayAudio(WallRef);

      setBallVelocity((prev) => ({ x: Math.abs(prev.x), y: prev.y }));
    } else if (newBallX + BALL_RADIUS >= BOARD_WIDTH - BOARD_OFFSET) {
      const m = (newBallY - ballPosition.y) / (newBallX - ballPosition.x);
      const b = newBallY - m * newBallX;
      newBallX = BOARD_WIDTH - BOARD_OFFSET - BALL_RADIUS;
      newBallY = m * newBallX + b;
      PlayAudio(WallRef);
      setBallVelocity((prev) => ({ x: -Math.abs(prev.x), y: prev.y }));
    }
  };

  const isCollision = (paddlePos: { x: number; y: number }) => {
    PlayAudio(HitRef);
    let collidePoint = newBallX - (paddlePos.x + PADDLE_WIDTH / 2);
    collidePoint = collidePoint / (PADDLE_WIDTH / 2);
    const angle = collidePoint * angleRad;
    let direction = newBallY < BOARD_HEIGHT / 2 ? 1 : -1;
    setBallSpeed((prev) => prev + 0.3);
    setBallVelocity({
      x: ballSpeed * Math.sin(angle),
      y: direction * ballSpeed * Math.cos(angle),
    });
  };

  const checkPaddleCollision = () => {
    // fix ball position with y = mx + b
    if (newBallY + BALL_RADIUS >= Paddle0Position.y) {
      if (
        newBallX + BALL_RADIUS >= Paddle0Position.x - BALL_RADIUS &&
        newBallX - BALL_RADIUS <= Paddle0Position.x + PADDLE_WIDTH + BALL_RADIUS
      ) {
        if (newBallX !== ballPosition.x) {
          // Ball direction is vetical so m is infinity
          const m = (newBallY - ballPosition.y) / (newBallX - ballPosition.x);
          const b = newBallY - m * newBallX;
          newBallY = Paddle0Position.y - BALL_RADIUS;
          newBallX = (newBallY - b) / m;
        } else newBallY = Paddle0Position.y - BALL_RADIUS;
        isCollision(Paddle0Position);
      }
      return;
    }
    if (newBallY - BALL_RADIUS <= Paddle1Position.y + PADDLE_HEIGHT) {
      if (
        newBallX + BALL_RADIUS >= Paddle1Position.x - BALL_RADIUS &&
        newBallX - BALL_RADIUS <= Paddle1Position.x + PADDLE_WIDTH + BALL_RADIUS
      ) {
        if (newBallX !== ballPosition.x) {
          // Ball direction is vetical so m is infinity
          const m = (newBallY - ballPosition.y) / (newBallX - ballPosition.x);
          const b = newBallY - m * newBallX;
          newBallY = Paddle1Position.y + PADDLE_HEIGHT + BALL_RADIUS;
          newBallX = (newBallY - b) / m;
        } else newBallY = Paddle1Position.y + PADDLE_HEIGHT + BALL_RADIUS;
        isCollision(Paddle1Position);
      }
      return;
    }
  };

  const checkNewScore = () => {
    if (newBallY - BALL_RADIUS <= BOARD_OFFSET) {
      P0Score++;
      setBallSpeed(10);
      newScore('Player', P0Score);
      PlayAudio(UserScoreRef);
      resetBall();
    }
    if (newBallY + BALL_RADIUS >= BOARD_HEIGHT - BOARD_OFFSET) {
      P1Score++;
      setBallSpeed(10);
      PlayAudio(ComScoreRef);
      newScore('AI', P1Score);
      resetBall();
    }
  };

  const resetBall = () => {
    // newBallX = BOARD_WIDTH / 2;
    newBallY = BOARD_HEIGHT / 2;
    let direction = ballVelocity.y < 0 ? 1 : -1;
    ballSpeed = 10;
    setBallSpeed(10);
    setBallVelocity({
      x: ballSpeed * Math.sin(angleRad),
      y: direction * ballSpeed * Math.cos(angleRad),
    });
  };

  const gameUpdate = () => {
    newBallX = ballPosition.x + ballVelocity.x;
    newBallY = ballPosition.y + ballVelocity.y;

    chaseBall();
    checkWallCollision();
    checkPaddleCollision();
    checkNewScore();
    setBallPosition({ x: newBallX, y: newBallY });
  };

  useEffect(() => {
    P0Score = 0;
    P1Score = 0;
  }, []);

  useEffect(() => {
    if (!gamePaused) {
      GAME_INTERVAL = setInterval(gameUpdate, 1000 / 60);
    }

    return () => {
      clearInterval(GAME_INTERVAL);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ballPosition, ballVelocity, gamePaused, ballSpeed]);

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
        isRotated={isRotated}
        isContact={isContact}
      >
        <PaddleAi position={Paddle1Position} boardRef={boardRef} />
        <BallAi position={ballPosition} ballRef={ballRef} />
        <PaddleAi position={Paddle0Position} boardRef={boardRef} />
      </Board>
    </>
  );
};

export default PongAi;
