import Pong from '@/components/game/Pong';
import PongAi from '@/components/game/PongAi';
import ScoreBoard from '@/components/game/ScoreBoard';
import Layout from '@/components/layout/layout';
import Head from 'next/head';
import { useRef, useState } from 'react';

const Ai = () => {
  const gameRef = useRef<HTMLDivElement>(null);
  const [AIScore, setAIScore] = useState<number>(0);
  const [PlayerScore, setPlayerScore] = useState<number>(0);


  const newScore = (player:string) => {
    if(player === 'AI'){
      setAIScore(AIScore + 1)
    }else{
      setPlayerScore(PlayerScore + 1)
    }
  }

  return (
    <>
      <Head>
        <title>Ponginator | Play with AI</title>
      </Head>
      <div
        className="flex h-full w-full flex-col items-center justify-around"
        ref={gameRef}
      >
        {/* <div>Play with Ai</div> */}
        <ScoreBoard
          P1="Player"
          P1Score={PlayerScore}
          P2="AI"
          P2Score={AIScore}
        />
        <PongAi gameRef={gameRef} newScore={newScore} />
      </div>
    </>
  );
};

Ai.getLayout = function getLayout(page: React.ReactNode) {
  return <Layout>{page}</Layout>;
};

export default Ai;
