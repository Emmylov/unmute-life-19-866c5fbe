
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Video, PenTool, Forward } from "lucide-react";

interface FirstUnmuteStepProps {
  onNext: () => void;
}

const FirstUnmuteStep = ({ onNext }: FirstUnmuteStepProps) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  return (
    <div className="flex flex-col items-center justify-center flex-grow p-6">
      <h2 className="text-3xl font-bold mb-2">Make Your First Unmute</h2>
      <p className="text-gray-600 mb-8 text-center">
        Want to share something right now?
      </p>

      <div className="grid grid-cols-2 gap-4 w-full max-w-md mb-8">
        {[
          { id: "audio", label: "Audio", icon: Mic },
          { id: "video", label: "Video", icon: Video },
          { id: "text", label: "Text", icon: PenTool },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setSelectedOption(id)}
            className={`unmute-bubble h-32 flex flex-col items-center justify-center p-4 ${
              selectedOption === id
                ? "bg-gradient-to-r from-unmute-purple to-unmute-pink text-white"
                : "bg-white hover:bg-gray-50"
            }`}
          >
            <Icon className="h-8 w-8 mb-2" />
            <span className="font-medium">{label}</span>
          </button>
        ))}
      </div>

      <div className="w-full max-w-md">
        <Button
          onClick={onNext}
          className="w-full unmute-secondary-button mb-4"
        >
          Skip for now
          <Forward className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default FirstUnmuteStep;
