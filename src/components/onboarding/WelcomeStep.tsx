
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX } from "lucide-react";

interface WelcomeStepProps {
  onNext: () => void;
}

const WelcomeStep = ({ onNext }: WelcomeStepProps) => {
  const [isMuted, setIsMuted] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.pause();
      } else {
        audioRef.current.volume = 0.3;
        audioRef.current.play().catch(err => console.log("Audio autoplay prevented:", err));
      }
    }
  }, [isMuted]);
  
  const toggleSound = () => {
    setIsMuted(!isMuted);
  };
  
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
      
      <p className="text-lg text-gray-600 mb-8">
        The internet is loud. This is your quiet, powerful space to be real.
      </p>
      
      <div className="mb-10 w-full max-w-md rounded-xl overflow-hidden shadow-lg">
        <div className="bg-black/5 p-2 rounded-lg flex items-center justify-center">
          <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
            {/* Replace this with an actual video when available */}
            <div className="text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
              </svg>
            </div>
            <span className="absolute bottom-2 right-2 text-sm text-white bg-black/50 px-2 py-1 rounded">
              A Word from the Founder
            </span>
          </div>
        </div>
      </div>
      
      {/* Sound wave animation */}
      <div className="flex items-end space-x-1 h-12 my-6">
        {[3, 5, 7, 4, 6, 8, 5, 3, 7, 4, 6, 3].map((height, index) => (
          <div 
            key={index}
            className="w-2 bg-gradient-to-t from-unmute-purple to-unmute-pink rounded-full animate-wave"
            style={{ 
              height: `${height * 4}px`, 
              animationDelay: `${index * 0.1}s`,
              opacity: isMuted ? 0.3 : 1
            }}
          />
        ))}
      </div>
      
      <audio ref={audioRef} loop>
        <source src="/ambient-music.mp3" type="audio/mp3" />
      </audio>
      
      <div className="flex items-center gap-4">
        <Button 
          onClick={onNext} 
          className="unmute-primary-button"
        >
          Next
        </Button>
        
        <Button
          onClick={toggleSound}
          variant="ghost"
          size="icon"
          className="rounded-full"
          title={isMuted ? "Turn sound on" : "Turn sound off"}
        >
          {isMuted ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
        </Button>
      </div>
    </div>
  );
};

export default WelcomeStep;
