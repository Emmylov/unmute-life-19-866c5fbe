
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Brain, Heart, CrossIcon, Sparkles, Focus, Smile, Users, Zap } from "lucide-react";

interface WellnessSetupStepProps {
  onNext: () => void;
}

const wellnessAreas = [
  { id: "mental-health", label: "Mental Health", icon: Brain },
  { id: "physical", label: "Physical Wellness", icon: Heart },
  { id: "faith", label: "Faith", icon: CrossIcon },
  { id: "emotional", label: "Emotional Healing", icon: Sparkles },
  { id: "creative", label: "Creative Flow", icon: Zap },
  { id: "focus", label: "Focus & Productivity", icon: Focus },
  { id: "confidence", label: "Confidence", icon: Smile },
  { id: "relationships", label: "Relationships", icon: Users }
];

const WellnessSetupStep = ({ onNext }: WellnessSetupStepProps) => {
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);

  const toggleArea = (id: string) => {
    if (selectedAreas.includes(id)) {
      setSelectedAreas(selectedAreas.filter(area => area !== id));
    } else {
      setSelectedAreas([...selectedAreas, id]);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center flex-grow p-6">
      <h2 className="text-3xl font-bold mb-2">Your Wellness Space</h2>
      <p className="text-gray-600 mb-8 text-center">
        What areas of your wellness do you want support in?
      </p>

      <div className="grid grid-cols-2 gap-4 w-full max-w-md mb-8">
        {wellnessAreas.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => toggleArea(id)}
            className={`unmute-bubble h-32 flex flex-col items-center justify-center p-4 ${
              selectedAreas.includes(id)
                ? "bg-gradient-to-r from-unmute-purple to-unmute-pink text-white"
                : "bg-white hover:bg-gray-50"
            }`}
          >
            <Icon className="h-8 w-8 mb-2" />
            <span className="text-sm text-center font-medium">{label}</span>
          </button>
        ))}
      </div>

      <Button
        onClick={onNext}
        className="unmute-primary-button"
        disabled={selectedAreas.length === 0}
      >
        Next
      </Button>
    </div>
  );
};

export default WellnessSetupStep;
