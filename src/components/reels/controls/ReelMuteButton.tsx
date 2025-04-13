
import React from "react";
import { Volume, VolumeX } from "lucide-react";
import { motion } from "framer-motion";

interface ReelMuteButtonProps {
  isMuted: boolean;
  onToggleMute: () => void;
}

const ReelMuteButton = ({ isMuted, onToggleMute }: ReelMuteButtonProps) => {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={onToggleMute}
      className="p-3 rounded-full bg-black/30 backdrop-blur-lg hover:bg-black/40 transition-all duration-200"
    >
      {isMuted ? (
        <VolumeX className="h-5 w-5 text-white" />
      ) : (
        <Volume className="h-5 w-5 text-white" />
      )}
    </motion.button>
  );
};

export default ReelMuteButton;
