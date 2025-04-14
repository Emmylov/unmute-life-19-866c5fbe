
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Heart, Activity, Sparkles, HeartCrack, Brush, Rocket, Star, Users } from "lucide-react";

interface WellnessSpaceStepProps {
  onNext: () => void;
  onUpdateData: (data: any) => void;
  data: string[];
}

const wellnessAreas = [
  {
    id: "mental-health",
    name: "Mental Health",
    icon: Heart,
    description: "Support for anxiety, depression, and overall mental wellbeing"
  },
  {
    id: "physical-wellness",
    name: "Physical Wellness",
    icon: Activity,
    description: "Exercise, nutrition, and healthy habits"
  },
  {
    id: "faith",
    name: "Faith",
    icon: Sparkles,
    description: "Spiritual practice and religious connection"
  },
  {
    id: "emotional-healing",
    name: "Emotional Healing",
    icon: HeartCrack,
    description: "Processing feelings and past experiences"
  },
  {
    id: "creative-flow",
    name: "Creative Flow",
    icon: Brush,
    description: "Artistic expression and creativity"
  },
  {
    id: "productivity",
    name: "Focus & Productivity",
    icon: Rocket,
    description: "Getting things done and staying organized"
  },
  {
    id: "confidence",
    name: "Confidence / Self-worth",
    icon: Star,
    description: "Building self-esteem and positive self-image"
  },
  {
    id: "relationships",
    name: "Relationships",
    icon: Users,
    description: "Healthy connections with others"
  }
];

const WellnessSpaceStep = ({ onNext, onUpdateData, data }: WellnessSpaceStepProps) => {
  const [selected, setSelected] = useState<string[]>(data || []);
  
  const toggleArea = (id: string) => {
    if (selected.includes(id)) {
      setSelected(selected.filter(areaId => areaId !== id));
    } else {
      setSelected([...selected, id]);
    }
  };
  
  const handleNext = () => {
    onUpdateData({ wellnessAreas: selected });
    onNext();
  };
  
  return (
    <div className="flex flex-col flex-grow p-6">
      <h2 className="text-3xl font-bold mb-2 text-center">Your Wellness Space</h2>
      <p className="text-center text-gray-600 mb-8">What areas of your wellness do you want support in?</p>
      
      <div className="grid grid-cols-2 gap-3 mb-6 flex-grow overflow-y-auto">
        {wellnessAreas.map(area => {
          const Icon = area.icon;
          const isSelected = selected.includes(area.id);
          
          return (
            <button
              key={area.id}
              onClick={() => toggleArea(area.id)}
              className={`relative p-4 rounded-lg border transition-all ${
                isSelected 
                  ? "border-unmute-purple bg-unmute-purple/5" 
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              {isSelected && (
                <CheckCircle2 className="absolute top-2 right-2 h-5 w-5 text-unmute-purple" />
              )}
              
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                isSelected ? "bg-unmute-purple text-white" : "bg-gray-100 text-gray-600"
              }`}>
                <Icon className="h-5 w-5" />
              </div>
              
              <h3 className="font-medium text-left mb-1">{area.name}</h3>
              <p className="text-xs text-gray-500 text-left">{area.description}</p>
            </button>
          );
        })}
      </div>
      
      <div className="mt-auto">
        <Button 
          onClick={handleNext} 
          className="unmute-primary-button w-full"
          disabled={selected.length === 0}
        >
          {selected.length > 0 ? "Next" : "Select at least one area"}
        </Button>
        <p className="text-center text-xs text-gray-500 mt-2">
          This will configure which parts of the Wellness Hub show up on your homepage
        </p>
      </div>
    </div>
  );
};

export default WellnessSpaceStep;
