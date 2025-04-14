
import React, { useState } from "react";
import { Button } from "@/components/ui/button";

interface MoodCheckStepProps {
  onNext: () => void;
}

const moods = [
  { emoji: "😌", label: "Calm" },
  { emoji: "😐", label: "Numb" },
  { emoji: "😔", label: "Low energy" },
  { emoji: "😩", label: "Overwhelmed" },
  { emoji: "❤️", label: "Hopeful" },
  { emoji: "🔥", label: "Fired up" },
  { emoji: "🤷", label: "Not sure" },
];

const MoodCheckStep = ({ onNext }: MoodCheckStepProps) => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  const getAffirmation = (mood: string) => {
    return "However you're feeling — you've just made a brave choice by being here.";
  };

  return (
    <div className="flex flex-col items-center justify-center flex-grow p-6">
      <h2 className="text-3xl font-bold mb-2">How Are You Feeling Right Now?</h2>
      <p className="text-gray-600 mb-8 text-center">It's okay to be honest here</p>

      <div className="grid grid-cols-2 gap-4 w-full max-w-md mb-8">
        {moods.map(({ emoji, label }) => (
          <button
            key={label}
            onClick={() => setSelectedMood(label)}
            className={`unmute-bubble p-4 flex flex-col items-center space-y-2 ${
              selectedMood === label
                ? "bg-gradient-to-r from-unmute-purple to-unmute-pink text-white"
                : "bg-white hover:bg-gray-50"
            }`}
          >
            <span className="text-2xl">{emoji}</span>
            <span className="text-sm font-medium">{label}</span>
          </button>
        ))}
      </div>

      {selectedMood && (
        <div className="text-center mb-8 animate-fade-in">
          <p className="text-lg text-gray-600">{getAffirmation(selectedMood)}</p>
        </div>
      )}

      <Button
        onClick={onNext}
        className="unmute-primary-button"
        disabled={!selectedMood}
      >
        Next
      </Button>
    </div>
  );
};

export default MoodCheckStep;
