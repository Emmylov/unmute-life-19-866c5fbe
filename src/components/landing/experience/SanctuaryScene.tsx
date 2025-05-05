
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface SanctuarySceneProps {
  onContinue: () => void;
  avatarType: 'overthinker' | 'peoplepleaser' | 'bottledup' | 'tryingagain' | 'lost' | null;
}

// Different feature descriptions based on avatar type
const featuresByAvatar = {
  overthinker: [
    { icon: '🎧', title: 'Audio Diaries', description: 'Process your thoughts out loud without judgment' },
    { icon: '🧘', title: 'Mindful Moments', description: 'Learn to quiet your racing thoughts' },
    { icon: '🤝', title: 'Overthinkers Community', description: 'Connect with others who understand' }
  ],
  peoplepleaser: [
    { icon: '🛡️', title: 'Boundary Setting', description: 'Learn to say no without guilt' },
    { icon: '💬', title: 'Voice Journals', description: 'Speak your truth in a safe space' },
    { icon: '🧩', title: 'Self-Priority Rooms', description: 'Put yourself first for once' }
  ],
  bottledup: [
    { icon: '🎭', title: 'Expression Space', description: 'Release what you've been holding in' },
    { icon: '🔥', title: 'Anger Room', description: 'Safely express bottled emotions' },
    { icon: '🗣️', title: 'Voice Notes', description: 'Say it out loud when words are hard' }
  ],
  tryingagain: [
    { icon: '📈', title: 'Growth Tracker', description: 'Celebrate small wins on your journey' },
    { icon: '🌱', title: 'New Beginning Community', description: 'Connect with others rising again' },
    { icon: '🗺️', title: 'Path Forward', description: 'Map your healing journey' }
  ],
  lost: [
    { icon: '🧭', title: 'Finding Direction', description: 'Explore possibilities without pressure' },
    { icon: '👋', title: 'Welcome Circle', description: 'Find your people, one conversation at a time' },
    { icon: '📝', title: 'Discovery Journal', description: 'Track what resonates and what doesn't' }
  ]
};

const defaultFeatures = [
  { icon: '🎙️', title: 'Audio Diaries', description: 'Express yourself through voice' },
  { icon: '👥', title: 'Community Circles', description: 'Find your people' },
  { icon: '🧠', title: 'Healing Spaces', description: 'Journey toward wellbeing' }
];

const SanctuaryScene = ({ onContinue, avatarType }: SanctuarySceneProps) => {
  const [step, setStep] = useState(0);
  const [showButton, setShowButton] = useState(false);
  const features = avatarType ? featuresByAvatar[avatarType] : defaultFeatures;
  
  useEffect(() => {
    const introTimer = setTimeout(() => {
      setStep(1);
    }, 2000);
    
    const featuresTimer = setTimeout(() => {
      setStep(2);
    }, 4000);
    
    const buttonTimer = setTimeout(() => {
      setShowButton(true);
    }, 10000);
    
    return () => {
      clearTimeout(introTimer);
      clearTimeout(featuresTimer);
      clearTimeout(buttonTimer);
    };
  }, []);
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen w-full bg-gradient-to-br from-unmute-purple/30 to-unmute-pink/30 flex flex-col items-center justify-center text-white p-4 relative"
    >
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            animate={{
              x: [
                Math.random() * window.innerWidth,
                Math.random() * window.innerWidth,
              ],
              y: [
                Math.random() * window.innerHeight,
                Math.random() * window.innerHeight,
              ],
              opacity: [0.1, 0.3, 0.1],
              scale: [0.5, 0.8, 0.5]
            }}
            transition={{
              duration: 10 + Math.random() * 20,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute w-4 h-4 rounded-full bg-white/20"
          />
        ))}
      </div>
      
      <div className="w-full max-w-xl z-10">
        {/* Step 1: Introduction */}
        {step >= 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-4">The Sanctuary of Unmute</h1>
            <p className="text-lg md:text-xl">
              Welcome. This is Unmute — a sanctuary for real voices, raw stories, and radical belonging.
            </p>
          </motion.div>
        )}
        
        {/* Step 2: Features */}
        {step >= 2 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mb-12"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {features.map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + i * 0.2 }}
                  className="bg-white/10 backdrop-blur-lg rounded-lg p-6 text-center"
                >
                  <span className="text-4xl mb-3 block">{feature.icon}</span>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-200">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
        
        {/* Continue Button */}
        {showButton && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center"
          >
            <Button 
              onClick={onContinue}
              className="bg-white text-unmute-purple hover:bg-white/90 px-8 py-6 text-lg font-medium rounded-full"
            >
              Continue Your Journey
            </Button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default SanctuaryScene;
