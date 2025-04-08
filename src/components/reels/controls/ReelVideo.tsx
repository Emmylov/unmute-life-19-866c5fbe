
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

const SUPPORTED_VIDEO_FORMATS = [
  'video/mp4',
  'video/webm',
  'video/ogg',
  'video/quicktime', // .mov files
];

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
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying && !loadError) {
        console.log("Attempting to play video:", videoUrl);
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
      
      // Log the video URL for debugging
      console.log("Loading new video URL:", videoUrl);
      
      if (videoUrl && videoUrl.trim() !== "") {
        videoRef.current.play().catch(error => {
          console.error("Error auto-playing video:", error);
          setLoadError(true);
          setErrorMessage("The video couldn't be played. It may be in an unsupported format or the file might be corrupted.");
        });
      } else {
        console.error("Empty or invalid video URL provided");
        setLoadError(true);
        setErrorMessage("No valid video source was provided.");
      }
    }
  }, [currentIndex, videoUrl]);

  const handleVideoError = () => {
    console.error("Video failed to load:", videoUrl);
    setLoadError(true);
    setErrorMessage("The video couldn't be played. It may be in an unsupported format or the file might be corrupted.");
  };

  const handleLoadedData = () => {
    console.log("Video loaded successfully:", videoUrl);
    setIsLoading(false);
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

      {isLoading && !loadError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-12 w-12 bg-primary/20 rounded-full mb-2"></div>
            <div className="h-4 w-24 bg-white/20 rounded"></div>
          </div>
        </div>
      )}

      {!isPlaying && !loadError && !isLoading && (
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
