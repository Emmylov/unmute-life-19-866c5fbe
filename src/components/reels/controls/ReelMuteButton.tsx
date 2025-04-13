
import React from "react";
import { Volume2, VolumeX } from "lucide-react";

interface ReelMuteButtonProps {
  isMuted: boolean;
  onToggleMute: () => void;
}

const ReelMuteButton = ({ isMuted, onToggleMute }: ReelMuteButtonProps) => {
  return (
    <button 
      className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center pointer-events-auto focus:outline-none focus:ring-2 focus:ring-white/50"
      onClick={onToggleMute}
      aria-label={isMuted ? "Unmute video" : "Mute video"}
      title={isMuted ? "Unmute" : "Mute"}
    >
      {isMuted ? (
        <VolumeX className="w-5 h-5 text-white" />
      ) : (
        <Volume2 className="w-5 h-5 text-white" />
      )}
    </button>
  );
};

export default ReelMuteButton;
