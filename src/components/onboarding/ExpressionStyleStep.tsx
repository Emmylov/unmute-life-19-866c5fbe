
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Video, PenTool, UserCircle } from "lucide-react";

interface ExpressionStyleStepProps {
  onNext: () => void;
}

const expressionStyles = [
  { id: "voice", label: "Voice", icon: Mic, description: "Express through audio" },
  { id: "video", label: "Video", icon: Video, description: "Share with video" },
  { id: "writing", label: "Writing", icon: PenTool, description: "Write your thoughts" },
  { id: "anonymous", label: "Anonymous", icon: UserCircle, description: "Share privately" },
];

const ExpressionStyleStep = ({ onNext }: ExpressionStyleStepProps) => {
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);

  const toggleStyle = (id: string) => {
    if (selectedStyles.includes(id)) {
      setSelectedStyles(selectedStyles.filter((style) => style !== id));
    } else {
      setSelectedStyles([...selectedStyles, id]);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center flex-grow p-6">
      <h2 className="text-3xl font-bold mb-2">Your Expression Style</h2>
      <p className="text-gray-600 mb-8 text-center">
        Choose how you prefer to Unmute
      </p>

      <div className="grid grid-cols-2 gap-4 w-full max-w-md mb-8">
        {expressionStyles.map(({ id, label, icon: Icon, description }) => (
          <button
            key={id}
            onClick={() => toggleStyle(id)}
            className={`unmute-bubble h-32 flex flex-col items-center justify-center p-4 ${
              selectedStyles.includes(id)
                ? "bg-gradient-to-r from-unmute-purple to-unmute-pink text-white"
                : "bg-white hover:bg-gray-50"
            }`}
          >
            <Icon className="h-8 w-8 mb-2" />
            <span className="font-medium mb-1">{label}</span>
            <span className="text-xs text-center opacity-75">{description}</span>
          </button>
        ))}
      </div>

      <p className="text-sm text-gray-500 mb-6">
        Don't worry, you can always change this later!
      </p>

      <Button
        onClick={onNext}
        className="unmute-primary-button"
        disabled={selectedStyles.length === 0}
      >
        Next
      </Button>
    </div>
  );
};

export default ExpressionStyleStep;
