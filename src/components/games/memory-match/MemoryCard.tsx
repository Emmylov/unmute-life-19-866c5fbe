
import React from 'react';
import { motion } from 'framer-motion';
import { QuestionMarkCircle } from 'lucide-react';

interface MemoryCardProps {
  card: {
    emoji: string;
    matched: boolean;
  };
  isFlipped: boolean;
  onClick: () => void;
}

const MemoryCard = ({ card, isFlipped, onClick }: MemoryCardProps) => {
  return (
    <motion.div
      className="relative aspect-square cursor-pointer"
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <div
        className={`w-full h-full transition-all duration-500 transform preserve-3d ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* Front of card */}
        <div className={`absolute w-full h-full backface-hidden ${
          isFlipped ? 'opacity-0' : 'opacity-100'
        } bg-white rounded-xl border-2 border-primary/20 flex items-center justify-center shadow-md`}>
          <QuestionMarkCircle className="w-8 h-8 text-primary/40" />
        </div>
        
        {/* Back of card */}
        <div className={`absolute w-full h-full backface-hidden rotate-y-180 ${
          isFlipped ? 'opacity-100' : 'opacity-0'
        } bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl border-2 border-primary/20 flex items-center justify-center text-4xl shadow-md`}>
          {card.emoji}
        </div>
      </div>
    </motion.div>
  );
};

export default MemoryCard;
