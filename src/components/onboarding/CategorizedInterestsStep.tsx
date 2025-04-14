
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CategorizedInterestsStepProps {
  onNext: () => void;
}

const activismInterests = [
  { id: "human-rights", name: "Human Rights", icon: "🌟" },
  { id: "climate-action", name: "Climate Action", icon: "🌍" },
  { id: "lgbtq-rights", name: "LGBTQ+ Rights", icon: "🌈" },
  { id: "gender-equality", name: "Gender Equality", icon: "⚖️" },
  { id: "racial-justice", name: "Racial Justice", icon: "✊" },
  { id: "environmentalism", name: "Environmentalism", icon: "🌱" },
  { id: "policy-advocacy", name: "Policy Advocacy", icon: "📜" },
  { id: "mental-health-advocacy", name: "Mental Health Advocacy", icon: "🧠" },
  { id: "education-reform", name: "Education Reform", icon: "📚" },
];

const personalInterests = [
  { id: "music", name: "Music", icon: "🎵" },
  { id: "sports", name: "Sports", icon: "⚽" },
  { id: "fashion", name: "Fashion", icon: "👗" },
  { id: "technology", name: "Technology", icon: "💻" },
  { id: "gaming", name: "Gaming", icon: "🎮" },
  { id: "travel", name: "Travel", icon: "✈️" },
  { id: "food", name: "Food", icon: "🍳" },
  { id: "fitness", name: "Fitness", icon: "💪" },
  { id: "art", name: "Art", icon: "🎨" },
  { id: "photography", name: "Photography", icon: "📸" },
  { id: "movies", name: "Movies", icon: "🎬" },
  { id: "spirituality", name: "Faith & Spirituality", icon: "🕊️" },
  { id: "relationships", name: "Relationships", icon: "❤️" },
  { id: "journaling", name: "Journaling", icon: "📔" },
  { id: "poetry", name: "Poetry", icon: "✒️" },
  { id: "identity", name: "Identity", icon: "🎭" },
  { id: "self-improvement", name: "Self-Improvement", icon: "🌱" },
  { id: "family", name: "Family", icon: "👨‍👩‍👧‍👦" },
  { id: "productivity", name: "Productivity", icon: "⚡" },
  { id: "neurodiversity", name: "Neurodiversity", icon: "🧩" },
  { id: "entrepreneurship", name: "Entrepreneurship", icon: "💡" },
  { id: "study-life", name: "Study Life", icon: "📚" },
  { id: "books", name: "Books & Reading", icon: "📖" },
];

const CategorizedInterestsStep = ({ onNext }: CategorizedInterestsStepProps) => {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const maxSelections = 10;

  const toggleInterest = (id: string) => {
    if (selectedInterests.includes(id)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== id));
    } else if (selectedInterests.length < maxSelections) {
      setSelectedInterests([...selectedInterests, id]);
    }
  };

  const filterInterests = (interests: typeof activismInterests) =>
    interests.filter((interest) =>
      interest.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div className="flex flex-col flex-grow p-6">
      <h2 className="text-3xl font-bold mb-2 text-center">Choose Your Interests</h2>
      <p className="text-center text-gray-600 mb-2">
        Select up to {maxSelections} topics you're passionate about
      </p>
      <p className="text-sm text-center text-gray-500 mb-6">
        ({selectedInterests.length}/{maxSelections} selected)
      </p>

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

      <Tabs defaultValue="activism" className="w-full flex-grow">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="activism">Activism</TabsTrigger>
          <TabsTrigger value="personal">Personal</TabsTrigger>
        </TabsList>

        <TabsContent value="activism" className="mt-0">
          <div className="grid grid-cols-2 gap-3 max-h-[400px] overflow-y-auto">
            {filterInterests(activismInterests).map((interest) => (
              <button
                key={interest.id}
                onClick={() => toggleInterest(interest.id)}
                disabled={!selectedInterests.includes(interest.id) && selectedInterests.length >= maxSelections}
                className={`unmute-bubble p-4 text-left flex items-center space-x-3 ${
                  selectedInterests.includes(interest.id)
                    ? "bg-gradient-to-r from-unmute-purple to-unmute-pink text-white"
                    : "bg-white hover:bg-gray-50"
                } ${
                  !selectedInterests.includes(interest.id) && selectedInterests.length >= maxSelections
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                <span className="text-2xl">{interest.icon}</span>
                <span className="font-medium">{interest.name}</span>
              </button>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="personal" className="mt-0">
          <div className="grid grid-cols-2 gap-3 max-h-[400px] overflow-y-auto">
            {filterInterests(personalInterests).map((interest) => (
              <button
                key={interest.id}
                onClick={() => toggleInterest(interest.id)}
                disabled={!selectedInterests.includes(interest.id) && selectedInterests.length >= maxSelections}
                className={`unmute-bubble p-4 text-left flex items-center space-x-3 ${
                  selectedInterests.includes(interest.id)
                    ? "bg-gradient-to-r from-unmute-purple to-unmute-pink text-white"
                    : "bg-white hover:bg-gray-50"
                } ${
                  !selectedInterests.includes(interest.id) && selectedInterests.length >= maxSelections
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                <span className="text-2xl">{interest.icon}</span>
                <span className="font-medium">{interest.name}</span>
              </button>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-6">
        <Button
          onClick={onNext}
          className="unmute-primary-button w-full"
          disabled={selectedInterests.length === 0}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default CategorizedInterestsStep;
