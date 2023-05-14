import Pong from '@/components/game/Pong';
import PongAi from '@/components/game/PongAi';
import ScoreBoard from '@/components/game/ScoreBoard';
import Layout from '@/components/layout/layout';
import Head from 'next/head';
import NextApiRequest from 'next';
import { useRef, useState } from 'react';
import { verifyToken } from '@/components/VerifyToken';
import axios from 'axios';

const Ai = () => {
  const gameRef = useRef<HTMLDivElement>(null);
  const [AIScore, setAIScore] = useState<number>(0);
  const [PlayerScore, setPlayerScore] = useState<number>(0);

  const newScore = (player: string) => {
    if (player === 'AI') {
      setAIScore(AIScore + 1);
    } else {
      setPlayerScore(PlayerScore + 1);
    }
  };

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
          player1="Player"
          player1Score={PlayerScore}
          player2="AI"
          player2Score={AIScore}
        />
        <PongAi
          gameRef={gameRef}
          newScore={newScore}
          isSimulation={true}
          isContact={false}
          isRotated={false}
        />
      </div>
    </>
  );
};

// export async function getServerSideProps({ req }: NextApiRequest) {
//   const jwt_token = req.cookies['jwt_token'];

//   if (jwt_token) {
//     const res = await verifyToken(req.headers.cookie);
//     if (res.ok) {
//       return {
//         props: {
//           jwt_token: jwt_token,
//         },
//       };
//     }
//   }
//   return {
//     redirect: {
//       destination: '/',
//       permanent: true,
//     },
//   };
// }

Ai.getLayout = function getLayout(page: React.ReactNode) {
  return <Layout>{page}</Layout>;
};

export default Ai;
