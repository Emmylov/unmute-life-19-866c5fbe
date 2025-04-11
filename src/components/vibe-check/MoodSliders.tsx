
import React from "react";
import { Slider } from "@/components/ui/slider";
import { motion } from "framer-motion";

interface MoodData {
  mood: number;
  energy: number;
  anxiety: number;
  motivation: number;
  peace: number;
}

interface MoodSlidersProps {
  moodData: MoodData;
  setMoodData: React.Dispatch<React.SetStateAction<MoodData>>;
}

const MoodSliders: React.FC<MoodSlidersProps> = ({ moodData, setMoodData }) => {
  const sliders = [
    {
      id: "mood",
      label: "Mood",
      emojis: ["😢", "😐", "😊", "😄"],
      value: moodData.mood,
      colors: ["#FEE2E2", "#FEF3C7", "#DCFCE7", "#D1FAE5"]
    },
    {
      id: "energy",
      label: "Energy",
      emojis: ["😴", "🙂", "😌", "⚡"],
      value: moodData.energy,
      colors: ["#E0E7FF", "#E0E7FF", "#DBEAFE", "#C7D2FE"]
    },
    {
      id: "anxiety",
      label: "Anxiety",
      emojis: ["😌", "🙂", "😟", "😰"],
      value: moodData.anxiety,
      colors: ["#DCFCE7", "#D1FAE5", "#FEE2E2", "#FCA5A5"]
    },
    {
      id: "motivation",
      label: "Motivation",
      emojis: ["🥱", "🙂", "😊", "🔥"],
      value: moodData.motivation,
      colors: ["#F3E8FF", "#E9D5FF", "#DDD6FE", "#C4B5FD"]
    },
    {
      id: "peace",
      label: "Peace",
      emojis: ["😩", "🙂", "😌", "🧘"],
      value: moodData.peace,
      colors: ["#FEE2E2", "#FECACA", "#DBEAFE", "#93C5FD"]
    },
  ];

  const handleSliderChange = (id: string, newValue: number[]) => {
    setMoodData({
      ...moodData,
      [id]: newValue[0],
    });
  };

  const getBackgroundGradient = (slider: any) => {
    const emojiIndex = Math.floor((slider.value / 100) * (slider.emojis.length - 1));
    const nextIndex = Math.min(emojiIndex + 1, slider.colors.length - 1);
    const ratio = (slider.value / 100) * (slider.emojis.length - 1) - emojiIndex;
    
    return `linear-gradient(to right, ${slider.colors[0]} 0%, ${slider.colors[Math.floor(slider.value / 33)]} 100%)`;
  };

  return (
    <div className="space-y-6 max-w-lg mx-auto">
      {sliders.map((slider, index) => (
        <motion.div 
          key={slider.id} 
          className="space-y-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <div className="flex justify-between items-center mb-1">
            <label htmlFor={slider.id} className="text-sm font-medium flex items-center">
              {slider.label}
              <div 
                className="ml-2 w-3 h-3 rounded-full" 
                style={{ background: getBackgroundGradient(slider) }}
              />
            </label>
            <motion.span 
              className="text-2xl" 
              role="img" 
              aria-label={`${slider.label} emoji`}
              key={slider.value}
              initial={{ scale: 0.8, opacity: 0.5 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              {slider.emojis[Math.floor((slider.value / 100) * (slider.emojis.length - 1))]}
            </motion.span>
          </div>
          <div 
            className="p-1 rounded-full"
            style={{ background: getBackgroundGradient(slider) }}
          >
            <Slider
              id={slider.id}
              min={0}
              max={100}
              step={1}
              value={[slider.value]}
              onValueChange={(newValue) => handleSliderChange(slider.id, newValue)}
              className="py-2"
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>Low</span>
            <span>High</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default MoodSliders;
