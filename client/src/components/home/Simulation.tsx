import React from 'react';
import PongAi from '../game/PongAi';

const Simulation = ({ gameRef,isRotated,isContact }: any) => {
  return <PongAi gameRef={gameRef} isRotated={isRotated} isSimulation={true} isContact={isContact} newScore={() => {}} />;
};

export default Simulation;
