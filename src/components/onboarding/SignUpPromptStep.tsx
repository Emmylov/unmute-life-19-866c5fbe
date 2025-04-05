
import React from "react";
import { Button } from "@/components/ui/button";

interface SignUpPromptStepProps {
  onCreateAccount: () => void;
  onContinueAnyway: () => void;
}

const SignUpPromptStep = ({ onCreateAccount, onContinueAnyway }: SignUpPromptStepProps) => {
  return (
    <div className="flex flex-col items-center justify-center flex-grow text-center p-6">
      <h2 className="text-3xl font-bold mb-6">Ready to Join?</h2>
      
      {/* Floating user illustrations */}
      <div className="relative w-64 h-64 mb-8">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-20 h-20 rounded-full bg-unmute-purple flex items-center justify-center border-4 border-white">
            <span className="text-white font-bold text-xl">U</span>
          </div>
        </div>
        
        {/* Orbiting user avatars */}
        {[0, 1, 2, 3, 4, 5].map((index) => {
          const angle = (index * 60 * Math.PI) / 180; // 60 degrees apart
          const radius = 80; // Distance from center
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          const delay = index * 0.5;
          
          return (
            <div 
              key={index}
              className="absolute w-10 h-10 rounded-full bg-gradient-to-r from-unmute-pink to-unmute-coral animate-float"
              style={{ 
                top: `calc(50% - 20px + ${y}px)`,
                left: `calc(50% - 20px + ${x}px)`,
                animationDelay: `${delay}s`
              }}
            />
          );
        })}
      </div>
      
      <p className="text-lg text-gray-600 mb-8">
        Wanna create an account?
      </p>
      
      <div className="flex flex-col w-full gap-4">
        <Button 
          onClick={onCreateAccount} 
          className="unmute-primary-button"
        >
          Yes, let's go!
        </Button>
        
        <Button 
          onClick={onContinueAnyway} 
          variant="outline" 
          className="unmute-secondary-button"
        >
          Not now
        </Button>
      </div>
    </div>
  );
};

export default SignUpPromptStep;
