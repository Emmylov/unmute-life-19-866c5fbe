
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import confetti from 'canvas-confetti';

interface FinalWelcomeStepProps {
  onComplete: () => void;
}

const FinalWelcomeStep = ({ onComplete }: FinalWelcomeStepProps) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  
  useEffect(() => {
    setShowConfetti(true);
    
    if (typeof window !== "undefined") {
      const duration = 3 * 1000;
      const end = Date.now() + duration;
      
      const frame = () => {
        confetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#7c3aed', '#ec4899', '#fb7185', '#14b8a6']
        });
        
        confetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#7c3aed', '#ec4899', '#fb7185', '#14b8a6']
        });
        
        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      
      frame();
    }
  }, []);
  
  const handleComplete = async () => {
    try {
      setIsCompleting(true);
      await onComplete(); // Ensure we await the completion
    } catch (error) {
      console.error("Error completing onboarding:", error);
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center flex-grow text-center p-6">
      <div className="relative mb-8">
        <h2 className="text-4xl font-bold mb-2">
          You're in! 
        </h2>
        <h3 className="text-3xl font-bold unmute-gradient-text mb-2">
          Let's Unmute the world. 🌟
        </h3>
      </div>
      
      <div className="flex flex-col items-center mb-8">
        {/* Animated checkmark */}
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-4">
          <svg
            className="h-12 w-12 text-green-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
              className={showConfetti ? "animate-scale-in" : ""}
            />
          </svg>
        </div>
        
        <p className="text-lg text-gray-600">
          Your account is ready! Get ready to share your voice with the world.
        </p>
      </div>
      
      <Button 
        onClick={handleComplete} 
        className="unmute-primary-button"
        disabled={isCompleting}
      >
        {isCompleting ? "Taking you to the app..." : "Take me to the app"}
      </Button>
    </div>
  );
};

export default FinalWelcomeStep;
