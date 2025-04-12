
import React, { useState } from "react";
import { Heart, MessageCircle, Repeat, Bookmark, Share2 } from "lucide-react";
import ReelActionButton from "./ReelActionButton";
import { toast } from "sonner";
import ReelCommentModal from "../ReelCommentModal";

interface ReelActionsProps {
  reelId: string;
  liked: boolean;
  saved: boolean;
  commentCount?: number;
  onLike: () => void;
  onSave: () => void;
  onRepost?: () => void;
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
  commentCount = 0,
  onLike, 
  onSave,
  onRepost,
  onShare,
  shareData
}: ReelActionsProps) => {
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  
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

  const handleOpenComments = () => {
    setIsCommentModalOpen(true);
  };

  const handleRepost = () => {
    if (onRepost) {
      onRepost();
    } else {
      toast.info("Repost functionality coming soon!");
    }
  };

  return (
    <>
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
          label={commentCount > 0 ? `${commentCount}` : "Comment"}
          onClick={handleOpenComments}
        />
        
        <ReelActionButton 
          icon={Repeat} 
          label="Repost"
          onClick={handleRepost}
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

      <ReelCommentModal
        reelId={reelId}
        isOpen={isCommentModalOpen}
        onClose={() => setIsCommentModalOpen(false)}
      />
    </>
  );
};

export default ReelActions;
