
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface MoodSelectorProps {
  onSelect: (mood: string) => void;
  onClose: () => void;
  initialMood?: string | null;
}

const MoodSelector = ({ onSelect, onClose, initialMood = null }: MoodSelectorProps) => {
  const [selectedMood, setSelectedMood] = useState<string | null>(initialMood);
  
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
    console.log("Mood selected:", emoji);
    setSelectedMood(emoji);
    onSelect(emoji);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="bg-white dark:bg-gray-800 px-4 py-3 rounded-xl shadow-sm"
    >
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-medium">How are you feeling today?</h3>
        {selectedMood && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs" 
            onClick={() => {
              setSelectedMood(null);
              onSelect("");
            }}
          >
            Clear
          </Button>
        )}
      </div>
      <div className="grid grid-cols-4 gap-2 pb-1">
        {moods.map((mood) => (
          <motion.div
            key={mood.name}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              variant={selectedMood === mood.emoji ? "default" : "outline"}
              className="flex flex-col items-center py-2 h-auto relative group w-full"
              onClick={() => handleMoodSelect(mood.emoji)}
            >
              <span className="text-xl mb-1">{mood.emoji}</span>
              <span className="text-xs line-clamp-1">{mood.name}</span>
              
              {/* Tooltip that appears on hover */}
              <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity hidden md:block"
              >
                {mood.name}
              </motion.div>
            </Button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default MoodSelector;
