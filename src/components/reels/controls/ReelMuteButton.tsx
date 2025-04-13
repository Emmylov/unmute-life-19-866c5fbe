
import React from "react";
import { Volume2, VolumeX } from "lucide-react";
import { motion } from "framer-motion";

interface ReelMuteButtonProps {
  isMuted: boolean;
  onToggleMute: () => void;
}

const ReelMuteButton = ({ isMuted, onToggleMute }: ReelMuteButtonProps) => {
  return (
    <motion.button 
      className="absolute bottom-6 right-6 w-12 h-12 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center pointer-events-auto focus:outline-none focus:ring-2 focus:ring-white/70"
      onClick={onToggleMute}
      aria-label={isMuted ? "Unmute video" : "Mute video"}
      title={isMuted ? "Unmute" : "Mute"}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <div className="relative">
        {isMuted ? (
          <VolumeX className="w-6 h-6 text-white" />
        ) : (
          <>
            <Volume2 className="w-6 h-6 text-white" />
            <motion.div 
              className="absolute inset-0 opacity-0"
              animate={{ 
                opacity: [0, 0.5, 0], 
                scale: [1, 1.2, 1] 
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 2, 
                ease: "easeInOut" 
              }}
            >
              <Volume2 className="w-6 h-6 text-white" />
            </motion.div>
          </>
        )}
      </div>
    </motion.button>
  );
};

export default ReelMuteButton;
