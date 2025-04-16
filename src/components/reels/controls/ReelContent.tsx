
import React from "react";
import { useIsMobile } from "@/hooks/use-responsive";
import ReelCaption from "./ReelCaption";
import ReelAudioInfo from "./ReelAudioInfo";
import { ReelContent as ReelContentType } from "@/types/reels";
import { motion } from "framer-motion";

interface ReelContentProps {
  reel: ReelContentType;
}

const ReelContent: React.FC<ReelContentProps> = ({ reel }) => {
  const isMobile = useIsMobile();
  
  // Animation variants for the content
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.3,
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };
  
  return (
    <motion.div 
      className="space-y-1" 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Caption with minimal backdrop */}
      <motion.div 
        className="backdrop-blur-sm bg-black/5 rounded-lg p-1 max-w-[80%] w-auto inline-block" 
        variants={itemVariants}
      >
        <ReelCaption caption={reel.caption} />
        
        <ReelAudioInfo 
          audio={reel.audio} 
          audioType={reel.audio_type} 
          audioUrl={reel.audio_url} 
        />
        
        {reel.tags && reel.tags.length > 0 && (
          <motion.div 
            className="flex flex-wrap gap-1 mt-1"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            {reel.tags.map((tag, index) => (
              <motion.span 
                key={index}
                variants={itemVariants}
                className="text-xs font-medium text-white/80 bg-white/5 rounded-full px-1.5 py-0.5 backdrop-blur-sm hover:bg-white/10 transition-colors cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                #{tag}
              </motion.span>
            ))}
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ReelContent;
