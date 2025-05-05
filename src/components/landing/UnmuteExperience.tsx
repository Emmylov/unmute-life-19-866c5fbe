
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import WorldOfSilence from './experience/WorldOfSilence';
import AvatarSelection from './experience/AvatarSelection';
import MazeOfNoise from './experience/MazeOfNoise';
import SanctuaryScene from './experience/SanctuaryScene';
import AgePortal from './experience/AgePortal';
import FinalScene from './experience/FinalScene';
import { Button } from '@/components/ui/button';

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
  
  return (
    <div className="h-screen w-full overflow-hidden relative bg-black">
      {/* Skip button */}
      <button 
        onClick={handleSkip}
        className="absolute top-4 right-4 text-white/50 hover:text-white z-50 text-sm"
      >
        Skip experience →
      </button>
      
      {/* Scene renderer */}
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
  );
};

export default UnmuteExperience;
