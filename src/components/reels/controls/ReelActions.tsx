
import React from "react";
import { Heart, MessageCircle, Repeat, Bookmark, Share2 } from "lucide-react";
import ReelActionButton from "./ReelActionButton";
import { useAnimation } from "framer-motion";
import { toast } from "sonner";

interface ReelActionsProps {
  reelId: string;
  liked: boolean;
  saved: boolean;
  onLike: () => void;
  onSave: () => void;
  onShare?: () => void;
  shareData?: {
    title: string;
    text: string;
    url: string;
  };
}

const ReelActions = ({ 
  reelId, 
  liked, 
  saved, 
  onLike, 
  onSave,
  onShare,
  shareData
}: ReelActionsProps) => {
  const handleShare = async () => {
    if (!shareData) return;
    
    try {
      if (navigator.share) {
        await navigator.share(shareData);
        toast.success("Shared successfully!");
      } else {
        // Fallback for browsers that don't support Web Share API
        await navigator.clipboard.writeText(shareData.url);
        toast.success("Link copied to clipboard!");
      }
    } catch (error) {
      console.error("Error sharing:", error);
      if ((error as Error).name !== 'AbortError') {
        toast.error("Failed to share");
      }
    }
    
    // Call the callback if provided
    if (onShare) onShare();
  };

  return (
    <div className="absolute bottom-20 right-4 flex flex-col space-y-6 pointer-events-auto">
      <ReelActionButton 
        icon={Heart} 
        label={liked ? "Liked" : "Like"}
        isActive={liked}
        activeColor="text-pink-500 fill-pink-500"
        onClick={onLike}
      />
      
      <ReelActionButton 
        icon={MessageCircle} 
        label="Comment"
      />
      
      <ReelActionButton 
        icon={Repeat} 
        label="Repost"
      />
      
      <ReelActionButton 
        icon={Bookmark} 
        label={saved ? "Saved" : "Save"}
        isActive={saved}
        activeColor="text-blue-400 fill-blue-400"
        onClick={onSave}
      />
      
      <ReelActionButton 
        icon={Share2}
        label="Share"
        onClick={handleShare}
      />
    </div>
  );
};

export default ReelActions;
