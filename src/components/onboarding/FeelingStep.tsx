
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface FeelingStepProps {
  onNext: () => void;
  onUpdateData: (data: any) => void;
  data: string;
}

const feelings = [
  {
    id: "calm",
    emoji: "😌",
    label: "Calm",
    affirmation: "Finding calm is a superpower. We're glad you've brought that energy here."
  },
  {
    id: "numb",
    emoji: "😐",
    label: "Numb",
    affirmation: "It's okay to feel nothing sometimes. This is a space where you can just be."
  },
  {
    id: "low",
    emoji: "😔",
    label: "Low energy",
    affirmation: "We all have those days. Take it slow, there's no rush here."
  },
  {
    id: "overwhelmed",
    emoji: "😩",
    label: "Overwhelmed",
    affirmation: "Take a deep breath. This space is designed to be gentle and at your pace."
  },
  {
    id: "hopeful",
    emoji: "❤️",
    label: "Hopeful",
    affirmation: "Hope is powerful. We're excited to see what you'll bring to this community."
  },
  {
    id: "fired",
    emoji: "🔥",
    label: "Fired up",
    affirmation: "Channel that energy here - authentic passion creates real change."
  },
  {
    id: "unsure",
    emoji: "🤷",
    label: "Not sure",
    affirmation: "Uncertainty is welcome here too. Take your time to figure things out."
  }
];

const FeelingStep = ({ onNext, onUpdateData, data }: FeelingStepProps) => {
  const [selected, setSelected] = useState<string>(data || "");
  const [showAffirmation, setShowAffirmation] = useState(false);
  
  const handleSelect = (id: string) => {
    setSelected(id);
    setShowAffirmation(true);
    
    // Automatically move to next step after a few seconds
    setTimeout(() => {
      onUpdateData({ feeling: id });
      onNext();
    }, 3000);
  };
  
  const selectedFeeling = feelings.find(f => f.id === selected);
  
  return (
    <div className="flex flex-col flex-grow p-6">
      <h2 className="text-3xl font-bold mb-2 text-center">How Are You Feeling Right Now?</h2>
      <p className="text-center text-gray-600 mb-8">Select the mood that matches you best</p>
      
      <div className="grid grid-cols-3 gap-4 mb-6">
        {feelings.map(feeling => (
          <button
            key={feeling.id}
            onClick={() => handleSelect(feeling.id)}
            className={`flex flex-col items-center p-4 rounded-lg transition-all ${
              selected === feeling.id 
                ? "bg-unmute-purple/10 border border-unmute-purple scale-105" 
                : "bg-white border border-gray-200 hover:bg-gray-50"
            }`}
            disabled={showAffirmation}
          >
            <span className="text-3xl mb-1">{feeling.emoji}</span>
            <span className="text-sm">{feeling.label}</span>
          </button>
        ))}
      </div>
      
      <div className="flex-grow">
        {showAffirmation && selectedFeeling && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-lg bg-unmute-purple/10 text-center"
          >
            <p className="text-xl mb-2">
              <span className="text-3xl">{selectedFeeling.emoji}</span>
            </p>
            <p className="text-lg">{selectedFeeling.affirmation}</p>
            <p className="mt-4 text-sm text-gray-600">
              However you're feeling — you've just made a brave choice by being here.
            </p>
          </motion.div>
        )}
      </div>
      
      {!showAffirmation && (
        <div className="mt-auto">
          <p className="text-center text-sm text-gray-500 mb-4">
            Select a feeling above to continue
          </p>
        </div>
      )}
    </div>
  );
};

export default FeelingStep;
