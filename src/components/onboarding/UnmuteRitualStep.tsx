
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";

interface UnmuteRitualStepProps {
  onNext: () => void;
  onUpdateData: (data: any) => void;
  data: string;
}

const UnmuteRitualStep = ({ onNext, onUpdateData, data }: UnmuteRitualStepProps) => {
  const [reflection, setReflection] = useState(data || "");
  const [isBreathing, setIsBreathing] = useState(true);
  const [isFloatingAway, setIsFloatingAway] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    // Start with the breathing animation for a few seconds
    timerRef.current = setTimeout(() => {
      setIsBreathing(false);
      setShowPrompt(true);
    }, 5000);
    
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);
  
  const handleRelease = () => {
    if (reflection.trim()) {
      setIsFloatingAway(true);
      onUpdateData({ ritualReflection: reflection });
      
      // Move to next step after animation
      setTimeout(() => {
        onNext();
      }, 2000);
    }
  };
  
  return (
    <div className="flex flex-col flex-grow items-center justify-center p-6 text-center">
      <h2 className="text-3xl font-bold mb-4">Unmute Ritual</h2>
      
      <p className="text-lg text-gray-600 mb-8">
        Take a moment to ground yourself before we begin
      </p>
      
      {isBreathing && (
        <div className="mb-8">
          <motion.div
            animate={{ 
              scale: [1, 1.5, 1.5, 1, 1],
              opacity: [0.7, 1, 1, 0.7, 0.7]
            }}
            transition={{ 
              duration: 5, 
              ease: "easeInOut",
              times: [0, 0.25, 0.75, 1],
              repeat: Infinity
            }}
            className="w-32 h-32 bg-unmute-purple/20 rounded-full flex items-center justify-center"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1.2, 1, 1],
              }}
              transition={{ 
                duration: 5, 
                ease: "easeInOut",
                times: [0, 0.25, 0.75, 1],
                repeat: Infinity
              }}
              className="w-24 h-24 bg-unmute-purple/30 rounded-full flex items-center justify-center"
            >
              <div className="text-md text-gray-600">Breathe</div>
            </motion.div>
          </motion.div>
          <p className="text-sm text-gray-500 mt-4">
            Inhale... Exhale...
          </p>
        </div>
      )}
      
      {showPrompt && !isFloatingAway && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <p className="text-lg mb-4">What's something you're ready to let go of?</p>
          
          <Textarea
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            placeholder="Type here..."
            className="min-h-[100px] mb-6"
          />
          
          <Button
            onClick={handleRelease}
            className="unmute-primary-button"
            disabled={!reflection.trim()}
          >
            Release & Continue
          </Button>
        </motion.div>
      )}
      
      {isFloatingAway && (
        <motion.div
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: 0, y: -100 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="p-4 bg-white rounded-lg shadow-md mb-6"
        >
          <p className="text-gray-600">{reflection}</p>
        </motion.div>
      )}
    </div>
  );
};

export default UnmuteRitualStep;
