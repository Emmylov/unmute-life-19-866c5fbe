
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Search, Flag, Music, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface InterestsStepProps {
  onNext: () => void;
  onUpdateData?: (data: any) => void;
  data?: string[];
}

interface InterestOption {
  id: string;
  name: string;
  icon: string;
  category: "activism" | "personal";
}

const interestOptions: InterestOption[] = [
  // Activism-Related Interests
  { id: "human-rights", name: "Human Rights", icon: "⚖️", category: "activism" },
  { id: "climate", name: "Climate Action", icon: "🌍", category: "activism" },
  { id: "lgbtq", name: "LGBTQ+ Rights", icon: "🏳️‍🌈", category: "activism" },
  { id: "gender-equality", name: "Gender Equality", icon: "⚧️", category: "activism" },
  { id: "racial-justice", name: "Racial Justice", icon: "✊🏽", category: "activism" },
  { id: "environmentalism", name: "Environmentalism", icon: "🌱", category: "activism" },
  { id: "policy", name: "Policy Advocacy", icon: "📜", category: "activism" },
  { id: "mental-health-adv", name: "Mental Health Advocacy", icon: "🧠", category: "activism" },
  { id: "education-reform", name: "Education Reform", icon: "📚", category: "activism" },
  
  // Personal/Everyday Interests
  { id: "music", name: "Music", icon: "🎵", category: "personal" },
  { id: "sports", name: "Sports", icon: "⚽", category: "personal" },
  { id: "fashion", name: "Fashion", icon: "👗", category: "personal" },
  { id: "tech", name: "Technology", icon: "💻", category: "personal" },
  { id: "gaming", name: "Gaming", icon: "🎮", category: "personal" },
  { id: "travel", name: "Travel", icon: "✈️", category: "personal" },
  { id: "food", name: "Food", icon: "🍕", category: "personal" },
  { id: "fitness", name: "Fitness", icon: "💪", category: "personal" },
  { id: "art", name: "Art", icon: "🎨", category: "personal" },
  { id: "photography", name: "Photography", icon: "📷", category: "personal" },
  { id: "movies", name: "Movies", icon: "🎬", category: "personal" },
  { id: "spirituality", name: "Faith & Spirituality", icon: "✨", category: "personal" },
  { id: "relationships", name: "Relationships", icon: "❤️", category: "personal" },
  { id: "journaling", name: "Journaling", icon: "📓", category: "personal" },
  { id: "poetry", name: "Poetry", icon: "📝", category: "personal" },
  { id: "identity", name: "Identity", icon: "🪞", category: "personal" },
  { id: "self-improvement", name: "Self-Improvement", icon: "🌟", category: "personal" },
  { id: "family", name: "Family", icon: "👨‍👩‍👧‍👦", category: "personal" },
  { id: "productivity", name: "Productivity", icon: "⏱️", category: "personal" },
  { id: "neurodiversity", name: "Neurodiversity", icon: "🧩", category: "personal" },
  { id: "entrepreneurship", name: "Entrepreneurship", icon: "💼", category: "personal" },
  { id: "study", name: "Study Life", icon: "📝", category: "personal" },
  { id: "books", name: "Books & Reading", icon: "📚", category: "personal" },
];

const MAX_SELECTIONS = 10;

const InterestsStep = ({ onNext, onUpdateData, data = [] }: InterestsStepProps) => {
  const [selectedInterests, setSelectedInterests] = useState<string[]>(data);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<"activism" | "personal" | "all">("activism");
  
  const toggleInterest = (id: string) => {
    if (selectedInterests.includes(id)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== id));
    } else {
      if (selectedInterests.length < MAX_SELECTIONS) {
        setSelectedInterests([...selectedInterests, id]);
      }
    }
  };
  
  const filteredInterests = interestOptions.filter((interest) => {
    const matchesSearch = interest.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "all" || interest.category === activeCategory;
    return matchesSearch && matchesCategory;
  });
  
  const handleNext = () => {
    if (onUpdateData) {
      onUpdateData({ interests: selectedInterests });
    }
    onNext();
  };
  
  return (
    <div className="flex flex-col flex-grow p-6">
      <h2 className="text-3xl font-bold mb-2 text-center">Pick Your Interests</h2>
      <p className="text-center text-gray-600 mb-4">Select up to {MAX_SELECTIONS} topics you're passionate about</p>
      
      <div className="mb-4">
        <Tabs defaultValue="activism" onValueChange={(value) => setActiveCategory(value as any)}>
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="activism" className="flex items-center gap-2">
              <Flag className="h-4 w-4" />
              Activism
            </TabsTrigger>
            <TabsTrigger value="personal" className="flex items-center gap-2">
              <Music className="h-4 w-4" />
              Personal
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder="Search interests..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-3 overflow-y-auto mb-6 flex-grow">
        {filteredInterests.map((interest) => (
          <button
            key={interest.id}
            className={`unmute-bubble h-20 transition-all ${
              selectedInterests.includes(interest.id)
                ? "ring-2 ring-unmute-purple ring-offset-2"
                : ""
            }`}
            onClick={() => toggleInterest(interest.id)}
            disabled={selectedInterests.length >= MAX_SELECTIONS && !selectedInterests.includes(interest.id)}
          >
            <div className="flex flex-col items-center">
              <span className="text-2xl mb-1">{interest.icon}</span>
              <span className="text-sm font-medium text-center">{interest.name}</span>
            </div>
          </button>
        ))}
        
        {filteredInterests.length === 0 && (
          <div className="col-span-2 p-8 flex flex-col items-center justify-center text-gray-500">
            <Filter className="h-10 w-10 mb-2" />
            <p>No interests found matching your search</p>
          </div>
        )}
      </div>
      
      <div className="mt-auto">
        <Button
          onClick={handleNext}
          className="unmute-primary-button w-full"
          disabled={selectedInterests.length === 0}
        >
          Next ({selectedInterests.length} selected)
        </Button>
        <p className="text-center text-xs text-gray-500 mt-2">
          {selectedInterests.length >= MAX_SELECTIONS ? 
            `Maximum of ${MAX_SELECTIONS} interests reached` : 
            `Select up to ${MAX_SELECTIONS - selectedInterests.length} more interests`
          }
        </p>
      </div>
    </div>
  );
};

export default InterestsStep;
