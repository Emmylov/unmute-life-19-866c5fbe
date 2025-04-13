
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
      className="backdrop-blur-lg bg-black/30 rounded-xl p-3 shadow-xl"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <p className="text-xs text-white/80 text-center mb-2 font-medium">How did this make you feel?</p>
      <div className="flex justify-between">
        {emotions.map(emotion => (
          <button
            key={emotion.id}
            onClick={() => onEmotionSelect(emotion.id)}
            className={`flex flex-col items-center group px-3 py-1.5 rounded-lg transition-all ${
              selectedEmotion === emotion.id 
                ? 'bg-white/20' 
                : 'hover:bg-white/10'
            }`}
          >
            <motion.span 
              className="text-2xl md:text-3xl"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.95 }}
            >
              {emotion.emoji}
            </motion.span>
            <span className={`text-[10px] md:text-xs mt-1.5 ${
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
