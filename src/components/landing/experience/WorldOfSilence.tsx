
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface WorldOfSilenceProps {
  onContinue: () => void;
}

const WorldOfSilence = ({ onContinue }: WorldOfSilenceProps) => {
  const [showFirstLine, setShowFirstLine] = useState(false);
  const [showSecondLine, setShowSecondLine] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [heartbeatPlaying, setHeartbeatPlaying] = useState(false);
  
  useEffect(() => {
    // Play heartbeat sound
    const heartbeat = new Audio('/sounds/heartbeat.mp3');
    heartbeat.volume = 0.3;
    heartbeat.loop = true;
    
    const playPromise = heartbeat.play();
    
    if (playPromise !== undefined) {
      playPromise.then(() => {
        setHeartbeatPlaying(true);
      }).catch(error => {
        console.error("Audio play failed:", error);
      });
    }
    
    // Show first line after 2 seconds
    const firstLineTimeout = setTimeout(() => {
      setShowFirstLine(true);
    }, 2000);
    
    // Show second line after 5 seconds
    const secondLineTimeout = setTimeout(() => {
      setShowSecondLine(true);
    }, 5000);
    
    // Show button after 7 seconds
    const buttonTimeout = setTimeout(() => {
      setShowButton(true);
    }, 7000);
    
    return () => {
      clearTimeout(firstLineTimeout);
      clearTimeout(secondLineTimeout);
      clearTimeout(buttonTimeout);
      heartbeat.pause();
      heartbeat.currentTime = 0;
    };
  }, []);
  
  return (
    <div className="h-screen w-full bg-black flex flex-col items-center justify-center text-white">
      <div className="max-w-xl p-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={showFirstLine ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 1.5 }}
          className="mb-8 text-2xl md:text-3xl font-light"
        >
          "Once, I had a voice. It was loud. Too loud, they said."
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={showSecondLine ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 1.5 }}
          className="mb-12 text-2xl md:text-3xl font-light"
        >
          "Then one day, I muted myself."
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={showButton ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 1 }}
        >
          <Button 
            onClick={onContinue}
            className="bg-gradient-to-r from-unmute-purple to-unmute-pink text-white px-8 py-6 rounded-full text-lg animate-pulse-glow"
          >
            Continue Your Journey
          </Button>
        </motion.div>
      </div>
      
      {/* Heartbeat visual pulse */}
      {heartbeatPlaying && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: "loop"
            }}
            className="w-64 h-64 rounded-full bg-unmute-purple/20"
          />
        </div>
      )}
    </div>
  );
};

export default WorldOfSilence;
