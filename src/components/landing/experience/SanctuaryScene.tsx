
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface SceneContent {
  title: string;
  description: string;
}

interface SanctuarySceneProps {
  onContinue: () => void;
  avatarType: 'overthinker' | 'peoplepleaser' | 'bottledup' | 'tryingagain' | 'lost' | null;
  sceneContent?: SceneContent;
}

const SanctuaryScene: React.FC<SanctuarySceneProps> = ({ 
  onContinue, 
  avatarType,
  sceneContent = {
    title: "The Sanctuary of Unmute",
    description: "Welcome. This is Unmute — a sanctuary for real voices, raw stories, and radical belonging."
  }
}) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-indigo-900 to-violet-900">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", duration: 0.8 }}
        className="w-32 h-32 mb-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center"
      >
        <span className="text-5xl">🔓</span>
      </motion.div>
      
      <h1 className="text-3xl md:text-5xl font-bold mb-8 text-white">
        {sceneContent.title}
      </h1>
      
      <p className="mb-10 text-lg md:text-xl text-white/90 max-w-2xl">
        {sceneContent.description}
      </p>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 max-w-4xl">
        {[
          { emoji: "🎙️", label: "Audio Diaries" },
          { emoji: "🧠", label: "Healing Rooms" },
          { emoji: "🔄", label: "Mentorship" },
          { emoji: "✨", label: "Real Connection" }
        ].map((feature, index) => (
          <motion.div
            key={index}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 + index * 0.2 }}
            className="flex flex-col items-center p-4 rounded-lg bg-white/10"
          >
            <span className="text-3xl mb-2">{feature.emoji}</span>
            <span className="text-sm font-medium">{feature.label}</span>
          </motion.div>
        ))}
      </div>
      
      <Button
        onClick={onContinue}
        className="mt-4 bg-white hover:bg-gray-100 text-violet-900 px-8 py-3 rounded-full text-lg font-medium"
      >
        Continue
      </Button>
    </div>
  );
};

export default SanctuaryScene;
