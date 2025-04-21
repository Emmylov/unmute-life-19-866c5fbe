
import React, { useEffect, useRef, useState } from "react";

interface FoundersVideoProps {
  videoUrl: string;
  muted?: boolean;
  className?: string;
  fallbackImageUrl?: string;
  autoPlay?: boolean;
}

const FoundersVideo = ({
  videoUrl,
  muted = true,
  className = "",
  fallbackImageUrl,
  autoPlay = true,
}: FoundersVideoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

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
    };

    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("error", handleError);

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
    };
  }, [videoUrl, autoPlay]);

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
