
import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

interface FinalSceneProps {
  onContinue: () => void;
  avatarType: 'overthinker' | 'peoplepleaser' | 'bottledup' | 'tryingagain' | 'lost' | null;
  ageGroup: 'teens' | 'twenties' | 'thirties' | 'forties' | 'fiftyplus' | null;
}

const FinalScene = ({ onContinue, avatarType, ageGroup }: FinalSceneProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  useEffect(() => {
    // Trigger confetti after a delay
    const confettiTimer = setTimeout(() => {
      const colors = ['#9b87f5', '#f59bf1', '#87c9f5', '#FFD700', '#FF69B4'];
      
      confetti({
        particleCount: 100,
        spread: 100,
        origin: { y: 0.6 },
        colors: colors,
        shapes: ['circle', 'square'],
        scalar: 1.5
      });
    }, 1000);
    
    // Add glow animation to button
    if (buttonRef.current) {
      buttonRef.current.classList.add('animate-pulse-glow');
    }
    
    return () => clearTimeout(confettiTimer);
  }, []);
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen w-full bg-gradient-to-br from-unmute-purple/30 via-unmute-teal/20 to-unmute-pink/30 flex flex-col items-center justify-center text-white p-4 relative overflow-hidden"
    >
      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              scale: Math.random() * 0.5 + 0.5,
              opacity: 0
            }}
            animate={{
              y: [null, Math.random() * -200 - 100],
              opacity: [0, 0.7, 0],
              scale: [null, Math.random() * 0.3 + 0.8]
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              repeatType: "loop",
              delay: Math.random() * 5
            }}
            className={`absolute w-2 h-2 rounded-full bg-white/50`}
          />
        ))}
      </div>
      
      <div className="max-w-xl w-full z-10 text-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent">
            You're Ready
          </h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-xl mb-6"
          >
            This is where your journey of authentic expression begins.
          </motion.p>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="text-lg mb-12"
          >
            Let's build your space to reconnect with your voice.
          </motion.p>
        </motion.div>
        
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ 
            type: "spring", 
            stiffness: 50, 
            delay: 1.8 
          }}
          className="flex justify-center"
        >
          <Button
            ref={buttonRef}
            onClick={onContinue}
            className="px-10 py-7 text-xl bg-gradient-to-r from-unmute-purple via-unmute-coral to-unmute-pink text-white rounded-full transform transition-all hover:scale-105 shadow-lg"
          >
            <span className="mr-2">🌱</span> I'm Ready to Unmute
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default FinalScene;
