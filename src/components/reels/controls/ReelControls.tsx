
import React, { useState } from "react";
import { Flag } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import ReelUserInfo from "./ReelUserInfo";
import { FeelBar } from "@/components/reels/FeelBar";
import { reportReel } from "@/services/reel-service";
import { ReelWithUser } from "@/types/reels";

interface ReelControlsProps {
  reelWithUser: ReelWithUser;
  selectedEmotion: string | null;
  onEmotionSelect: (emotion: string) => void;
  openUnmuteThread: () => void;
}

const ReelControls: React.FC<ReelControlsProps> = ({
  reelWithUser,
  selectedEmotion,
  onEmotionSelect,
  openUnmuteThread
}) => {
  const [isReporting, setIsReporting] = useState(false);
  const { user: currentUser } = useAuth();
  const { reel, user } = reelWithUser;

  const handleReportReel = async () => {
    if (!currentUser) {
      toast.error("You must be logged in to report content");
      return;
    }
    
    if (isReporting) return;
    
    setIsReporting(true);
    
    try {
      await reportReel(reel.id, currentUser.id);
      toast.success("Reel reported. Thank you for helping keep our platform safe.");
    } catch (error) {
      console.error("Error reporting reel:", error);
      toast.error("Failed to report the reel");
    } finally {
      setIsReporting(false);
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-0 left-0 right-0 p-4 z-20 flex justify-between items-start">
        <div className="backdrop-blur-sm bg-black/10 rounded-full px-3 py-1.5 pointer-events-auto flex items-center">
          <ReelUserInfo user={user} />
          {reel.vibe_tag && (
            <span className="ml-2 py-0.5 px-2 bg-primary/20 rounded-full text-xs text-primary font-medium">
              {reel.vibe_tag}
            </span>
          )}
        </div>
        
        <button 
          onClick={handleReportReel}
          disabled={isReporting}
          className="p-2 rounded-full bg-black/10 backdrop-blur-sm pointer-events-auto hover:bg-black/20 transition-colors"
        >
          <Flag className="w-4 h-4 text-white/80 hover:text-white" />
        </button>
      </div>
      
      <div className="absolute bottom-32 left-4 right-4 pointer-events-auto">
        <FeelBar 
          selectedEmotion={selectedEmotion}
          onEmotionSelect={onEmotionSelect}
        />
      </div>
    </div>
  );
};

export default ReelControls;
