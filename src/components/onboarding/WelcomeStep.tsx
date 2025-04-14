
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX } from "lucide-react";

interface WelcomeStepProps {
  onNext: () => void;
}

const WelcomeStep = ({ onNext }: WelcomeStepProps) => {
  const [isMuted, setIsMuted] = useState(true);

  const toggleSound = () => {
    setIsMuted(!isMuted);
    // Add sound handling logic here
  };

  return (
    <div className="flex flex-col items-center justify-center flex-grow text-center p-6">
      <div className="absolute top-4 right-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSound}
          className="rounded-full"
        >
          {isMuted ? (
            <VolumeX className="h-5 w-5 text-gray-500" />
          ) : (
            <Volume2 className="h-5 w-5 text-unmute-purple" />
          )}
        </Button>
      </div>

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

      <p className="text-xl text-gray-600 mb-8">
        The internet is loud. This is your quiet, powerful space to be real.
      </p>

      <div className="w-full max-w-md aspect-video rounded-xl overflow-hidden bg-gray-100 mb-8">
        {/* Add your founder video component here */}
        <div className="w-full h-full flex items-center justify-center text-gray-400">
          Founder's Welcome Video
        </div>
      </div>

      <Button onClick={onNext} className="unmute-primary-button">
        Begin My Journey
      </Button>
    </div>
  );
};

export default WelcomeStep;
