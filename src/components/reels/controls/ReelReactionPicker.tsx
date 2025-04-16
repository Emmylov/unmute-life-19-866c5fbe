
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";

interface ReelReactionPickerProps {
  onSelectReaction: (reaction: string) => void;
  selectedReaction: string | null;
  liked: boolean;
}

const ReelReactionPicker: React.FC<ReelReactionPickerProps> = ({
  onSelectReaction,
  selectedReaction,
  liked
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const reactions = [
    { name: 'Love', emoji: '❤️' },
    { name: 'Laugh', emoji: '😂' },
    { name: 'Wow', emoji: '😲' },
    { name: 'Sad', emoji: '😢' },
    { name: 'Angry', emoji: '😡' },
    { name: 'Fire', emoji: '🔥' },
    { name: 'Clap', emoji: '👏' },
    { name: 'Mind Blown', emoji: '🤯' },
  ];

  const toggleReactions = () => {
    setIsOpen(!isOpen);
  };

  const handleReactionSelect = (reaction: string) => {
    onSelectReaction(reaction);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <motion.button
        onClick={toggleReactions}
        className={`w-12 h-12 rounded-full ${liked || selectedReaction ? "bg-pink-500/20" : "bg-black/20"} backdrop-blur-md flex items-center justify-center transition-colors`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {selectedReaction ? (
          <span className="text-2xl">
            {reactions.find(r => r.name === selectedReaction)?.emoji || '❤️'}
          </span>
        ) : (
          <Heart 
            className="w-6 h-6" 
            fill={liked ? "#ec4899" : "none"} 
            stroke={liked ? "#ec4899" : "white"} 
          />
        )}
      </motion.button>
      <span className={`text-xs mt-1 text-white/80 block text-center`}>
        {selectedReaction || (liked ? "Liked" : "Like")}
      </span>

      {/* Reaction Picker Popup */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            className="absolute bottom-16 right-0 bg-black/80 backdrop-blur-lg p-2 rounded-xl shadow-lg z-50 border border-white/20 transform translate-x-1/2"
          >
            <div className="grid grid-cols-4 gap-1">
              {reactions.map((reaction) => (
                <motion.button
                  key={reaction.name}
                  onClick={() => handleReactionSelect(reaction.name)}
                  className={`w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors ${selectedReaction === reaction.name ? 'bg-white/20' : ''}`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <span className="text-lg">{reaction.emoji}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReelReactionPicker;
