
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface MazeOfNoiseProps {
  onContinue: () => void;
  avatarType: 'overthinker' | 'peoplepleaser' | 'bottledup' | 'tryingagain' | 'lost' | null;
}

const negativePhrases = [
  "Why are you always so emotional?",
  "You talk too much.",
  "You're too old for this.",
  "You're too sensitive.",
  "Nobody cares about your problems.",
  "Just be positive!",
  "Stop complaining.",
  "You should be over this by now."
];

const avatarSpecificPhrases = {
  overthinker: [
    "Stop overthinking everything!",
    "Just make a decision already.",
    "Why can't you just go with the flow?"
  ],
  peoplepleaser: [
    "You need to learn to say no.",
    "Stop being such a doormat.",
    "Do you ever think about yourself?"
  ],
  bottledup: [
    "You need to open up more.",
    "Why can't you just talk about your feelings?",
    "What's wrong with you?"
  ],
  tryingagain: [
    "You'll just fail again.",
    "Why bother trying?",
    "Haven't you learned your lesson yet?"
  ],
  lost: [
    "Figure it out already.",
    "Everyone else knows what they're doing.",
    "You're falling behind."
  ]
};

const MazeOfNoise = ({ onContinue, avatarType }: MazeOfNoiseProps) => {
  const [step, setStep] = useState(1);
  const [showDoor, setShowDoor] = useState(false);
  
  // Combine general and avatar-specific phrases
  const allPhrases = [
    ...negativePhrases,
    ...(avatarType && avatarType !== 'lost' ? avatarSpecificPhrases[avatarType] : [])
  ];
  
  useEffect(() => {
    // Progress through the steps automatically
    const stepTimer = setTimeout(() => {
      if (step < 3) {
        setStep(step + 1);
      } else {
        setShowDoor(true);
      }
    }, 3500);
    
    return () => clearTimeout(stepTimer);
  }, [step]);
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen w-full bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col items-center justify-center text-white relative overflow-hidden"
    >
      {/* Background noise elements */}
      <div className="absolute inset-0 pointer-events-none">
        {allPhrases.map((phrase, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: 0
            }}
            animate={{ 
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: [0, 0.7, 0],
              scale: [0.8, 1, 0.9]
            }}
            transition={{ 
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              repeatType: "loop",
              delay: Math.random() * 2
            }}
            className="absolute text-gray-400 text-sm md:text-base font-light"
          >
            {phrase}
          </motion.div>
        ))}
      </div>
      
      {/* Main content */}
      <div className="z-10 w-full max-w-xl p-8 text-center">
        {step === 1 && (
          <motion.h2
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-2xl md:text-3xl mb-6"
          >
            You enter the world again. But it's all... noise.
          </motion.h2>
        )}
        
        {step === 2 && (
          <motion.div
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mb-8"
          >
            <p className="text-lg md:text-xl mb-6">
              Social media feeds scroll endlessly.
            </p>
            <p className="text-lg md:text-xl">
              Fake smiles. "Be positive!" "Fix your vibe!" "Get over it!"
            </p>
          </motion.div>
        )}
        
        {step === 3 && (
          <motion.p
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-lg md:text-xl"
          >
            The voices are everywhere. They tell you who you should be, not who you are.
          </motion.p>
        )}
        
        {/* Door to the next scene */}
        {showDoor && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="mt-12 flex flex-col items-center"
          >
            <Button
              onClick={onContinue}
              className="rounded-full h-24 w-24 mb-4 bg-white text-black flex items-center justify-center animate-pulse-glow"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="text-4xl"
              >
                🔓
              </motion.div>
            </Button>
            <p>Click the door to enter <span className="text-unmute-purple font-medium">Unmute</span></p>
          </motion.div>
        )}
      </div>
      
      {/* Visual noise effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-40 pointer-events-none" />
    </motion.div>
  );
};

export default MazeOfNoise;
