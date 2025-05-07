
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import WorldOfSilence from './experience/WorldOfSilence';
import AvatarSelection from './experience/AvatarSelection';
import MazeOfNoise from './experience/MazeOfNoise';
import SanctuaryScene from './experience/SanctuaryScene';
import AgePortal from './experience/AgePortal';
import FinalScene from './experience/FinalScene';
import { Button } from '@/components/ui/button';
import { ArrowDown } from 'lucide-react';
import HeroSection from './HeroSection';

type SceneType = 'silence' | 'avatar' | 'maze' | 'sanctuary' | 'age' | 'final';
type AvatarType = 'overthinker' | 'peoplepleaser' | 'bottledup' | 'tryingagain' | 'lost' | null;
type AgeGroup = 'teens' | 'twenties' | 'thirties' | 'forties' | 'fiftyplus' | null;

const UnmuteExperience = () => {
  const [currentScene, setCurrentScene] = useState<SceneType>('silence');
  const [selectedAvatar, setSelectedAvatar] = useState<AvatarType>(null);
  const [selectedAge, setSelectedAge] = useState<AgeGroup>(null);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Initialize ambient audio
    audioRef.current = new Audio('/sounds/ambient-sound.mp3');
    audioRef.current.volume = 0.2;
    audioRef.current.loop = true;
    
    // Clean up on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);
  
  const playAmbientSound = () => {
    if (audioRef.current && !audioPlaying) {
      audioRef.current.play().then(() => {
        setAudioPlaying(true);
      }).catch(error => {
        console.error("Audio play failed:", error);
      });
    }
  };
  
  const handleContinue = () => {
    if (!audioPlaying) {
      playAmbientSound();
    }
    
    // Scene transitions
    switch (currentScene) {
      case 'silence':
        setCurrentScene('avatar');
        break;
      case 'avatar':
        if (selectedAvatar) {
          setCurrentScene('maze');
        }
        break;
      case 'maze':
        setCurrentScene('sanctuary');
        break;
      case 'sanctuary':
        setCurrentScene('age');
        break;
      case 'age':
        if (selectedAge) {
          setCurrentScene('final');
        }
        break;
      case 'final':
        navigate('/auth');
        break;
      default:
        break;
    }
  };
  
  const handleAvatarSelect = (avatar: AvatarType) => {
    setSelectedAvatar(avatar);
  };
  
  const handleAgeSelect = (age: AgeGroup) => {
    setSelectedAge(age);
  };
  
  const handleSkip = () => {
    navigate('/auth');
  };
  
  // Get text content for the current scene
  const getSceneContent = () => {
    switch (currentScene) {
      case 'silence':
        return {
          title: "The Day I Lost My Voice",
          description: "Once, I had a voice. It was loud. Too loud, they said. Then one day, I muted myself."
        };
      case 'avatar':
        return {
          title: "Choose Your Path",
          description: "Which version of you resonates the most today?"
        };
      case 'maze':
        return {
          title: "The Maze of Noise",
          description: "You enter the world again. But it's all... noise. \"Why are you always so emotional?\" \"You talk too much.\" \"You're too sensitive.\""
        };
      case 'sanctuary':
        return {
          title: "The Sanctuary of Unmute",
          description: "Welcome. This is Unmute — a sanctuary for real voices, raw stories, and radical belonging."
        };
      case 'age':
        return {
          title: "Your Journey Continues",
          description: "To build your space, we need to know one thing. How old are you?"
        };
      case 'final':
        return {
          title: "You're Ready",
          description: "You're not too loud. You're not too sensitive. You're not too old. You're not too young. You're just right — and you belong here."
        };
      default:
        return {
          title: "",
          description: ""
        };
    }
  };
  
  return (
    <div className="w-full overflow-x-hidden overflow-y-auto">
      <HeroSection />
      
      {/* Skip button */}
      <button 
        onClick={handleSkip}
        className="fixed top-4 right-4 text-white hover:text-white z-50 text-sm bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20"
      >
        Skip experience →
      </button>
      
      {/* Scene renderer */}
      <div className="h-auto min-h-screen">
        {currentScene === 'silence' && (
          <WorldOfSilence onContinue={handleContinue} />
        )}
        
        {currentScene === 'avatar' && (
          <AvatarSelection 
            onSelect={handleAvatarSelect} 
            onContinue={handleContinue}
            selectedAvatar={selectedAvatar}
          />
        )}
        
        {currentScene === 'maze' && (
          <MazeOfNoise 
            onContinue={handleContinue}
            avatarType={selectedAvatar}
          />
        )}
        
        {currentScene === 'sanctuary' && (
          <SanctuaryScene 
            onContinue={handleContinue}
            avatarType={selectedAvatar}
            sceneContent={getSceneContent()}
          />
        )}
        
        {currentScene === 'age' && (
          <AgePortal 
            onSelect={handleAgeSelect}
            onContinue={handleContinue}
            selectedAge={selectedAge}
          />
        )}
        
        {currentScene === 'final' && (
          <FinalScene 
            onContinue={handleContinue}
            avatarType={selectedAvatar}
            ageGroup={selectedAge}
          />
        )}
      </div>
      
      {/* Interactive story link at the end */}
      {currentScene === 'final' && (
        <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-50">
          <Link to="/story">
            <Button
              className="px-6 py-3 bg-gradient-to-r from-purple-700 to-indigo-800 text-white rounded-full hover:from-purple-800 hover:to-indigo-900 transition-colors shadow-lg border border-white/20 font-medium text-base"
            >
              Begin Your Immersive Journey
            </Button>
          </Link>
        </div>
      )}
      
      {/* Scroll indicator for all devices */}
      <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 z-50 flex flex-col items-center animate-bounce">
        <ArrowDown className="h-5 w-5 text-white drop-shadow-md" />
        <span className="text-xs text-white mt-1 font-medium drop-shadow-md">Scroll</span>
      </div>
      
      {/* Journey quiz section */}
      <div id="journey-quiz" className="min-h-screen">
        {/* This is where the quiz would start after the story experience */}
      </div>
    </div>
  );
};

export default UnmuteExperience;
