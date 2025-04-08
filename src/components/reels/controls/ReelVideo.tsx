
import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";

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

  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch(error => {
          console.error("Error playing video:", error);
        });
      } else {
        videoRef.current.pause();
      }
      
      videoRef.current.muted = isMuted;
    }
  }, [isPlaying, isMuted, currentIndex]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(error => {
        console.error("Error auto-playing video:", error);
      });
    }
  }, [currentIndex]);

  return (
    <>
      <div className="absolute inset-0 flex items-center justify-center">
        <video 
          ref={videoRef}
          src={videoUrl}
          className="w-full h-full object-cover"
          playsInline
          loop
          onClick={onTogglePlay}
          poster={thumbnailUrl || undefined}
        />
      </div>

      {!isPlaying && (
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
