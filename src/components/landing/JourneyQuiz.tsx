
import React, { useState, useEffect, useRef } from "react";
import { Headphones } from "lucide-react";

type AgeGroup = 'under24' | '25-40' | '41-60' | '61plus' | null;

const JourneyQuiz = () => {
  const [selectedAge, setSelectedAge] = useState<AgeGroup>(null);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Create audio elements for different age groups
  useEffect(() => {
    if (selectedAge) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      
      audioRef.current = new Audio();
      
      // Different audio for each age group
      switch (selectedAge) {
        case 'under24':
          // Lofi beats for under 24
          audioRef.current.src = "https://cdn.pixabay.com/audio/2022/10/30/audio_347917303e.mp3";
          break;
        case '25-40':
          // Warm ambient for 25-40
          audioRef.current.src = "https://cdn.pixabay.com/audio/2022/03/09/audio_d5596d6e0f.mp3";
          break;
        case '41-60':
          // Mature jazz for 41-60
          audioRef.current.src = "https://cdn.pixabay.com/audio/2022/08/02/audio_884fe92c21.mp3";
          break;
        case '61plus':
          // Classical for 61+
          audioRef.current.src = "https://cdn.pixabay.com/audio/2021/08/09/audio_f938902cb9.mp3";
          break;
      }
      
      audioRef.current.volume = 0.3;
      audioRef.current.loop = true;
      
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          setAudioPlaying(true);
        }).catch(error => {
          console.error("Audio play was prevented:", error);
          setAudioPlaying(false);
        });
      }
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [selectedAge]);
  
  const toggleAudio = () => {
    if (audioRef.current) {
      if (audioPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(error => {
          console.error("Audio play was prevented:", error);
        });
      }
      setAudioPlaying(!audioPlaying);
    }
  };
  
  // Backgrounds based on age group
  const getBackground = () => {
    if (!selectedAge) return "";
    
    switch (selectedAge) {
      case 'under24':
        return "bg-gradient-to-r from-pink-400 to-purple-500";
      case '25-40':
        return "bg-gradient-to-r from-amber-500 to-orange-400";
      case '41-60':
        return "bg-gradient-to-r from-teal-500 to-blue-500";
      case '61plus':
        return "bg-gradient-to-r from-green-500 to-emerald-400";
      default:
        return "";
    }
  };
  
  // Returns appropriate styling for age group buttons
  const getButtonStyle = (ageGroup: AgeGroup) => {
    const baseClasses = "py-3 px-6 rounded-full transition-all duration-300";
    
    if (selectedAge === ageGroup) {
      return `${baseClasses} bg-white text-gray-900 font-medium shadow-lg scale-110`;
    }
    
    return `${baseClasses} bg-white/20 text-white hover:bg-white/40`;
  };

  return (
    <section 
      id="journey-quiz" 
      className={`min-h-screen flex items-center justify-center transition-colors duration-700 ${getBackground()} ${!selectedAge ? 'bg-gradient-to-r from-unmute-purple/80 to-unmute-pink/80' : ''}`}
    >
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">Let's find the version of Unmute that fits YOU</h2>
          
          <div className="bg-black/30 backdrop-blur-sm p-8 rounded-2xl">
            <h3 className="text-2xl md:text-3xl mb-10">How old are you?</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button 
                className={getButtonStyle('under24')}
                onClick={() => setSelectedAge('under24')}
              >
                Under 24
              </button>
              
              <button 
                className={getButtonStyle('25-40')}
                onClick={() => setSelectedAge('25-40')}
              >
                25 - 40
              </button>
              
              <button 
                className={getButtonStyle('41-60')}
                onClick={() => setSelectedAge('41-60')}
              >
                41 - 60
              </button>
              
              <button 
                className={getButtonStyle('61plus')}
                onClick={() => setSelectedAge('61plus')}
              >
                61+
              </button>
            </div>
            
            {selectedAge && (
              <div className="mt-10 animate-fade-in">
                <div className="mb-6">
                  {selectedAge === 'under24' && (
                    <div className="space-y-4">
                      <p className="font-glitch text-xl">Welcome to your space. Express your truth.</p>
                      <div className="flex flex-wrap gap-3 justify-center">
                        {['#authentic', '#nofilter', '#realvibes', '#findingyourvoice'].map((tag, i) => (
                          <span key={i} className="bg-white/20 px-3 py-1 rounded-full text-sm">{tag}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {selectedAge === '25-40' && (
                    <div className="space-y-4">
                      <p className="font-handwriting text-xl">Find your community. Share your journey.</p>
                      <div className="flex flex-wrap gap-3 justify-center">
                        {['#growingwisdom', '#lifeinprogress', '#findingbalance', '#authenticconnection'].map((tag, i) => (
                          <span key={i} className="bg-white/20 px-3 py-1 rounded-full text-sm">{tag}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {selectedAge === '41-60' && (
                    <div className="space-y-4">
                      <p className="font-serif text-xl">Your wisdom matters. Guide others.</p>
                      <div className="flex flex-wrap gap-3 justify-center">
                        {['#lifeexperience', '#wisdomsharing', '#mentoringothers', '#stillgrowing'].map((tag, i) => (
                          <span key={i} className="bg-white/20 px-3 py-1 rounded-full text-sm">{tag}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {selectedAge === '61plus' && (
                    <div className="space-y-4">
                      <p className="font-serif text-xl">Your stories are priceless. Unmute yourself.</p>
                      <div className="flex flex-wrap gap-3 justify-center">
                        {['#legacysharing', '#digitalconnection', '#generationalbridge', '#wisdomkeepers'].map((tag, i) => (
                          <span key={i} className="bg-white/20 px-3 py-1 rounded-full text-sm">{tag}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <button 
                  onClick={toggleAudio}
                  className="flex items-center gap-2 mx-auto bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full transition-colors"
                >
                  <Headphones className="w-5 h-5" />
                  {audioPlaying ? "Pause Sound" : "Play Sound"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default JourneyQuiz;
