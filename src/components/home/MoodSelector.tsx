
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface MoodSelectorProps {
  onSelect: (mood: string) => void;
  onClose: () => void;
}

const MoodSelector = ({ onSelect, onClose }: MoodSelectorProps) => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  
  const moods = [
    { emoji: "😊", name: "Happy" },
    { emoji: "😴", name: "Tired" },
    { emoji: "😌", name: "Calm" },
    { emoji: "🤔", name: "Thoughtful" },
    { emoji: "😢", name: "Sad" },
    { emoji: "😤", name: "Frustrated" },
    { emoji: "🥳", name: "Excited" },
    { emoji: "😎", name: "Cool" },
  ];
  
  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood);
    onSelect(mood);
  };

  return (
    <div className="bg-white px-4 py-3 rounded-xl shadow-sm">
      <h3 className="text-sm font-medium mb-3">How are you feeling today?</h3>
      <div className="grid grid-cols-4 gap-2 pb-1">
        {moods.map((mood) => (
          <Button 
            key={mood.name}
            variant={selectedMood === mood.emoji ? "default" : "outline"}
            className="flex flex-col items-center py-2 h-auto"
            onClick={() => handleMoodSelect(mood.emoji)}
          >
            <span className="text-xl mb-1">{mood.emoji}</span>
            <span className="text-xs line-clamp-1">{mood.name}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default MoodSelector;
