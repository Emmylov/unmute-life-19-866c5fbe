
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { PlayCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FoundersVideoProps {
  videoUrl: string;
  className?: string;
  muted?: boolean;
  autoPlay?: boolean;
}

const FoundersVideo = ({ videoUrl, className, muted = true, autoPlay = false }: FoundersVideoProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoError, setVideoError] = useState(false);

  // Attempt to preload the video to check if it exists
  useEffect(() => {
    const checkVideo = () => {
      const video = document.createElement("video");
      video.src = videoUrl;
      
      video.onloadeddata = () => {
        setVideoError(false);
        if (autoPlay) {
          setIsPlaying(true);
        }
      };
      
      video.onerror = () => {
        console.error("Error loading video from URL:", videoUrl);
        setVideoError(true);
      };
    };
    
    if (videoUrl) {
      checkVideo();
    }
    
    // Clean up
    return () => {
      setVideoError(false);
    };
  }, [videoUrl, autoPlay]);

  return (
    <Card className={cn("overflow-hidden relative group", className)}>
      {videoError ? (
        <div className="aspect-video bg-gray-900 flex items-center justify-center">
          <div className="text-white text-center p-4">
            <p>Video not available</p>
            <p className="text-sm opacity-70 mt-2">Please check the video URL</p>
          </div>
        </div>
      ) : !isPlaying ? (
        <div 
          className="relative cursor-pointer"
          onClick={() => setIsPlaying(true)}
        >
          <div className="aspect-video bg-gray-900 flex items-center justify-center">
            <PlayCircle className="w-16 h-16 text-white opacity-80 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
            <h3 className="text-white font-semibold">
              Message from our Founders
            </h3>
          </div>
        </div>
      ) : (
        <div className="aspect-video">
          <video
            src={videoUrl}
            className="w-full h-full"
            controls
            autoPlay
            muted={muted}
            onError={() => setVideoError(true)}
          />
        </div>
      )}
    </Card>
  );
};

export default FoundersVideo;
