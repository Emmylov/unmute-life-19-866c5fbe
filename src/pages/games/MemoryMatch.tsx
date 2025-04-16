
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AppLayout from '@/components/layout/AppLayout';
import MemoryGrid from '@/components/games/memory-match/MemoryGrid';
import GameHeader from '@/components/games/memory-match/GameHeader';
import { useToast } from '@/hooks/use-toast';
import SuccessConfetti from '@/components/content-creator/SuccessConfetti';
import { Button } from '@/components/ui/button';
import { Trophy, RefreshCw } from 'lucide-react';

const MemoryMatch = () => {
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const { toast } = useToast();
  
  const handleMatch = () => {
    setScore(prev => prev + 1);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 2000);
    
    // Show positive affirmation
    const affirmations = [
      "Amazing match! You're doing great! 🌟",
      "Wonderful job! Keep going! ✨",
      "You're crushing it! 🎯",
      "Perfect match! You're on fire! 🔥",
      "Brilliant move! Keep shining! ⭐"
    ];
    
    toast({
      title: affirmations[Math.floor(Math.random() * affirmations.length)],
      duration: 2000,
    });
  };

  const handleMove = () => {
    setMoves(prev => prev + 1);
  };
  
  const handleGameComplete = () => {
    setGameComplete(true);
    setShowConfetti(true);
    
    toast({
      title: "🎉 Congratulations! You've completed the game! 🎉",
      description: `You finished with ${moves} moves!`,
      duration: 5000,
    });
  };
  
  const resetGame = () => {
    setScore(0);
    setMoves(0);
    setGameComplete(false);
    setShowConfetti(false);
  };

  return (
    <AppLayout pageTitle="Memory Match">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <GameHeader score={score} moves={moves} />
          <MemoryGrid onMatch={handleMatch} onMove={handleMove} onGameComplete={handleGameComplete} />
          
          {gameComplete && (
            <motion.div 
              className="mt-8 p-6 bg-primary/10 rounded-xl text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Game Complete!</h2>
              <p className="mb-4">You finished with {moves} moves and found all {score} pairs!</p>
              <Button 
                onClick={resetGame} 
                className="bg-primary hover:bg-primary/90"
                size="lg"
              >
                <RefreshCw className="w-4 h-4 mr-2" /> Play Again
              </Button>
            </motion.div>
          )}
          
          {showConfetti && <SuccessConfetti />}
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default MemoryMatch;
