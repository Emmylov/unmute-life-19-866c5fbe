
import React, { useEffect, useRef, useState } from "react";

interface FoundersVideoProps {
  videoUrl: string;
  muted?: boolean;
  className?: string;
  fallbackImageUrl?: string;
  autoPlay?: boolean;
  onLoadError?: () => void;
  onLoadSuccess?: () => void;
}

const FoundersVideo = ({
  videoUrl,
  muted = true,
  className = "",
  fallbackImageUrl,
  autoPlay = true,
  onLoadError,
  onLoadSuccess,
}: FoundersVideoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Fallback URL for video if the primary one fails
  const fallbackVideoUrl = "https://lovable-uploads.s3.amazonaws.com/default/welcome-video.mp4";

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleError = () => {
      console.error("Video failed to load:", videoUrl);
      setError(true);
      if (onLoadError) onLoadError();
      
      // Try loading the fallback video URL if available
      if (videoUrl !== fallbackVideoUrl) {
        console.log("Attempting to load fallback video");
        video.src = fallbackVideoUrl;
        video.load();
      }
    };
    
    const handleLoadedData = () => {
      setIsLoading(false);
      if (onLoadSuccess) onLoadSuccess();
    };

    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("error", handleError);
    video.addEventListener("loadeddata", handleLoadedData);

    // Attempt to play the video if autoPlay is true
    if (autoPlay) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          // Auto-play was prevented
          console.warn("Autoplay prevented:", error);
          // Don't set error state, as this is expected in some browsers
        });
      }
    }

    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("error", handleError);
      video.removeEventListener("loadeddata", handleLoadedData);
    };
  }, [videoUrl, autoPlay, fallbackVideoUrl, onLoadError, onLoadSuccess]);

  // Handle loading state
  if (isLoading && !error) {
    return (
      <div className={`relative overflow-hidden rounded-lg flex items-center justify-center bg-gray-100 ${className}`} style={{ minHeight: "200px" }}>
        <div className="flex flex-col items-center justify-center p-4">
          <div className="animate-spin h-8 w-8 border-4 border-unmute-purple rounded-full border-t-transparent"></div>
          <p className="mt-2 text-sm text-gray-500">Loading video...</p>
        </div>
      </div>
    );
  }

  // If there's an error and we have a fallback image, show it
  if (error && fallbackImageUrl) {
    return (
      <div className={`relative overflow-hidden rounded-lg ${className}`}>
        <img 
          src={fallbackImageUrl} 
          alt="Video preview" 
          className="w-full h-auto"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <span className="text-white text-sm">Video unavailable</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden rounded-lg ${className}`}>
      <video
        ref={videoRef}
        src={videoUrl}
        muted={muted}
        playsInline
        controls
        preload="metadata"
        className="w-full h-auto"
        onError={() => setError(true)}
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default FoundersVideo;
