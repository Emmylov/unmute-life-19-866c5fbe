
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AppLayout from '@/components/layout/AppLayout';
import MemoryGrid from '@/components/games/memory-match/MemoryGrid';
import GameHeader from '@/components/games/memory-match/GameHeader';
import { useToast } from '@/hooks/use-toast';
import SuccessConfetti from '@/components/content-creator/SuccessConfetti';

const MemoryMatch = () => {
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
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

  return (
    <AppLayout pageTitle="Memory Match">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <GameHeader score={score} moves={moves} />
          <MemoryGrid onMatch={handleMatch} onMove={handleMove} />
          {showConfetti && <SuccessConfetti />}
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default MemoryMatch;
