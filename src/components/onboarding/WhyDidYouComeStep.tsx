
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

interface WhyDidYouComeStepProps {
  onNext: () => void;
  onUpdateData: (data: any) => void;
  data: string[];
}

const reasons = [
  {
    id: "heard",
    text: "I want to feel more heard",
    icon: "👂"
  },
  {
    id: "tired",
    text: "I'm tired of fake platforms",
    icon: "😒"
  },
  {
    id: "health",
    text: "I want to talk about my health",
    icon: "❤️‍🩹"
  },
  {
    id: "connect",
    text: "I want to connect without judgment",
    icon: "🤝"
  },
  {
    id: "healing",
    text: "I'm hurting but I'm healing",
    icon: "🌱"
  },
  {
    id: "safe",
    text: "I just want a safe place to be myself",
    icon: "🏡"
  },
  {
    id: "curious",
    text: "I'm not sure yet, but I'm curious",
    icon: "🤔"
  }
];

const WhyDidYouComeStep = ({ onNext, onUpdateData, data }: WhyDidYouComeStepProps) => {
  const [selected, setSelected] = useState<string[]>(data || []);
  
  const toggleReason = (id: string) => {
    if (selected.includes(id)) {
      setSelected(selected.filter(reasonId => reasonId !== id));
    } else {
      setSelected([...selected, id]);
    }
  };
  
  const handleNext = () => {
    onUpdateData({ whyCame: selected });
    onNext();
  };
  
  return (
    <div className="flex flex-col flex-grow p-6">
      <h2 className="text-3xl font-bold mb-2 text-center">Why Did You Come?</h2>
      <p className="text-center text-gray-600 mb-8">Choose what brought you here (select all that apply)</p>
      
      <div className="space-y-3 mb-8 flex-grow overflow-y-auto">
        {reasons.map(reason => (
          <button
            key={reason.id}
            onClick={() => toggleReason(reason.id)}
            className={`w-full p-4 flex items-center rounded-lg transition-all ${
              selected.includes(reason.id) 
                ? "bg-unmute-purple/10 border border-unmute-purple" 
                : "bg-white border border-gray-200 hover:bg-gray-50"
            }`}
          >
            <div className="flex-shrink-0 mr-3 text-2xl">{reason.icon}</div>
            <span className="flex-grow text-left">{reason.text}</span>
            {selected.includes(reason.id) && (
              <CheckCircle2 className="h-5 w-5 text-unmute-purple ml-2" />
            )}
          </button>
        ))}
      </div>
      
      <div className="mt-auto">
        <Button 
          onClick={handleNext} 
          className="unmute-primary-button w-full"
          disabled={selected.length === 0}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default WhyDidYouComeStep;
