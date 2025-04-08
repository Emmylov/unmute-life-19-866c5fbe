
import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Play, AlertCircle } from "lucide-react";

interface ReelVideoProps {
  videoUrl: string;
  thumbnailUrl?: string | null;
  isPlaying: boolean;
  isMuted: boolean;
  currentIndex: number;
  onTogglePlay: () => void;
}

const ReelVideo = ({ 
  videoUrl, 
  thumbnailUrl, 
  isPlaying,
  isMuted,
  currentIndex,
  onTogglePlay
}: ReelVideoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loadError, setLoadError] = useState<boolean>(false);

  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying && !loadError) {
        videoRef.current.play().catch(error => {
          console.error("Error playing video:", error);
          setLoadError(true);
        });
      } else {
        videoRef.current.pause();
      }
      
      videoRef.current.muted = isMuted;
    }
  }, [isPlaying, isMuted, currentIndex, loadError]);

  useEffect(() => {
    // Reset error state when changing videos
    setLoadError(false);
    
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(error => {
        console.error("Error auto-playing video:", error);
        setLoadError(true);
      });
    }
  }, [currentIndex, videoUrl]);

  const handleVideoError = () => {
    console.error("Video failed to load:", videoUrl);
    setLoadError(true);
  };

  return (
    <>
      <div className="absolute inset-0 flex items-center justify-center">
        {!loadError ? (
          <video 
            ref={videoRef}
            src={videoUrl}
            className="w-full h-full object-cover"
            playsInline
            loop
            onClick={onTogglePlay}
            poster={thumbnailUrl || undefined}
            onError={handleVideoError}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900">
            {thumbnailUrl ? (
              <img 
                src={thumbnailUrl} 
                alt="Video thumbnail" 
                className="w-full h-full object-cover opacity-50"
              />
            ) : null}
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 p-4 text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mb-2" />
              <h3 className="text-white text-lg font-bold mb-1">Video Playback Error</h3>
              <p className="text-white/80 text-sm max-w-xs">
                The video couldn't be played. It may be in an unsupported format or the file might be corrupted.
              </p>
            </div>
          </div>
        )}
      </div>

      {!isPlaying && !loadError && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 flex items-center justify-center bg-black/30"
        >
          <Play className="w-16 h-16 text-white opacity-80" />
        </motion.div>
      )}
    </>
  );
};

export default ReelVideo;
