
import React from 'react';
import { motion } from 'framer-motion';

interface FeelBarProps {
  selectedEmotion: string | null;
  onEmotionSelect: (emotion: string) => void;
}

export const FeelBar: React.FC<FeelBarProps> = ({ selectedEmotion, onEmotionSelect }) => {
  // Define our emotion options
  const emotions = [
    { id: 'Relatable', emoji: '💬', label: 'Relatable' },
    { id: 'Made Me Feel', emoji: '❤️', label: 'Made Me Feel' },
    { id: 'Shared This', emoji: '🔄', label: 'Shared This' },
    { id: 'Still Thinking', emoji: '👀', label: 'Still Thinking' }
  ];

  return (
    <motion.div 
      className="backdrop-blur-md bg-black/30 rounded-xl p-3 shadow-lg"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <p className="text-xs text-white/90 text-center mb-2 font-medium">How did this make you feel?</p>
      <div className="flex justify-between space-x-2">
        {emotions.map(emotion => (
          <motion.button
            key={emotion.id}
            onClick={() => onEmotionSelect(emotion.id)}
            className={`flex flex-col items-center group px-2.5 py-1.5 rounded-lg transition-colors ${
              selectedEmotion === emotion.id 
                ? 'bg-primary/40' 
                : 'hover:bg-white/20'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-lg md:text-xl">
              {emotion.emoji}
            </span>
            <span className={`text-[10px] md:text-xs mt-1 ${
              selectedEmotion === emotion.id 
                ? 'text-white' 
                : 'text-white/80 group-hover:text-white'
            }`}>
              {emotion.label}
            </span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default FeelBar;
