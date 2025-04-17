
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface MoodSelectorProps {
  onSelect: (mood: string) => void;
}

const MoodSelector = ({ onSelect }: MoodSelectorProps) => {
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
    <div className="bg-white p-4 rounded-xl shadow-sm">
      <h3 className="text-sm font-medium mb-3">How are you feeling today?</h3>
      <div className="overflow-x-auto flex gap-2 pb-2">
        {moods.map((mood) => (
          <Button 
            key={mood.name}
            variant={selectedMood === mood.name ? "default" : "outline"}
            className="flex flex-col items-center py-2 min-w-[70px]"
            onClick={() => handleMoodSelect(mood.name)}
          >
            <span className="text-xl mb-1">{mood.emoji}</span>
            <span className="text-xs">{mood.name}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default MoodSelector;
