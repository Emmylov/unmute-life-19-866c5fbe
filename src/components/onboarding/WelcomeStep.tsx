
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX } from "lucide-react";
import FoundersVideo from "@/components/founders/FoundersVideo";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-responsive";

interface WelcomeStepProps {
  onNext: () => void;
}

const WelcomeStep = ({ onNext }: WelcomeStepProps) => {
  const [isMuted, setIsMuted] = useState(true);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const isMobile = useIsMobile();

  // Make sure we use a reliable and accessible video URL
  const founderVideoUrl = "https://lovable-uploads.s3.amazonaws.com/default/welcome-video.mp4";
  // Fallback image in case video fails to load
  const fallbackImageUrl = "https://lovable-uploads.s3.amazonaws.com/08c4eb5b-4415-4b24-95f0-9dcb194018b2.png";

  useEffect(() => {
    // Check if video is accessible with a timeout to prevent hanging
    const preloadVideo = () => {
      const video = document.createElement('video');
      video.src = founderVideoUrl;
      
      // Set a timeout to handle cases where the video might hang
      const timeoutId = setTimeout(() => {
        console.warn("Video loading took too long, continuing with onboarding");
        setIsVideoLoaded(true);
      }, 5000); // 5 seconds timeout
      
      video.onloadeddata = () => {
        clearTimeout(timeoutId);
        setIsVideoLoaded(true);
      };
      
      video.onerror = () => {
        clearTimeout(timeoutId);
        console.error("Error loading founders video");
        toast.error("Couldn't load the welcome video", {
          description: "We'll use a placeholder instead"
        });
        setIsVideoLoaded(true); // Continue with onboarding despite error
      };
    };
    
    preloadVideo();
  }, [founderVideoUrl]);

  const toggleSound = () => {
    setIsMuted(!isMuted);
  };

  // Allow users to skip this step if they're having problems
  const handleSkip = () => {
    toast.info("Skipping welcome video");
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

      <h1 className="text-3xl sm:text-4xl font-bold mb-4">
        <span className="wave-animation">
          {"Welcome to ".split("").map((char, i) => (
            <span key={i} style={{ "--index": i } as React.CSSProperties}>
              {char}
            </span>
          ))}
        </span>
        <span className="unmute-gradient-text">Unmute!</span>
      </h1>

      <p className="text-lg sm:text-xl text-gray-600 mb-6">
        The internet is loud. This is your quiet, powerful space to be real.
      </p>

      <div className="w-full max-w-md mb-8">
        {isVideoLoaded ? (
          <FoundersVideo 
            videoUrl={founderVideoUrl} 
            muted={isMuted}
            fallbackImageUrl={fallbackImageUrl}
          />
        ) : (
          <div className="aspect-video w-full flex items-center justify-center bg-gray-100 rounded-lg">
            <div className="animate-spin h-8 w-8 border-4 border-unmute-purple rounded-full border-t-transparent"></div>
            <p className="ml-3 text-gray-600">Loading welcome message...</p>
          </div>
        )}
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
          className="text-gray-500 w-full text-base py-5"
        >
          Skip intro
        </Button>
      </div>
    </div>
  );
};

export default WelcomeStep;
