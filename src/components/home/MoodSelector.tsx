
import React from 'react';
import { Button } from "@/components/ui/button";
import { Smile, Zap, Coffee, Heart, Music, BookOpen, Cloud, Star } from 'lucide-react';

interface MoodSelectorProps {
  onSelect: (mood: string) => void;
}

const MoodSelector = ({ onSelect }: MoodSelectorProps) => {
  const moods = [
    { name: "Happy", icon: <Smile className="h-4 w-4 mr-2" />, color: "bg-yellow-100 hover:bg-yellow-200 text-yellow-800" },
    { name: "Energetic", icon: <Zap className="h-4 w-4 mr-2" />, color: "bg-blue-100 hover:bg-blue-200 text-blue-800" },
    { name: "Calm", icon: <Cloud className="h-4 w-4 mr-2" />, color: "bg-green-100 hover:bg-green-200 text-green-800" },
    { name: "Loved", icon: <Heart className="h-4 w-4 mr-2" />, color: "bg-pink-100 hover:bg-pink-200 text-pink-800" },
    { name: "Creative", icon: <Music className="h-4 w-4 mr-2" />, color: "bg-purple-100 hover:bg-purple-200 text-purple-800" },
    { name: "Curious", icon: <BookOpen className="h-4 w-4 mr-2" />, color: "bg-indigo-100 hover:bg-indigo-200 text-indigo-800" },
    { name: "Inspired", icon: <Star className="h-4 w-4 mr-2" />, color: "bg-amber-100 hover:bg-amber-200 text-amber-800" },
    { name: "Focused", icon: <Coffee className="h-4 w-4 mr-2" />, color: "bg-orange-100 hover:bg-orange-200 text-orange-800" }
  ];

  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium mb-2 text-gray-700">How are you feeling today?</h3>
      <div className="flex flex-wrap gap-2">
        {moods.map((mood) => (
          <Button 
            key={mood.name}
            variant="ghost" 
            size="sm"
            className={`flex items-center ${mood.color}`}
            onClick={() => onSelect(mood.name)}
          >
            {mood.icon}
            {mood.name}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default MoodSelector;
