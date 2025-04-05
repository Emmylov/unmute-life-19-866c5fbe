
import React from "react";
import { Button } from "@/components/ui/button";
import { Users, Video, MessageSquare, Music } from "lucide-react";

interface AboutStepProps {
  onNext: () => void;
}

const AboutStep = ({ onNext }: AboutStepProps) => {
  return (
    <div className="flex flex-col items-center justify-center flex-grow text-center p-6">
      <h2 className="text-3xl font-bold mb-6">What is Unmute?</h2>
      
      <p className="text-lg text-gray-600 mb-8">
        Unmute is your space to speak up, connect, and create change.
      </p>
      
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="flex flex-col items-center p-4 bg-white rounded-2xl shadow-sm">
          <div className="w-12 h-12 rounded-full bg-unmute-purple/10 flex items-center justify-center mb-3">
            <Users className="h-6 w-6 text-unmute-purple" />
          </div>
          <span className="text-sm font-medium">Community</span>
        </div>
        
        <div className="flex flex-col items-center p-4 bg-white rounded-2xl shadow-sm">
          <div className="w-12 h-12 rounded-full bg-unmute-pink/10 flex items-center justify-center mb-3">
            <Video className="h-6 w-6 text-unmute-pink" />
          </div>
          <span className="text-sm font-medium">Video</span>
        </div>
        
        <div className="flex flex-col items-center p-4 bg-white rounded-2xl shadow-sm">
          <div className="w-12 h-12 rounded-full bg-unmute-coral/10 flex items-center justify-center mb-3">
            <MessageSquare className="h-6 w-6 text-unmute-coral" />
          </div>
          <span className="text-sm font-medium">Chat</span>
        </div>
        
        <div className="flex flex-col items-center p-4 bg-white rounded-2xl shadow-sm">
          <div className="w-12 h-12 rounded-full bg-unmute-teal/10 flex items-center justify-center mb-3">
            <Music className="h-6 w-6 text-unmute-teal" />
          </div>
          <span className="text-sm font-medium">Audio</span>
        </div>
      </div>
      
      <Button 
        onClick={onNext} 
        className="unmute-primary-button"
      >
        Next
      </Button>
    </div>
  );
};

export default AboutStep;
