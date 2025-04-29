
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface MoodSelectorProps {
  onSelect: (emoji: string) => void;
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
    { emoji: "😍", name: "Love" },
    { emoji: "😂", name: "Laughing" },
    { emoji: "😡", name: "Angry" },
    { emoji: "🙄", name: "Eye Roll" },
  ];
  
  const handleMoodSelect = (mood: { emoji: string, name: string }) => {
    setSelectedMood(mood.emoji);
    onSelect(mood.emoji);
  };

  return (
    <div className="bg-white px-4 py-3 rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-medium">How are you feeling?</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>✕</Button>
      </div>
      <div className="grid grid-cols-4 gap-2 pb-1">
        {moods.map((mood) => (
          <Button 
            key={mood.name}
            variant={selectedMood === mood.emoji ? "default" : "outline"}
            className="flex flex-col items-center py-2 h-auto"
            onClick={() => handleMoodSelect(mood)}
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
