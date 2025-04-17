
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX,
  Repeat,
  Shuffle,
  Music
} from 'lucide-react';
import { formatTime } from '@/utils/format-utils';

export interface Track {
  id: string;
  title: string;
  artist: string;
  audioUrl: string;
  coverArt: string;
  duration: number; // in seconds
}

interface MusicPlayerProps {
  tracks: Track[];
  initialTrackIndex?: number;
  autoplay?: boolean;
}

const MusicPlayer = ({ 
  tracks, 
  initialTrackIndex = 0,
  autoplay = false 
}: MusicPlayerProps) => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(initialTrackIndex);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [isRepeating, setIsRepeating] = useState(false);
  const [showVolumeControl, setShowVolumeControl] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);

  const currentTrack = tracks[currentTrackIndex];

  // Set up audio element
  useEffect(() => {
    if (!audioRef.current) return;
    
    const audio = audioRef.current;
    
    // Set initial volume
    audio.volume = volume;
    
    // Event listeners
    const setAudioData = () => {
      setDuration(audio.duration);
      setCurrentTime(audio.currentTime);
    };
    
    const updateTime = () => {
      setCurrentTime(audio.currentTime);
    };
    
    const handleEnded = () => {
      if (isRepeating) {
        audio.currentTime = 0;
        audio.play();
      } else {
        handleNext();
      }
    };
    
    audio.addEventListener('loadeddata', setAudioData);
    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('ended', handleEnded);
    
    if (autoplay) {
      audio.play()
        .then(() => setIsPlaying(true))
        .catch(error => console.error("Autoplay prevented:", error));
    }
    
    return () => {
      audio.removeEventListener('loadeddata', setAudioData);
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrackIndex, isRepeating, autoplay]);

  // Handle track changes
  useEffect(() => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.play().catch(error => {
        console.error("Error playing audio:", error);
        setIsPlaying(false);
      });
    }
  }, [currentTrackIndex]);

  const handlePlayPause = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(error => {
        console.error("Error playing audio:", error);
      });
    }
    
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    if (isShuffled) {
      let nextIndex;
      do {
        nextIndex = Math.floor(Math.random() * tracks.length);
      } while (tracks.length > 1 && nextIndex === currentTrackIndex);
      setCurrentTrackIndex(nextIndex);
    } else {
      setCurrentTrackIndex((prevIndex) => 
        prevIndex === tracks.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  const handlePrevious = () => {
    // If more than 3 seconds into track, restart the current track
    if (audioRef.current && audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
    } else {
      setCurrentTrackIndex((prevIndex) => 
        prevIndex === 0 ? tracks.length - 1 : prevIndex - 1
      );
    }
  };

  const handleTimeChange = (values: number[]) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = values[0];
    setCurrentTime(values[0]);
  };

  const handleVolumeChange = (values: number[]) => {
    if (!audioRef.current) return;
    const newVolume = values[0];
    setVolume(newVolume);
    audioRef.current.volume = newVolume;
    if (newVolume === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    if (isMuted) {
      audioRef.current.volume = volume;
    } else {
      audioRef.current.volume = 0;
    }
    setIsMuted(!isMuted);
  };

  const toggleShuffle = () => {
    setIsShuffled(!isShuffled);
  };

  const toggleRepeat = () => {
    setIsRepeating(!isRepeating);
  };

  return (
    <div className="rounded-xl bg-background/90 backdrop-blur-md shadow-lg border overflow-hidden">
      <audio 
        ref={audioRef} 
        src={currentTrack.audioUrl} 
        preload="metadata"
      />
      
      {/* Album art and track info */}
      <div className="flex items-center p-4">
        <div className="relative w-16 h-16 mr-4 rounded-md overflow-hidden">
          <img 
            src={currentTrack.coverArt} 
            alt={`${currentTrack.title} by ${currentTrack.artist}`}
            className="object-cover w-full h-full"
          />
          <motion.div 
            className="absolute inset-0 bg-black/50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: isPlaying ? 0 : 0.5 }}
          >
            {!isPlaying && <Play className="text-white h-6 w-6" />}
          </motion.div>
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground truncate">{currentTrack.title}</h3>
          <p className="text-sm text-muted-foreground truncate">{currentTrack.artist}</p>
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="px-4 pb-2">
        <div className="w-full" ref={progressRef}>
          <Slider
            value={[currentTime]}
            min={0}
            max={duration || 1}
            step={0.01}
            onValueChange={handleTimeChange}
            className="w-full"
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
      
      {/* Player controls */}
      <div className="flex justify-between items-center p-4 pt-0">
        <div className="flex gap-1">
          <Button 
            variant="ghost" 
            size="icon"
            className={`rounded-full ${isShuffled ? 'text-primary' : 'text-muted-foreground'}`}
            onClick={toggleShuffle}
          >
            <Shuffle className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            className="rounded-full text-muted-foreground hover:text-foreground"
            onClick={handlePrevious}
          >
            <SkipBack className="h-5 w-5" />
          </Button>
          
          <Button 
            variant="default" 
            size="icon"
            className="rounded-full bg-primary hover:bg-primary/90 w-10 h-10"
            onClick={handlePlayPause}
          >
            {isPlaying ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5" />
            )}
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon"
            className="rounded-full text-muted-foreground hover:text-foreground"
            onClick={handleNext}
          >
            <SkipForward className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="flex gap-1 relative">
          <Button 
            variant="ghost" 
            size="icon"
            className={`rounded-full ${isRepeating ? 'text-primary' : 'text-muted-foreground'}`}
            onClick={toggleRepeat}
          >
            <Repeat className="h-5 w-5" />
          </Button>
          
          <div className="relative" onMouseEnter={() => setShowVolumeControl(true)} onMouseLeave={() => setShowVolumeControl(false)}>
            <Button 
              variant="ghost" 
              size="icon"
              className="rounded-full text-muted-foreground hover:text-foreground"
              onClick={toggleMute}
            >
              {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </Button>
            
            <motion.div 
              className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 bg-background border rounded-lg shadow-lg"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: showVolumeControl ? 1 : 0,
                scale: showVolumeControl ? 1 : 0.8,
                pointerEvents: showVolumeControl ? 'auto' : 'none'
              }}
              transition={{ duration: 0.2 }}
            >
              <div className="h-24">
                <Slider
                  value={[isMuted ? 0 : volume]}
                  min={0}
                  max={1}
                  step={0.01}
                  onValueChange={handleVolumeChange}
                  orientation="vertical"
                  className="h-full"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
