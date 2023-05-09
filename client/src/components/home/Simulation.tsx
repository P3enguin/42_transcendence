import React from 'react';
import PongAi from '../game/PongAi';

const Simulation = ({ gameRef }: any) => {
  return <PongAi gameRef={gameRef} isSimulation={true} newScore={() => {}} />;
};

export default Simulation;
