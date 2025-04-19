
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { PlayCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FoundersVideoProps {
  videoUrl: string;
  className?: string;
  muted?: boolean;
}

const FoundersVideo = ({ videoUrl, className, muted = true }: FoundersVideoProps) => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <Card className={cn("overflow-hidden relative group", className)}>
      {!isPlaying ? (
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
          />
        </div>
      )}
    </Card>
  );
};

export default FoundersVideo;
