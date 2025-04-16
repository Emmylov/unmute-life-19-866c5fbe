
import React from "react";
import { Link } from "react-router-dom";
import { Sparkles, Activity } from "lucide-react";

interface HomeGreetingProps {
  username?: string;
}

const affirmations = [
  "You're doing amazing today!",
  "Your journey matters.",
  "Small steps lead to big changes.",
  "Be kind to yourself today.",
  "Your feelings are valid."
];

const HomeGreeting: React.FC<HomeGreetingProps> = ({ username }) => {
  const randomAffirmation = affirmations[Math.floor(Math.random() * affirmations.length)];

  return (
    <div className="bg-dream-mist/30 rounded-xl p-4 shadow-sm border border-white/40 space-y-3">
      <h2 className="text-xl font-semibold">
        Hello, {username || "Beautiful Soul"}! 
      </h2>
      <p className="text-gray-600 italic">
        "{randomAffirmation}"
      </p>
      <div className="flex space-x-2">
        <Link 
          to="/reels" 
          className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full hover:bg-primary/20 transition-colors"
        >
          <Sparkles className="h-4 w-4" />
          Explore Reels
        </Link>
        <Link 
          to="/vibe-check" 
          className="flex items-center gap-2 bg-cosmic-crush/10 text-cosmic-crush px-3 py-1.5 rounded-full hover:bg-cosmic-crush/20 transition-colors"
        >
          <Activity className="h-4 w-4" />
          Do a Vibe Check
        </Link>
      </div>
    </div>
  );
};

export default HomeGreeting;
