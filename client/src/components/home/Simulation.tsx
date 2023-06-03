import React from 'react';
import PongAi from '../game/PongAi';

const Simulation = ({ gameRef, isRotated, isContact }: any) => {
  return (
    <>
      <div className="">
        <PongAi
          gameRef={gameRef}
          isRotated={isRotated}
          isSimulation={true}
          isContact={isContact}
          newScore={() => {}}
        />
      </div>
    </>
  );
};

export default Simulation;
