
import React, { useState } from "react";
import { Heart, MessageCircle, Repeat, Bookmark, Share2 } from "lucide-react";
import ReelActionButton from "./ReelActionButton";
import { toast } from "sonner";
import ReelCommentModal from "../ReelCommentModal";
import { useIsMobile } from "@/hooks/use-responsive";
import { motion } from "framer-motion";

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
  const isMobile = useIsMobile();
  
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

  // Use different spacing based on screen size
  const buttonSpacingClass = isMobile ? "space-y-5" : "space-y-7";
  const containerPosition = isMobile ? "right-4" : "right-6";

  // Animation variants
  const container = {
    hidden: { opacity: 0, x: 20 },
    show: {
      opacity: 1,
      x: 0,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, x: 20 },
    show: { opacity: 1, x: 0 }
  };

  return (
    <>
      <motion.div 
        className={`absolute bottom-24 ${containerPosition} flex flex-col ${buttonSpacingClass} pointer-events-auto z-20`}
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* Like button with improved animation */}
        <motion.div 
          variants={item}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="relative"
        >
          <ReelActionButton 
            icon={Heart} 
            label={liked ? "Liked" : "Like"}
            isActive={liked}
            activeColor="text-pink-500 fill-pink-500"
            onClick={onLike}
            isMobile={isMobile}
            showAnimation={liked}
          />
        </motion.div>
        
        {/* Comment button */}
        <motion.div 
          variants={item}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ReelActionButton 
            icon={MessageCircle} 
            label={commentCount > 0 ? `${commentCount}` : "Comment"}
            onClick={handleOpenComments}
            isMobile={isMobile}
            badge={commentCount > 0 ? commentCount : undefined}
          />
        </motion.div>
        
        {/* Repost button */}
        <motion.div 
          variants={item}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ReelActionButton 
            icon={Repeat} 
            label="Repost"
            onClick={handleRepost}
            isMobile={isMobile}
          />
        </motion.div>
        
        {/* Save button */}
        <motion.div 
          variants={item}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ReelActionButton 
            icon={Bookmark} 
            label={saved ? "Saved" : "Save"}
            isActive={saved}
            activeColor="text-blue-400 fill-blue-400"
            onClick={onSave}
            isMobile={isMobile}
          />
        </motion.div>
        
        {/* Share button */}
        <motion.div 
          variants={item}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ReelActionButton 
            icon={Share2}
            label="Share"
            onClick={handleShare}
            isMobile={isMobile}
          />
        </motion.div>
      </motion.div>

      {/* Comment modal */}
      <ReelCommentModal
        reelId={reelId}
        isOpen={isCommentModalOpen}
        onClose={() => setIsCommentModalOpen(false)}
      />
    </>
  );
};

export default ReelActions;
