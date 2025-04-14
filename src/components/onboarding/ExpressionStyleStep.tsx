
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Video, PenTool, UserCircle2 } from "lucide-react";

interface ExpressionStyleStepProps {
  onNext: () => void;
  onUpdateData: (data: any) => void;
  data: string;
}

const expressionStyles = [
  {
    id: "voice",
    icon: Mic,
    label: "Voice",
    description: "Express yourself through audio recordings"
  },
  {
    id: "video",
    icon: Video,
    label: "Video",
    description: "Share moments with short video clips"
  },
  {
    id: "writing",
    icon: PenTool,
    label: "Writing",
    description: "Communicate through thoughtful text posts"
  },
  {
    id: "anonymous",
    icon: UserCircle2,
    label: "Anonymous",
    description: "Maintain privacy while sharing your thoughts"
  }
];

const ExpressionStyleStep = ({ onNext, onUpdateData, data }: ExpressionStyleStepProps) => {
  const [selected, setSelected] = useState<string>(data || "");
  
  const handleSelect = (id: string) => {
    setSelected(id);
  };
  
  const handleNext = () => {
    onUpdateData({ expressionStyle: selected });
    onNext();
  };
  
  return (
    <div className="flex flex-col flex-grow p-6">
      <h2 className="text-3xl font-bold mb-2 text-center">Your Expression Style</h2>
      <p className="text-center text-gray-600 mb-8">How do you prefer to Unmute? (You can change this later)</p>
      
      <div className="grid grid-cols-2 gap-4 mb-8">
        {expressionStyles.map(style => {
          const Icon = style.icon;
          return (
            <button
              key={style.id}
              onClick={() => handleSelect(style.id)}
              className={`flex flex-col items-center p-6 rounded-lg transition-all ${
                selected === style.id 
                  ? "bg-unmute-purple/10 border border-unmute-purple scale-105" 
                  : "bg-white border border-gray-200 hover:bg-gray-50"
              }`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
                selected === style.id ? "bg-unmute-purple text-white" : "bg-gray-100 text-gray-600"
              }`}>
                <Icon className="h-6 w-6" />
              </div>
              <span className="text-lg font-medium mb-1">{style.label}</span>
              <span className="text-sm text-gray-500 text-center">{style.description}</span>
            </button>
          );
        })}
      </div>
      
      <div className="mt-auto">
        <p className="text-center text-sm text-gray-500 mb-4">
          Don't worry, you can always use other forms of expression later!
        </p>
        
        <Button 
          onClick={handleNext} 
          className="unmute-primary-button w-full"
          disabled={!selected}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default ExpressionStyleStep;
