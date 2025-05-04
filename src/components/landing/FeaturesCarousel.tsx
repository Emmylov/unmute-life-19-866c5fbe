
import React, { useState, useEffect, useRef } from "react";
import { Mic, Users, Heart, Headphones } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { playSound } from "@/utils/sound-effects";

const FeaturesCarousel = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioPlaying, setAudioPlaying] = useState(false);

  // Setup audio elements
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handleAudioFeature = (play: boolean) => {
    if (play) {
      if (!audioRef.current) {
        audioRef.current = new Audio("https://cdn.pixabay.com/audio/2022/01/18/audio_f1b4f4cbce.mp3");
        audioRef.current.volume = 0.4;
      }
      audioRef.current.play()
        .then(() => setAudioPlaying(true))
        .catch(err => console.error("Could not play audio:", err));
    } else if (audioRef.current) {
      audioRef.current.pause();
      setAudioPlaying(false);
    }
  };

  return (
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Interactive Previews of Features</h2>
        
        <Carousel
          className="max-w-5xl mx-auto"
          onSelect={(index) => setActiveFeature(index)}
        >
          <CarouselContent>
            {/* Mental Wellness Rooms */}
            <CarouselItem className="sm:basis-full">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 md:p-10 shadow-xl">
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="flex-1">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                      <Headphones className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold mb-4">Mental Wellness Rooms</h3>
                    <p className="text-lg text-gray-600 mb-6">
                      Touch and hold to enter a room with soothing audio and floating anonymous messages.
                      A space designed for calm and reflection.
                    </p>
                    
                    <div>
                      <button 
                        className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-6 py-3 rounded-full font-medium transition-colors"
                        onMouseDown={() => handleAudioFeature(true)}
                        onMouseUp={() => handleAudioFeature(false)}
                        onMouseLeave={() => handleAudioFeature(false)}
                        onTouchStart={() => handleAudioFeature(true)}
                        onTouchEnd={() => handleAudioFeature(false)}
                      >
                        Touch & Hold to Experience
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="relative p-6 bg-gradient-to-br from-blue-900/90 to-purple-900/90 rounded-xl shadow-inner h-80 overflow-hidden">
                      {/* Floating messages that appear when audio is playing */}
                      <div className={`transition-opacity duration-500 ${audioPlaying ? 'opacity-100' : 'opacity-0'}`}>
                        {["I feel heard here", "Taking a moment to breathe", "This helps me calm down", "I'm not alone"].map((message, i) => (
                          <div 
                            key={i}
                            className="absolute bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg text-white text-sm"
                            style={{
                              top: `${20 + Math.random() * 60}%`,
                              left: `${10 + Math.random() * 70}%`,
                              animationDuration: `${10 + Math.random() * 20}s`,
                              animationDelay: `${i * 0.5}s`,
                            }}
                          >
                            {message}
                          </div>
                        ))}
                      </div>
                      
                      {/* Instructions when not playing */}
                      <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${audioPlaying ? 'opacity-0' : 'opacity-100'}`}>
                        <p className="text-white text-center">
                          <Headphones className="w-10 h-10 mx-auto mb-2" />
                          Press and hold the button to experience a wellness room
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>

            {/* Audio Diaries */}
            <CarouselItem className="sm:basis-full">
              <div className="bg-gradient-to-r from-pink-50 to-orange-50 rounded-2xl p-6 md:p-10 shadow-xl">
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="flex-1">
                    <div className="bg-gradient-to-r from-pink-500 to-orange-500 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                      <Mic className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold mb-4">Unfiltered Audio Diaries</h3>
                    <p className="text-lg text-gray-600 mb-6">
                      Listen to raw, unedited audio diaries from real people sharing their authentic experiences.
                      No filters, just honesty.
                    </p>
                    
                    <button 
                      className="bg-pink-100 hover:bg-pink-200 text-pink-800 px-6 py-3 rounded-full font-medium transition-colors"
                      onClick={() => {
                        playSound('notification', 0.4).catch(err => console.error("Could not play sound:", err));
                        // Here you would typically play a sample audio diary
                      }}
                    >
                      Click to Hear a Sample
                    </button>
                  </div>
                  
                  <div className="flex-1">
                    <div className="bg-gradient-to-br from-pink-900/90 to-orange-900/90 rounded-xl shadow-inner h-80 p-6 flex flex-col justify-center">
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-4 text-white">
                        <p className="text-sm mb-2 opacity-70">Maria, 27</p>
                        <p>"Today I had a panic attack at work. Nobody noticed. I'm recording this in the bathroom stall. I just need to breathe. This helps me sort my thoughts..."</p>
                      </div>
                      
                      <div className="mt-auto mx-auto">
                        <div className="flex items-center space-x-1">
                          {[...Array(20)].map((_, i) => (
                            <div 
                              key={i} 
                              className="w-1 h-10 bg-white/30 rounded-full animate-wave"
                              style={{ 
                                height: `${30 + Math.random() * 30}px`,
                                animationDelay: `${i * 0.05}s`
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>

            {/* Mentorship Circles */}
            <CarouselItem className="sm:basis-full">
              <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-2xl p-6 md:p-10 shadow-xl">
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="flex-1">
                    <div className="bg-gradient-to-r from-green-500 to-teal-500 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                      <Users className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold mb-4">Mentorship Circles</h3>
                    <p className="text-lg text-gray-600 mb-6">
                      Hover to "listen in" to circles where people of different ages and backgrounds exchange life lessons and wisdom.
                    </p>
                    
                    <button 
                      className="bg-green-100 hover:bg-green-200 text-green-800 px-6 py-3 rounded-full font-medium transition-colors"
                    >
                      Hover Over Circle to Listen
                    </button>
                  </div>
                  
                  <div className="flex-1">
                    <div className="relative bg-gradient-to-br from-green-900/90 to-teal-900/90 rounded-xl shadow-inner h-80 p-6 overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-56 h-56 bg-white/10 backdrop-blur-sm rounded-full relative flex items-center justify-center">
                          <div className="absolute -top-4 -left-4">
                            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white text-lg font-bold">
                              16
                            </div>
                          </div>
                          
                          <div className="absolute -bottom-4 -right-4">
                            <div className="w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center text-white text-lg font-bold">
                              50
                            </div>
                          </div>
                          
                          <div className="text-white text-center">
                            <p className="text-sm">Hover to hear their conversation</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="absolute bottom-4 left-4 right-4 bg-white/10 backdrop-blur-sm p-3 rounded-lg text-white">
                        <p className="text-xs">
                          "When I was your age, I worried so much about what others thought. Now I realize time is too precious for that."
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>

            {/* No Likes. Just Resonance. */}
            <CarouselItem className="sm:basis-full">
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6 md:p-10 shadow-xl">
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="flex-1">
                    <div className="bg-gradient-to-r from-purple-500 to-indigo-500 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                      <Heart className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold mb-4">No Likes. Just Resonance.</h3>
                    <p className="text-lg text-gray-600 mb-6">
                      Move your mouse over a post and watch it glow. React with meaningful responses like "This helped me," "Same here," or "I felt this."
                    </p>
                    
                    <button 
                      className="bg-purple-100 hover:bg-purple-200 text-purple-800 px-6 py-3 rounded-full font-medium transition-colors"
                    >
                      Hover to See Resonance
                    </button>
                  </div>
                  
                  <div className="flex-1">
                    <div className="bg-gradient-to-br from-purple-900/90 to-indigo-900/90 rounded-xl shadow-inner h-80 p-6">
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-4 text-white hover:bg-white/20 transition-all group">
                        <p className="text-sm mb-2 opacity-70">Alex, 32</p>
                        <p>"Sometimes I feel like I'm the only one struggling to balance work and mental health. Does anyone else feel this way?"</p>
                        
                        <div className="mt-4 flex flex-wrap gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <span className="px-3 py-1 bg-white/20 rounded-full text-xs">Same here (12)</span>
                          <span className="px-3 py-1 bg-white/20 rounded-full text-xs">I feel this (8)</span>
                          <span className="px-3 py-1 bg-white/20 rounded-full text-xs">This helped me (4)</span>
                          <span className="px-3 py-1 bg-white/20 rounded-full text-xs">Thank you (3)</span>
                        </div>
                      </div>
                      
                      <p className="text-white/60 text-sm text-center italic mt-6">
                        Hover over the post to see resonance responses instead of likes
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          </CarouselContent>
          
          <div className="mt-8 flex justify-center gap-2">
            <CarouselPrevious className="relative left-0 right-auto" />
            <CarouselNext className="relative right-0 left-auto" />
          </div>
        </Carousel>
      </div>
    </section>
  );
};

export default FeaturesCarousel;
