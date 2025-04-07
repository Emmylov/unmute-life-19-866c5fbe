
import React from "react";
import { motion } from "framer-motion";

interface ReelAudioInfoProps {
  audio?: string;
  audioType?: string;
  audioUrl?: string;
}

const ReelAudioInfo = ({ audio, audioType, audioUrl }: ReelAudioInfoProps) => {
  const getAudioDisplay = () => {
    if (audio) {
      return audio;
    } else if (audioType === 'original') {
      return 'Original Audio';
    } else if (audioUrl) {
      return audioUrl.split('/').pop() || 'Audio';
    }
    return 'Original Audio';
  };

  if (!audio && !audioUrl && audioType !== 'original') return null;

  return (
    <div className="flex items-center space-x-2">
      <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }} 
          transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
          className="w-4 h-4 rounded-full bg-gradient-to-br from-pink-500 to-purple-600"
        />
      </div>
      <div className="text-white/90 text-sm font-medium">
        {getAudioDisplay()}
      </div>
    </div>
  );
};

export default ReelAudioInfo;
