
import React from "react";
import { Volume2, VolumeX } from "lucide-react";

interface ReelMuteButtonProps {
  isMuted: boolean;
  onToggleMute: () => void;
}

const ReelMuteButton = ({ isMuted, onToggleMute }: ReelMuteButtonProps) => {
  return (
    <button 
      className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center pointer-events-auto"
      onClick={onToggleMute}
    >
      {isMuted ? (
        <VolumeX className="w-4 h-4 text-white" />
      ) : (
        <Volume2 className="w-4 h-4 text-white" />
      )}
    </button>
  );
};

export default ReelMuteButton;
