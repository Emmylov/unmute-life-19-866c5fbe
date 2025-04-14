
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface InterestOption {
  id: string;
  name: string;
  icon: string;
  color: string;
}

interface InterestsStepProps {
  onNext: () => void;
}

const interestOptions: InterestOption[] = [
  { id: "climate", name: "Climate Action", icon: "🌍", color: "bg-green-500" },
  { id: "music", name: "Music", icon: "🎵", color: "bg-purple-500" },
  { id: "tech", name: "Tech", icon: "💻", color: "bg-blue-500" },
  { id: "mental-health", name: "Mental Health", icon: "🧠", color: "bg-teal-500" },
  { id: "movies", name: "Movies", icon: "🎬", color: "bg-red-500" },
  { id: "art", name: "Art", icon: "🎨", color: "bg-pink-500" },
  { id: "food", name: "Food", icon: "🍕", color: "bg-yellow-500" },
  { id: "travel", name: "Travel", icon: "✈️", color: "bg-indigo-500" },
  { id: "fitness", name: "Fitness", icon: "💪", color: "bg-orange-500" },
  { id: "gaming", name: "Gaming", icon: "🎮", color: "bg-violet-500" },
];

const InterestsStep = ({ onNext }: InterestsStepProps) => {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  const toggleInterest = (id: string) => {
    if (selectedInterests.includes(id)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== id));
    } else {
      setSelectedInterests([...selectedInterests, id]);
    }
  };
  
  const filteredInterests = interestOptions.filter((interest) =>
    interest.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="flex flex-col flex-grow p-6">
      <h2 className="text-3xl font-bold mb-2 text-center">Pick Your Interests</h2>
      <p className="text-center text-gray-600 mb-6">Select topics you're passionate about</p>
      
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder="Search interests..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4 overflow-y-auto mb-6 flex-grow">
        {filteredInterests.map((interest) => (
          <button
            key={interest.id}
            className={`unmute-bubble h-24 ${
              selectedInterests.includes(interest.id)
                ? "ring-2 ring-unmute-purple ring-offset-2"
                : ""
            }`}
            onClick={() => toggleInterest(interest.id)}
          >
            <div className="flex flex-col items-center">
              <span className="text-2xl mb-1">{interest.icon}</span>
              <span className="text-sm font-medium text-center">{interest.name}</span>
            </div>
          </button>
        ))}
      </div>
      
      <div className="mt-auto">
        <Button
          onClick={onNext}
          className="unmute-primary-button w-full"
          disabled={selectedInterests.length === 0}
        >
          Next ({selectedInterests.length} selected)
        </Button>
      </div>
    </div>
  );
};

export default InterestsStep;
