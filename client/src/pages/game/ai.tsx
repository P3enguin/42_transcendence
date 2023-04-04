import Pong from '@/components/game/Pong';
import PongAi from '@/components/game/PongAi';
import Layout from '@/components/layout/layout';
import Head from 'next/head';
import React, { useRef } from 'react';

const Ai = () => {
  const gameRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <Head>
        <title>Ponginator | Play with AI</title>
      </Head>
      <div
        className="flex h-full w-full flex-col items-center justify-around"
        ref={gameRef}
      >
        <div>Play with Ai</div>
        <PongAi gameRef={gameRef}/>
      </div>
    </>
  );
};

Ai.getLayout = function getLayout(page: React.ReactNode) {
  return <Layout>{page}</Layout>;
};

export default Ai;
