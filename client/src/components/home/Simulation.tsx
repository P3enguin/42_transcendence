import React from 'react';
import PongAi from '../game/PongAi';

const Simulation = ({ gameRef,isRotated }: any) => {
  return <PongAi gameRef={gameRef} isRotated={isRotated} isSimulation={true} newScore={() => {}} />;
};

export default Simulation;
