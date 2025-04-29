
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

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
  
  const handleMoodSelect = (emoji: string) => {
    setSelectedMood(emoji);
    onSelect(emoji);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="bg-white px-4 py-3 rounded-xl shadow-sm"
    >
      <h3 className="text-sm font-medium mb-3">How are you feeling today?</h3>
      <div className="grid grid-cols-4 gap-2 pb-1">
        {moods.map((mood) => (
          <Button 
            key={mood.name}
            variant={selectedMood === mood.emoji ? "default" : "outline"}
            className="flex flex-col items-center py-2 h-auto relative"
            onClick={() => handleMoodSelect(mood.emoji)}
          >
            <span className="text-xl mb-1">{mood.emoji}</span>
            <span className="text-xs line-clamp-1">{mood.name}</span>
            
            {/* Tooltip that appears on hover */}
            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity hidden md:block">
              {mood.name}
            </span>
          </Button>
        ))}
      </div>
    </motion.div>
  );
};

export default MoodSelector;
