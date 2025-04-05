
import React from "react";
import { Button } from "@/components/ui/button";

interface WelcomeStepProps {
  onNext: () => void;
}

const WelcomeStep = ({ onNext }: WelcomeStepProps) => {
  return (
    <div className="flex flex-col items-center justify-center flex-grow text-center p-6">
      <h1 className="text-4xl font-bold mb-4">
        <span className="wave-animation">
          {"Welcome to ".split("").map((char, i) => (
            <span key={i} style={{ "--index": i } as React.CSSProperties}>
              {char}
            </span>
          ))}
        </span>
        <span className="unmute-gradient-text">Unmute!</span>
      </h1>
      
      {/* Sound wave animation */}
      <div className="flex items-end space-x-1 h-12 my-8">
        {[3, 5, 7, 4, 6, 8, 5, 3, 7, 4, 6, 3].map((height, index) => (
          <div 
            key={index}
            className="w-2 bg-gradient-to-t from-unmute-purple to-unmute-pink rounded-full animate-wave"
            style={{ 
              height: `${height * 4}px`, 
              animationDelay: `${index * 0.1}s` 
            }}
          />
        ))}
      </div>
      
      <p className="text-lg text-gray-600 mb-8">
        Your space to speak up, connect, and create change.
      </p>
      
      <Button 
        onClick={onNext} 
        className="unmute-primary-button"
      >
        Next
      </Button>
    </div>
  );
};

export default WelcomeStep;
