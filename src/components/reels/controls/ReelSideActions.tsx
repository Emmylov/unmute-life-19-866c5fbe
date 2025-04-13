
import React from "react";
import { MessageCircle, Repeat, Bookmark } from "lucide-react";
import { useIsMobile } from "@/hooks/use-responsive";
import { motion } from "framer-motion";

interface ReelSideActionsProps {
  commentCount: number;
  saved: boolean;
  onOpenUnmuteThread: () => void;
  onRepost: () => void;
  onToggleSave: () => void;
}

const ReelSideActions: React.FC<ReelSideActionsProps> = ({
  commentCount,
  saved,
  onOpenUnmuteThread,
  onRepost,
  onToggleSave
}) => {
  const isMobile = useIsMobile();

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
    <motion.div 
      className={`absolute bottom-24 right-3 md:right-4 flex flex-col space-y-5 pointer-events-auto z-20`}
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.button 
        onClick={onOpenUnmuteThread}
        className="flex flex-col items-center"
        variants={item}
      >
        <div className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md hover:bg-black/30 flex items-center justify-center transition-colors">
          <MessageCircle className="w-5 h-5 text-white" />
        </div>
        <span className="text-xs text-white/90 mt-1">
          {commentCount > 0 ? commentCount : 'Unmute'}
        </span>
      </motion.button>
      
      <motion.button 
        onClick={onRepost}
        className="flex flex-col items-center"
        variants={item}
      >
        <div className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md hover:bg-black/30 flex items-center justify-center transition-colors">
          <Repeat className="w-5 h-5 text-white" />
        </div>
        <span className="text-xs text-white/90 mt-1">Share</span>
      </motion.button>
      
      <motion.button 
        onClick={onToggleSave}
        className="flex flex-col items-center"
        variants={item}
      >
        <div className={`w-10 h-10 rounded-full ${saved ? 'bg-blue-500/50' : 'bg-black/20'} backdrop-blur-md hover:bg-black/30 flex items-center justify-center transition-colors`}>
          <Bookmark className="w-5 h-5 text-white" fill={saved ? "white" : "none"} />
        </div>
        <span className="text-xs text-white/90 mt-1">Save</span>
      </motion.button>
    </motion.div>
  );
};

export default ReelSideActions;
