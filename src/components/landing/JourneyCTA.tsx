
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { playSound } from "@/utils/sound-effects";
import confetti from "canvas-confetti";

const JourneyCTA = () => {
  const navigate = useNavigate();
  const [isAnimating, setIsAnimating] = useState(false);
  
  const handleCtaClick = () => {
    setIsAnimating(true);
    
    // Play celebration sound
    playSound('reward', 0.3).catch(() => {});
    
    // Trigger confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    
    // Navigate after a short delay to allow animations to play
    setTimeout(() => {
      navigate('/onboarding');
    }, 1000);
  };

  return (
    <section className="py-24 bg-gradient-to-br from-unmute-purple/10 to-unmute-pink/10">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-8">
            <span className="unmute-gradient-text">I'm Ready to Unmute</span>
          </h2>
          
          <p className="text-lg text-gray-600 mb-12 max-w-xl mx-auto">
            Join a community where your voice matters. Express yourself authentically and connect with others on a deeper level.
          </p>
          
          <div className={`relative transition-transform duration-300 ${isAnimating ? 'scale-105' : ''}`}>
            <Button 
              onClick={handleCtaClick}
              className="bg-gradient-to-r from-unmute-purple to-unmute-pink hover:opacity-90 text-white px-10 py-8 h-auto text-xl rounded-full shadow-lg transition-all hover:shadow-xl hover:shadow-unmute-purple/20"
              size="lg"
              disabled={isAnimating}
            >
              Begin My Unmute Journey
            </Button>
            
            {/* Animated rings that appear on click */}
            {isAnimating && (
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(3)].map((_, i) => (
                  <div 
                    key={i}
                    className="absolute inset-0 rounded-full border-2 border-unmute-purple animate-ping"
                    style={{ 
                      animationDuration: `${1 + i * 0.5}s`,
                      animationDelay: `${i * 0.2}s`,
                      opacity: 0.7 - (i * 0.2)
                    }}
                  ></div>
                ))}
              </div>
            )}
          </div>
          
          <p className="mt-8 text-sm text-gray-500">
            No pressure. Just a space to be yourself.
          </p>
        </div>
      </div>
    </section>
  );
};

export default JourneyCTA;
