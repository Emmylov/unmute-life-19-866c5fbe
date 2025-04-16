
import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Play, AlertCircle, HeartIcon } from "lucide-react";

interface ReelVideoProps {
  videoUrl: string;
  thumbnailUrl?: string | null;
  isPlaying: boolean;
  isMuted: boolean;
  currentIndex: number;
  onTogglePlay: () => void;
  onDoubleTap?: () => void;
}

const ReelVideo = ({ 
  videoUrl, 
  thumbnailUrl, 
  isPlaying,
  isMuted,
  currentIndex,
  onTogglePlay,
  onDoubleTap
}: ReelVideoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loadError, setLoadError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showHeart, setShowHeart] = useState<boolean>(false);
  const [lastTapTime, setLastTapTime] = useState<number>(0);
  const [tapPosition, setTapPosition] = useState<{x: number, y: number}>({x: 0, y: 0});
  
  // Animation variants for the heart animation
  const heartVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: { 
      opacity: 1, 
      scale: [0, 1.2, 1],
      transition: { duration: 0.5 } 
    },
    exit: { 
      opacity: 0,
      scale: 0.8,
      transition: { duration: 0.3 } 
    }
  };

  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying && !loadError) {
        videoRef.current.play().catch(error => {
          console.error("Error playing video:", error);
          setLoadError(true);
          
          if (error.name === "NotAllowedError") {
            setErrorMessage("Autoplay was blocked. Please interact with the page first.");
          } else if (error.name === "NotSupportedError") {
            setErrorMessage("This video format is not supported by your browser.");
          } else {
            setErrorMessage("The video couldn't be played. It may be in an unsupported format or the file might be corrupted.");
          }
        });
      } else {
        videoRef.current.pause();
      }
      
      videoRef.current.muted = isMuted;
    }
  }, [isPlaying, isMuted, currentIndex, loadError, videoUrl]);

  useEffect(() => {
    // Reset error state when changing videos
    setLoadError(false);
    setErrorMessage("");
    setIsLoading(true);
    
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      
      if (videoUrl && videoUrl.trim() !== "") {
        videoRef.current.load(); // Make sure to load the new video source
        
        // Only try to autoplay if the component wants to play
        if (isPlaying) {
          videoRef.current.play().catch(error => {
            console.error("Error auto-playing video:", error);
            setLoadError(true);
            setErrorMessage("The video couldn't be played automatically. Try clicking on the video to play.");
          });
        }
      } else {
        console.error("Empty or invalid video URL provided");
        setLoadError(true);
        setErrorMessage("No valid video source was provided.");
      }
    }
  }, [currentIndex, videoUrl, isPlaying]);

  const handleVideoError = () => {
    console.error("Video failed to load:", videoUrl);
    setLoadError(true);
    setErrorMessage("The video couldn't be played. It may be in an unsupported format or the file might be corrupted.");
  };

  const handleLoadedData = () => {
    console.log("Video loaded successfully:", videoUrl);
    setIsLoading(false);
  };

  const handleTap = (e: React.MouseEvent | React.TouchEvent) => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300; // ms
    
    // Get tap position for the heart animation
    let x, y;
    if ('touches' in e) {
      // Touch event
      const touch = e.touches[0] || e.changedTouches[0];
      x = touch.clientX;
      y = touch.clientY;
    } else {
      // Mouse event
      x = e.clientX;
      y = e.clientY;
    }
    
    setTapPosition({ x, y });
    
    if (now - lastTapTime < DOUBLE_TAP_DELAY) {
      // Double tap detected
      if (onDoubleTap) {
        onDoubleTap();
        setShowHeart(true);
        setTimeout(() => setShowHeart(false), 1000);
      }
    } else {
      // Single tap
      setTimeout(() => {
        if (now === lastTapTime) {
          onTogglePlay();
        }
      }, DOUBLE_TAP_DELAY);
    }
    
    setLastTapTime(now);
  };

  return (
    <>
      <div 
        className="absolute inset-0 flex items-center justify-center" 
        onClick={handleTap}
        onTouchStart={handleTap}
      >
        {!loadError ? (
          <video 
            ref={videoRef}
            src={videoUrl}
            className="w-full h-full object-cover"
            playsInline
            loop
            poster={thumbnailUrl || undefined}
            onError={handleVideoError}
            onLoadedData={handleLoadedData}
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
                {errorMessage}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Loading indicator */}
      {isLoading && !loadError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-12 w-12 bg-primary/20 rounded-full mb-2"></div>
            <div className="h-4 w-24 bg-white/20 rounded"></div>
          </div>
        </div>
      )}

      {/* Play/Pause indicator */}
      {!isPlaying && !loadError && !isLoading && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 flex items-center justify-center bg-black/30"
        >
          <Play className="w-16 h-16 text-white opacity-80" fill="white" />
        </motion.div>
      )}

      {/* Double tap heart animation */}
      {showHeart && (
        <motion.div
          className="absolute pointer-events-none"
          style={{ 
            left: tapPosition.x,
            top: tapPosition.y,
            translateX: "-50%",
            translateY: "-50%"
          }}
          variants={heartVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <HeartIcon className="w-24 h-24 text-white fill-red-500" />
        </motion.div>
      )}
    </>
  );
};

export default ReelVideo;
