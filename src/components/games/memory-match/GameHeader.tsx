
import React from 'react';
import { Trophy, MoveHorizontal } from 'lucide-react';

interface GameHeaderProps {
  score: number;
  moves: number;
}

const GameHeader = ({ score, moves }: GameHeaderProps) => {
  return (
    <div className="flex flex-col items-center space-y-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Memory Match</h1>
      <p className="text-gray-600 mb-6">Match the pairs and boost your mood!</p>
      
      <div className="flex gap-8">
        <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-lg">
          <Trophy className="w-5 h-5 text-primary" />
          <span className="font-medium">Score: {score}</span>
        </div>
        <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-lg">
          <MoveHorizontal className="w-5 h-5 text-primary" />
          <span className="font-medium">Moves: {moves}</span>
        </div>
      </div>
    </div>
  );
};

export default GameHeader;
