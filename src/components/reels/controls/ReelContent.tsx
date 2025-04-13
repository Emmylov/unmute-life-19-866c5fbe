
import React from "react";
import { useIsMobile } from "@/hooks/use-responsive";
import ReelCaption from "./ReelCaption";
import ReelAudioInfo from "./ReelAudioInfo";
import { ReelContent as ReelContentType } from "@/types/reels";

interface ReelContentProps {
  reel: ReelContentType;
}

const ReelContent: React.FC<ReelContentProps> = ({ reel }) => {
  const isMobile = useIsMobile();
  
  return (
    <div className={`absolute bottom-16 left-4 ${isMobile ? 'right-16' : 'right-24'} pointer-events-auto`}>
      <div className="backdrop-blur-sm bg-black/10 rounded-xl p-3 space-y-2">
        <ReelCaption caption={reel.caption} />
        
        <ReelAudioInfo 
          audio={reel.audio} 
          audioType={reel.audio_type} 
          audioUrl={reel.audio_url} 
        />
        
        {reel.tags && reel.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {reel.tags.map((tag, index) => (
              <span key={index} className="text-xs text-primary bg-primary/10 rounded-full px-2 py-0.5">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReelContent;
