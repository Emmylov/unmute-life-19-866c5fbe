
import React from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface AvatarSelectionProps {
  onSelect: (avatar: 'overthinker' | 'peoplepleaser' | 'bottledup' | 'tryingagain' | 'lost' | null) => void;
  onContinue: () => void;
  selectedAvatar: 'overthinker' | 'peoplepleaser' | 'bottledup' | 'tryingagain' | 'lost' | null;
}

const avatars = [
  {
    id: 'overthinker',
    emoji: '🎭',
    label: 'The Overthinker',
    description: 'Always analyzing, sometimes paralyzed by possibilities'
  },
  {
    id: 'peoplepleaser',
    emoji: '😶',
    label: 'The People Pleaser',
    description: 'Putting others first, even if it means losing yourself'
  },
  {
    id: 'bottledup',
    emoji: '😡',
    label: 'The Bottled-Up One',
    description: 'Feelings locked away, pressure building within'
  },
  {
    id: 'tryingagain',
    emoji: '🪞',
    label: 'The One Who\'s Trying Again',
    description: 'Finding strength after setbacks, rebuilding step by step'
  },
  {
    id: 'lost',
    emoji: '➕',
    label: 'None of these?',
    description: 'I\'m just trying to find my way'
  }
];

const AvatarSelection = ({ onSelect, onContinue, selectedAvatar }: AvatarSelectionProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen w-full bg-gradient-to-b from-black to-gray-900 flex flex-col items-center justify-center text-white p-4"
    >
      <div className="w-full max-w-2xl mx-auto">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Choose Your Avatar</h1>
          <p className="text-gray-300">Which version of you resonates most today?</p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {avatars.map((avatar, index) => (
            <motion.button
              key={avatar.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              onClick={() => onSelect(avatar.id as any)}
              className={`flex flex-col items-center p-6 rounded-lg border transition-all ${
                selectedAvatar === avatar.id 
                  ? 'bg-gradient-to-r from-unmute-purple to-unmute-pink border-white' 
                  : 'bg-gray-800/60 border-gray-700 hover:bg-gray-700/60'
              }`}
            >
              <span className="text-4xl mb-3">{avatar.emoji}</span>
              <h3 className="text-lg font-semibold mb-1">{avatar.label}</h3>
              <p className="text-sm text-gray-300 text-center">{avatar.description}</p>
            </motion.button>
          ))}
        </div>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex justify-center"
        >
          <Button
            onClick={onContinue}
            disabled={!selectedAvatar}
            className="bg-gradient-to-r from-unmute-purple to-unmute-pink hover:opacity-90 text-white px-8 py-6 rounded-full text-lg"
          >
            Continue
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AvatarSelection;
