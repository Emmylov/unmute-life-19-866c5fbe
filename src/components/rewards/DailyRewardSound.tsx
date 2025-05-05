
import React, { useEffect, useRef } from 'react';
import { playSound, SoundEffectType } from '@/utils/sound-effects';

interface DailyRewardSoundProps {
  play: boolean;
  soundType?: SoundEffectType;
  onEnd?: () => void;
}

const DailyRewardSound = ({ 
  play, 
  soundType = 'reward', 
  onEnd 
}: DailyRewardSoundProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasAttemptedPlay = useRef<boolean>(false);

  useEffect(() => {
    if (play && !hasAttemptedPlay.current) {
      hasAttemptedPlay.current = true;
      
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(error => {
          console.error("Error playing audio:", error);
          
          // Try using the utility as a fallback
          playSound(soundType).catch(err => {
            console.error("Fallback sound also failed:", err);
          }).finally(() => {
            if (onEnd) onEnd();
          });
        });
      } else {
        // No audio ref, use the utility
        playSound(soundType).catch(err => {
          console.error("Sound utility failed:", err);
        }).finally(() => {
          if (onEnd) onEnd();
        });
      }
    }
    
    // Reset flag when play becomes false
    if (!play) {
      hasAttemptedPlay.current = false;
    }
  }, [play, soundType, onEnd]);

  return (
    <audio 
      ref={audioRef}
      src="/sounds/reward.mp3"
      onEnded={onEnd}
    />
  );
};

export default DailyRewardSound;
