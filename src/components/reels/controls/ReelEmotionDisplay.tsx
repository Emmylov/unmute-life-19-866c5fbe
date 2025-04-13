
import React from "react";
import { Heart } from "lucide-react";
import { motion, AnimationControls } from "framer-motion";

interface ReelEmotionDisplayProps {
  selectedEmotion: string | null;
  liked: boolean;
  controls: AnimationControls;
}

const ReelEmotionDisplay: React.FC<ReelEmotionDisplayProps> = ({ 
  selectedEmotion, 
  liked, 
  controls 
}) => {
  return (
    <motion.div
      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-30"
      animate={controls}
      initial={{ opacity: 0, scale: 1 }}
    >
      {selectedEmotion ? (
        <div className="text-5xl filter drop-shadow-lg">
          {selectedEmotion === 'Relatable' && '💬'}
          {selectedEmotion === 'Made Me Feel' && '❤️'}
          {selectedEmotion === 'Shared This' && '🔄'}
          {selectedEmotion === 'Still Thinking' && '👀'}
        </div>
      ) : (
        <Heart className="w-20 h-20 text-primary filter drop-shadow-lg" fill={liked ? "#ec4899" : "none"} />
      )}
    </motion.div>
  );
};

export default ReelEmotionDisplay;
