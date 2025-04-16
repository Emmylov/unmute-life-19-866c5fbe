
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
        <div className="text-7xl filter drop-shadow-xl">
          {selectedEmotion === 'Love' && '❤️'}
          {selectedEmotion === 'Laugh' && '😂'}
          {selectedEmotion === 'Wow' && '😲'}
          {selectedEmotion === 'Sad' && '😢'}
          {selectedEmotion === 'Angry' && '😡'}
          {selectedEmotion === 'Fire' && '🔥'}
          {selectedEmotion === 'Clap' && '👏'}
          {selectedEmotion === 'Mind Blown' && '🤯'}
          {selectedEmotion === 'Relatable' && '💬'}
          {selectedEmotion === 'Made Me Feel' && '❤️'}
          {selectedEmotion === 'Shared This' && '🔄'}
          {selectedEmotion === 'Still Thinking' && '👀'}
        </div>
      ) : (
        <Heart 
          className="w-32 h-32 text-pink-500 filter drop-shadow-xl" 
          fill={liked ? "#ec4899" : "none"} 
          stroke={liked ? "#ec4899" : "white"}
          strokeWidth={1.5} 
        />
      )}
    </motion.div>
  );
};

export default ReelEmotionDisplay;
