
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  playSound, 
  SoundEffectType, 
  hasUserInteracted, 
  setupSoundInteractionDetection 
} from '@/utils/sound-effects';

interface SoundContextValue {
  isSoundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  playEffect: (type: SoundEffectType, volume?: number) => Promise<void>;
  canPlaySound: boolean;
}

const SoundContext = createContext<SoundContextValue | undefined>(undefined);

export const SoundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSoundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [canPlaySound, setCanPlaySound] = useState<boolean>(false);

  // Check if user has interacted with the page
  useEffect(() => {
    setupSoundInteractionDetection();
    
    const checkInteraction = () => {
      setCanPlaySound(hasUserInteracted());
    };
    
    // Check on load
    checkInteraction();
    
    // Setup periodic checks
    const interval = setInterval(checkInteraction, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const playEffect = async (type: SoundEffectType, volume?: number): Promise<void> => {
    if (isSoundEnabled && canPlaySound) {
      return playSound(type, volume);
    }
    return Promise.resolve();
  };

  const value: SoundContextValue = {
    isSoundEnabled,
    setSoundEnabled,
    playEffect,
    canPlaySound,
  };

  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>;
};

export const useSound = (): SoundContextValue => {
  const context = useContext(SoundContext);
  if (context === undefined) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
};

export default SoundContext;
