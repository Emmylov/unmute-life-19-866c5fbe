
import React, { useState } from "react";
import { MessageCircle, Repeat, Bookmark, Share2 } from "lucide-react";
import { motion } from "framer-motion";
import ReelActionButton from "./ReelActionButton";
import ReelMoreActionsMenu from "./ReelMoreActionsMenu";
import ReelReactionPicker from "./ReelReactionPicker";
import { toast } from "sonner";
import ReelCommentModal from "../ReelCommentModal";
import { useIsMobile } from "@/hooks/use-responsive";

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
  selectedEmotion: string | null;
  onEmotionSelect: (emotion: string) => void;
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
  shareData,
  selectedEmotion,
  onEmotionSelect
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
  const buttonSpacingClass = isMobile ? "space-y-4" : "space-y-6";
  const containerPosition = isMobile ? "right-3" : "right-5";

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
        {/* Enhanced Reaction Picker */}
        <motion.div 
          variants={item}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ReelReactionPicker
            onSelectReaction={onEmotionSelect}
            selectedReaction={selectedEmotion}
            liked={liked}
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
        
        {/* "More" dropdown menu for additional actions */}
        <motion.div
          variants={item}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="flex flex-col items-center"
        >
          <ReelMoreActionsMenu 
            onCopyLink={() => {
              if (shareData) {
                navigator.clipboard.writeText(shareData.url);
                toast.success("Link copied to clipboard!");
              }
            }}
            onSendTo={handleShare}
          />
          <span className="text-xs mt-1 text-white/80">More</span>
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
