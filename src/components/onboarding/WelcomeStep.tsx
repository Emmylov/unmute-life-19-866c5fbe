
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX } from "lucide-react";
import FoundersVideo from "@/components/founders/FoundersVideo";

interface WelcomeStepProps {
  onNext: () => void;
}

const WelcomeStep = ({ onNext }: WelcomeStepProps) => {
  const [isMuted, setIsMuted] = useState(true);

  const toggleSound = () => {
    setIsMuted(!isMuted);
    // Add sound handling logic here
  };

  const founderVideoUrl = "https://kjjnnzwtqniqmaupecle.supabase.co/storage/v1/object/public/founders/welcome-video.mp4";

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

      <div className="w-full max-w-md mb-8">
        <FoundersVideo videoUrl={founderVideoUrl} />
      </div>

      <Button onClick={onNext} className="unmute-primary-button">
        Begin My Journey
      </Button>
    </div>
  );
};

export default WelcomeStep;
