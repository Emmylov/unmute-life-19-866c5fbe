
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Smile } from "lucide-react";

interface EmojiReactionsProps {
  reelId: string;
}

const emojis = ["❤️", "🔥", "🤯", "👏", "😂", "😢"];

const EmojiReactions: React.FC<EmojiReactionsProps> = ({ reelId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [showFloatingEmoji, setShowFloatingEmoji] = useState(false);
  const [floatingEmoji, setFloatingEmoji] = useState("");

  const toggleEmojiPicker = () => {
    setIsOpen(!isOpen);
  };

  const addReaction = (emoji: string) => {
    setSelectedEmoji(emoji);
    setFloatingEmoji(emoji);
    setShowFloatingEmoji(true);
    setIsOpen(false);
    
    // Add reaction to Supabase (could be implemented later)
    
    setTimeout(() => {
      setShowFloatingEmoji(false);
    }, 1500);
  };

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="flex flex-col items-center"
        onClick={toggleEmojiPicker}
      >
        <div className="w-12 h-12 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center">
          {selectedEmoji ? (
            <span className="text-xl">{selectedEmoji}</span>
          ) : (
            <Smile className="w-6 h-6 text-white" />
          )}
        </div>
        <span className="text-white text-xs mt-1">React</span>
      </motion.button>

      {/* Emoji Picker */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 0 }}
            animate={{ opacity: 1, scale: 1, y: -20 }}
            exit={{ opacity: 0, scale: 0.8, y: 0 }}
            className="absolute left-0 bottom-full mb-2 bg-white/20 backdrop-blur-xl p-2 rounded-full shadow-lg"
          >
            <div className="flex space-x-2">
              {emojis.map((emoji) => (
                <motion.button
                  key={emoji}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors text-lg"
                  onClick={() => addReaction(emoji)}
                >
                  {emoji}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Emoji Animation */}
      <AnimatePresence>
        {showFloatingEmoji && (
          <motion.div
            key={`floating-${Date.now()}`}
            initial={{ y: 0, opacity: 1, scale: 1 }}
            animate={{ y: -80, opacity: 0, scale: 2 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute left-1/2 -translate-x-1/2 bottom-full text-3xl pointer-events-none"
          >
            {floatingEmoji}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EmojiReactions;
