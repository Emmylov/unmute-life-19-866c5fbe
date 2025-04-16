
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AppLayout from '@/components/layout/AppLayout';
import { useToast } from '@/hooks/use-toast';
import SuccessConfetti from '@/components/content-creator/SuccessConfetti';

const AFFIRMATIONS = [
  "You are amazing!",
  "You've got this!",
  "You are enough!",
  "You make a difference!",
  "You are strong!",
  "Believe in yourself!",
  "You are worthy!",
  "You are capable!",
  "You are loved!",
  "You are resilient!",
  "Keep growing!",
  "Embrace today!",
  "You matter!",
  "Stay positive!",
  "Trust yourself!"
];

const COLORS = [
  'bg-pink-400',
  'bg-purple-400',
  'bg-blue-400',
  'bg-green-400',
  'bg-yellow-400',
  'bg-orange-400',
  'bg-red-400',
  'bg-indigo-400',
  'bg-teal-400',
];

interface Bubble {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  text: string;
}

const BubblePop = () => {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isGameActive, setIsGameActive] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const { toast } = useToast();

  // Generate a random bubble
  const generateBubble = () => {
    const id = Date.now();
    const x = Math.random() * 80 + 5; // Keep away from edges (5-85%)
    const y = Math.random() * 50 + 20; // Keep in middle section (20-70%)
    const size = Math.random() * 40 + 60; // Size between 60-100px
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    const text = AFFIRMATIONS[Math.floor(Math.random() * AFFIRMATIONS.length)];
    
    return { id, x, y, size, color, text };
  };

  // Add a new bubble
  const addBubble = () => {
    if (isGameActive) {
      setBubbles(prevBubbles => [...prevBubbles, generateBubble()]);
    }
  };

  // Pop a bubble
  const popBubble = (id: number, text: string) => {
    setBubbles(prevBubbles => prevBubbles.filter(bubble => bubble.id !== id));
    setScore(prevScore => prevScore + 1);
    
    // Show the affirmation as toast
    toast({
      title: text,
      duration: 2000,
    });
    
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 500);
  };

  // Start the game
  const startGame = () => {
    setIsGameActive(true);
    setScore(0);
    setTimeLeft(60);
    setBubbles([]);
  };

  // End the game
  const endGame = () => {
    setIsGameActive(false);
    toast({
      title: "Game Over!",
      description: `Your final score: ${score}`,
      duration: 4000,
    });
    
    if (score > 0) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
    }
  };

  // Game timer
  useEffect(() => {
    if (!isGameActive) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timer);
          endGame();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isGameActive]);

  // Add bubbles periodically
  useEffect(() => {
    if (!isGameActive) return;
    
    const bubbleInterval = setInterval(addBubble, 1500);
    return () => clearInterval(bubbleInterval);
  }, [isGameActive]);

  return (
    <AppLayout pageTitle="Bubble Pop">
      <div className="relative h-screen max-h-[calc(100vh-80px)]">
        {!isGameActive ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div 
              className="bg-primary/10 rounded-xl p-8 text-center max-w-md mx-auto"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <h1 className="text-3xl font-bold mb-4">Bubble Pop</h1>
              <p className="mb-6">Pop bubbles filled with positive affirmations to boost your mood! How many can you pop in 60 seconds?</p>
              
              {score > 0 && (
                <p className="mb-6 text-lg">Previous score: <span className="font-bold">{score}</span></p>
              )}
              
              <motion.button
                className="px-6 py-3 bg-primary text-white rounded-full font-medium text-lg shadow-md"
                onClick={startGame}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {score > 0 ? 'Play Again' : 'Start Game'}
              </motion.button>
            </motion.div>
          </div>
        ) : (
          <>
            <div className="absolute top-4 left-4 right-4 flex justify-between">
              <div className="bg-white/80 backdrop-blur px-4 py-2 rounded-full shadow-md">
                <p className="font-bold">Score: {score}</p>
              </div>
              <div className="bg-white/80 backdrop-blur px-4 py-2 rounded-full shadow-md">
                <p className="font-bold">Time: {timeLeft}s</p>
              </div>
            </div>
            
            <AnimatePresence>
              {bubbles.map(bubble => (
                <motion.div
                  key={bubble.id}
                  className={`absolute rounded-full cursor-pointer flex items-center justify-center p-3 text-center text-white font-medium shadow-lg ${bubble.color}`}
                  style={{
                    left: `${bubble.x}%`,
                    top: `${bubble.y}%`,
                    width: `${bubble.size}px`,
                    height: `${bubble.size}px`,
                  }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  onClick={() => popBubble(bubble.id, bubble.text)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <span className="text-xs sm:text-sm">{bubble.text}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </>
        )}
        
        {showConfetti && <SuccessConfetti />}
      </div>
    </AppLayout>
  );
};

export default BubblePop;
