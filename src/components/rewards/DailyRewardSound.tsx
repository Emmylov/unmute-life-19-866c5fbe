
import React, { useEffect, useRef } from 'react';

interface DailyRewardSoundProps {
  play: boolean;
  onEnd?: () => void;
}

const DailyRewardSound = ({ play, onEnd }: DailyRewardSoundProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (play && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(error => {
        console.error("Error playing audio:", error);
      });
    }
  }, [play]);

  return (
    <audio 
      ref={audioRef}
      src="/notification-sound.mp3"
      onEnded={onEnd}
    />
  );
};

export default DailyRewardSound;
