import Pong from '@/components/game/Pong';
import PongAi from '@/components/game/PongAi';
import ScoreBoard from '@/components/game/ScoreBoard';
import Layout from '@/components/layout/layout';
import Head from 'next/head';
import NextApiRequest from 'next';
import { use, useEffect, useRef, useState } from 'react';
import { verifyToken } from '@/components/VerifyToken';
import axios from 'axios';

const Ai = ({ player }: any) => {
  const gameRef = useRef<HTMLDivElement>(null);
  const [AIScore, setAIScore] = useState<number>(0);
  const [PlayerScore, setPlayerScore] = useState<number>(0);
  const [gameOn, setGameOn] = useState<boolean>(true);
  const [gamePaused, setGamePaused] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => {
      setGamePaused(false);
    }, 1000);
  }, []);

  const newScore = (player: string, score: number) => {
    let interval: NodeJS.Timeout;
    if (player === 'AI') {
      setAIScore(score);
      setGamePaused(true);
      interval = setTimeout(() => {
        setGamePaused(false);
      }, 1000);
    } else {
      setGamePaused(true);
      interval = setTimeout(() => {
        setGamePaused(false);
      }, 1000);
      setPlayerScore(score);
    }
    if (score === 5) {
      clearInterval(interval);
      setGameOn(false);
      setGamePaused(true);
    }
  };

  return (
    <>
      <Head>
        <title>Ponginator | Play with AI</title>
      </Head>
      <div
        className="flex h-full w-full flex-col items-center justify-start pt-3 md:pt-32"
        ref={gameRef}
      >
        <ScoreBoard
          player1={{
            nickname: player.nickname,
            avatar: player.avatar,
            score: PlayerScore,
          }}
          player2={{
            nickname: 'Ponginator-v2',
            avatar: 'Ponginator-v2.png',
            score: AIScore,
          }}
          gameOn={gameOn}
        />
        {gameOn && (<PongAi
          gameRef={gameRef}
          newScore={newScore}
          isSimulation={false}
          isContact={false}
          isRotated={false}
          gamePaused={gamePaused}
        />)}
      </div>
    </>
  );
};

export async function getServerSideProps({ req }: NextApiRequest) {
  const jwt_token = req.cookies['jwt_token'];

  if (jwt_token) {
    const res = await verifyToken(req.headers.cookie);
    if (res.ok) {
      const player = await res.json();
      console.log(player);
      return {
        props: {
          player,
          jwt_token: jwt_token,
        },
      };
    }
  }
  return {
    redirect: {
      destination: '/',
      permanent: true,
    },
  };
}

Ai.getLayout = function getLayout(page: React.ReactNode) {
  return <Layout>{page}</Layout>;
};

export default Ai;
