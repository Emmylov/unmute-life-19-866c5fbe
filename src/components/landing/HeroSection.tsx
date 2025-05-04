
import React, { useState, useEffect, useRef } from "react";
import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Handle video loaded
  const handleVideoLoaded = () => {
    setIsVideoLoaded(true);
    // Try to autoplay with sound if possible
    if (videoRef.current) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Auto-play with sound was prevented, mute and try again
          if (videoRef.current) {
            videoRef.current.muted = true;
            setIsMuted(true);
            videoRef.current.play().catch(err => console.error("Could not play video:", err));
          }
        });
      }
    }
  };
  
  // Toggle mute
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
  };
  
  // Scroll to journey quiz section
  const scrollToJourneyQuiz = () => {
    const journeyQuizSection = document.getElementById("journey-quiz");
    if (journeyQuizSection) {
      journeyQuizSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0 bg-black">
        <video 
          ref={videoRef}
          className="w-full h-full object-cover opacity-60"
          playsInline
          loop
          onLoadedData={handleVideoLoaded}
          poster="https://lovable-uploads.s3.amazonaws.com/08c4eb5b-4415-4b24-95f0-9dcb194018b2.png"
        >
          <source src="https://lovable-uploads.s3.amazonaws.com/default/founder-story.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Content */}
      <div className="relative z-10 text-white text-center px-4 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 relative animate-fade-in">
            <span className="inline-block">Welcome to </span>
            <span className="unmute-gradient-text inline-block">Unmute</span>
            <div className="absolute -right-6 top-0 w-10 h-10">
              <div className="w-full h-full relative">
                {[...Array(5)].map((_, i) => (
                  <div 
                    key={i} 
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/30 rounded-full animate-wave" 
                    style={{ 
                      height: `${60 - i * 10}%`, 
                      width: `${60 - i * 10}%`, 
                      animationDelay: `${i * 0.1}s`,
                      opacity: `${0.8 - i * 0.15}`
                    }}
                  />
                ))}
              </div>
            </div>
          </h1>
          <h2 className="text-2xl md:text-3xl mb-8 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            A Safe Place to Be Loud
          </h2>
          
          {/* Voiceover message */}
          <p className="text-lg md:text-xl mb-8 bg-black/30 p-4 rounded-lg backdrop-blur-sm animate-fade-in" style={{ animationDelay: "0.6s" }}>
            "You're not too loud. You're not too sensitive. You're not too old. You're not too young. 
            You're just right — and you belong here."
          </p>
        </div>
        
        <div className="flex flex-col items-center space-y-6 animate-fade-in" style={{ animationDelay: "0.9s" }}>
          <Button 
            onClick={scrollToJourneyQuiz}
            className="bg-gradient-to-r from-unmute-purple to-unmute-pink hover:opacity-90 text-white px-8 py-6 h-auto text-lg rounded-full transition-all group hover:shadow-lg hover:shadow-unmute-purple/25"
            size="lg"
          >
            Start My Journey
            <ArrowDown className="ml-2 w-5 h-5 group-hover:translate-y-1 transition-transform" />
          </Button>
          
          <button onClick={toggleMute} className="flex items-center text-sm text-white/80 hover:text-white">
            <span className="mr-2">{isMuted ? "Unmute" : "Mute"} voiceover</span>
            <div className={`w-8 h-4 rounded-full transition-colors ${isMuted ? 'bg-gray-500' : 'bg-unmute-purple'} relative`}>
              <div className={`absolute top-0.5 left-0.5 w-3 h-3 rounded-full bg-white transition-transform ${isMuted ? '' : 'translate-x-4'}`}></div>
            </div>
          </button>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ArrowDown className="w-6 h-6 text-white" />
      </div>
    </section>
  );
};

export default HeroSection;
