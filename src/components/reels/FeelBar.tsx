
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
      className="backdrop-blur-sm bg-black/10 rounded-xl p-2 shadow-lg"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <p className="text-xs text-white/70 text-center mb-2">How did this make you feel?</p>
      <div className="flex justify-between">
        {emotions.map(emotion => (
          <button
            key={emotion.id}
            onClick={() => onEmotionSelect(emotion.id)}
            className={`flex flex-col items-center group px-2 py-1 rounded-lg transition-colors ${
              selectedEmotion === emotion.id 
                ? 'bg-primary/30' 
                : 'hover:bg-white/10'
            }`}
          >
            <motion.span 
              className="text-xl md:text-2xl"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.95 }}
            >
              {emotion.emoji}
            </motion.span>
            <span className={`text-[10px] md:text-xs mt-1 ${
              selectedEmotion === emotion.id 
                ? 'text-white' 
                : 'text-white/70 group-hover:text-white'
            }`}>
              {emotion.label}
            </span>
          </button>
        ))}
      </div>
    </motion.div>
  );
};
