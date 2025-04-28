
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";

interface ReelReactionPickerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedEmotion: string | null;
  onSelect: (reaction: string) => void;
}

const ReelReactionPicker: React.FC<ReelReactionPickerProps> = ({
  isOpen,
  onClose,
  selectedEmotion,
  onSelect
}) => {
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

  const handleReactionSelect = (reaction: string) => {
    onSelect(reaction);
    onClose();
  };

  return (
    <div className="relative">
      <motion.button
        onClick={() => isOpen ? onClose() : onSelect(selectedEmotion || 'Love')}
        className={`w-12 h-12 rounded-full ${selectedEmotion ? "bg-pink-500/20" : "bg-black/20"} backdrop-blur-md flex items-center justify-center transition-colors`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {selectedEmotion ? (
          <span className="text-2xl">
            {reactions.find(r => r.name === selectedEmotion)?.emoji || '❤️'}
          </span>
        ) : (
          <Heart 
            className="w-6 h-6" 
            fill="none" 
            stroke="white" 
          />
        )}
      </motion.button>
      <span className={`text-xs mt-1 text-white/80 block text-center`}>
        {selectedEmotion || "Like"}
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
                  className={`w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors ${selectedEmotion === reaction.name ? 'bg-white/20' : ''}`}
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
