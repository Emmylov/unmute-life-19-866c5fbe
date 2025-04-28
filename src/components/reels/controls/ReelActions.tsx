
import React from "react";
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import ReelReactionPicker from "./ReelReactionPicker";
import { Button } from "@/components/ui/button";
import ReelMoreActionsMenu from "./ReelMoreActionsMenu";
import ReelSideActions from "./ReelSideActions";

interface ReelActionsProps {
  reelId: string;
  liked: boolean;
  likesCount: number;
  saved: boolean;
  commentCount: number;
  onLike: () => void;
  onSave: () => void;
  onRepost: () => void;
  onShare: () => void;
  shareData: { title: string; text: string; url: string };
  selectedEmotion: string | null;
  onEmotionSelect: (emotion: string) => void;
}

const ReelActions = ({
  reelId,
  liked,
  likesCount,
  saved,
  commentCount,
  onLike,
  onSave,
  onRepost,
  onShare,
  shareData,
  selectedEmotion,
  onEmotionSelect
}: ReelActionsProps) => {
  const [showReactionPicker, setShowReactionPicker] = React.useState(false);
  const [showMoreMenu, setShowMoreMenu] = React.useState(false);

  // Animation for the heart
  const heartVariants = {
    liked: { 
      scale: [1, 1.5, 1],
      transition: { duration: 0.4 }
    },
    unliked: { scale: 1 }
  };

  return (
    <div className="absolute right-0 bottom-0 z-20 flex flex-col items-center px-2 py-10">
      {/* Main vertical action buttons */}
      <div className="flex flex-col items-center space-y-6">
        <motion.div className="relative flex flex-col items-center">
          <motion.button
            className={cn(
              "flex flex-col items-center justify-center w-12 h-12 rounded-full",
              liked ? "bg-pink-500/20" : "bg-white/10 backdrop-blur-md"
            )}
            onClick={onLike}
            variants={heartVariants}
            animate={liked ? "liked" : "unliked"}
            whileTap={{ scale: 0.9 }}
          >
            <Heart
              className={cn(
                "w-6 h-6 transition-colors duration-300",
                liked ? "text-pink-500" : "text-white"
              )}
              fill={liked ? "#ec4899" : "none"}
            />
          </motion.button>
          <span className="text-xs mt-1 text-white">
            {likesCount > 0 ? likesCount.toLocaleString() : ''}
          </span>
          
          <ReelReactionPicker 
            isOpen={showReactionPicker}
            onClose={() => setShowReactionPicker(false)}
            selectedEmotion={selectedEmotion}
            onSelect={onEmotionSelect}
          />
        </motion.div>
      </div>
      
      {/* Side actions (comments, save, share) */}
      <ReelSideActions 
        commentCount={commentCount}
        saved={saved}
        onOpenUnmuteThread={() => {}}
        onRepost={onRepost}
        onToggleSave={onSave}
      />
      
      {/* More actions menu */}
      <div className="absolute top-0 right-2">
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/20"
          onClick={() => setShowMoreMenu(true)}
        >
          <MoreHorizontal className="w-5 h-5" />
        </Button>
        
        <ReelMoreActionsMenu 
          isOpen={showMoreMenu}
          onClose={() => setShowMoreMenu(false)}
          onShare={onShare}
          shareData={shareData}
          reelId={reelId}
        />
      </div>
    </div>
  );
};

export default ReelActions;
