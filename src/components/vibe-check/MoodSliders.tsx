
import React from "react";
import { Slider } from "@/components/ui/slider";

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
      emojis: ["😢", "😐", "😄"],
      value: moodData.mood,
    },
    {
      id: "energy",
      label: "Energy",
      emojis: ["😴", "🙂", "⚡"],
      value: moodData.energy,
    },
    {
      id: "anxiety",
      label: "Anxiety",
      emojis: ["😌", "😟", "😰"],
      value: moodData.anxiety,
    },
    {
      id: "motivation",
      label: "Motivation",
      emojis: ["🥱", "🙂", "🔥"],
      value: moodData.motivation,
    },
    {
      id: "peace",
      label: "Peace",
      emojis: ["😩", "😌", "🧘"],
      value: moodData.peace,
    },
  ];

  const handleSliderChange = (id: string, newValue: number[]) => {
    setMoodData({
      ...moodData,
      [id]: newValue[0],
    });
  };

  return (
    <div className="space-y-6">
      {sliders.map((slider) => (
        <div key={slider.id} className="space-y-2">
          <div className="flex justify-between items-center mb-1">
            <label htmlFor={slider.id} className="text-sm font-medium">
              {slider.label}
            </label>
            <span className="text-2xl" role="img" aria-label={`${slider.label} emoji`}>
              {slider.emojis[Math.floor((slider.value / 100) * slider.emojis.length)]}
            </span>
          </div>
          <Slider
            id={slider.id}
            min={0}
            max={100}
            step={1}
            value={[slider.value]}
            onValueChange={(newValue) => handleSliderChange(slider.id, newValue)}
            className="py-2"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>Low</span>
            <span>High</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MoodSliders;
