
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
    <div className="space-y-3">
      {/* Caption with improved backdrop */}
      <div className="backdrop-blur-md bg-black/20 rounded-xl p-4 shadow-lg">
        <ReelCaption caption={reel.caption} />
        
        <ReelAudioInfo 
          audio={reel.audio} 
          audioType={reel.audio_type} 
          audioUrl={reel.audio_url} 
        />
        
        {reel.tags && reel.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {reel.tags.map((tag, index) => (
              <span 
                key={index} 
                className="text-xs font-medium text-white/90 bg-white/10 rounded-full px-3 py-1 backdrop-blur-sm"
              >
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
