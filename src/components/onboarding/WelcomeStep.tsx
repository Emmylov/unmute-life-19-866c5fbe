import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX, SkipForward } from "lucide-react";
import FoundersVideo from "@/components/founders/FoundersVideo";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-responsive";

interface WelcomeStepProps {
  onNext: () => void;
}

const WelcomeStep = ({ onNext }: WelcomeStepProps) => {
  const [isMuted, setIsMuted] = useState(true);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [videoLoadError, setVideoLoadError] = useState(false);
  const isMobile = useIsMobile();
  
  const founderVideoUrl = "https://lovable-uploads.s3.amazonaws.com/default/welcome-video.mp4";
  const fallbackImageUrl = "https://lovable-uploads.s3.amazonaws.com/08c4eb5b-4415-4b24-95f0-9dcb194018b2.png";

  const toggleSound = () => {
    setIsMuted(!isMuted);
  };

  const handleVideoLoadError = () => {
    setVideoLoadError(true);
    setIsVideoLoaded(true);
    toast.error("Couldn't load the welcome video", {
      description: "We're using a placeholder instead"
    });
  };

  const handleVideoLoadSuccess = () => {
    setIsVideoLoaded(true);
  };

  const handleSkip = () => {
    onNext();
  };

  return (
    <div className="flex flex-col items-center justify-center flex-grow text-center p-4 sm:p-6">
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

      <h1 className="text-2xl sm:text-4xl font-bold mb-4">
        <span className="wave-animation">
          {"Welcome to ".split("").map((char, i) => (
            <span key={i} style={{ "--index": i } as React.CSSProperties}>
              {char}
            </span>
          ))}
        </span>
        <span className="unmute-gradient-text">Unmute!</span>
      </h1>

      <p className="text-md sm:text-xl text-gray-600 mb-6">
        The internet is loud. This is your quiet, powerful space to be real.
      </p>

      <div className="w-full max-w-md mb-8">
        <FoundersVideo 
          videoUrl={founderVideoUrl} 
          muted={isMuted}
          fallbackImageUrl={fallbackImageUrl}
          onLoadError={handleVideoLoadError}
          onLoadSuccess={handleVideoLoadSuccess}
          className="shadow-lg rounded-lg"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
        <Button 
          onClick={onNext} 
          className="unmute-primary-button w-full text-base py-5"
        >
          Begin My Journey
        </Button>
        
        <Button 
          variant="ghost" 
          onClick={handleSkip}
          className="text-gray-500 w-full text-base py-5 flex items-center gap-2"
        >
          Skip intro <SkipForward size={16} />
        </Button>
      </div>
    </div>
  );
};

export default WelcomeStep;
