
import React from "react";
import { Link } from "react-router-dom";
import { Sparkles, Activity, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

interface HomeGreetingProps {
  username?: string;
}

const affirmations = [
  "You're doing amazing today!",
  "Your journey matters.",
  "Small steps lead to big changes.",
  "Be kind to yourself today.",
  "Your feelings are valid.",
  "Today is full of possibilities.",
  "You are enough just as you are.",
  "Take a moment to breathe deeply.",
  "Your voice deserves to be heard.",
  "Celebrate your small victories!"
];

const HomeGreeting: React.FC<HomeGreetingProps> = ({ username }) => {
  const randomAffirmation = affirmations[Math.floor(Math.random() * affirmations.length)];

  return (
    <motion.div 
      className="bg-gradient-to-r from-dream-mist to-white/80 rounded-xl p-4 shadow-sm border border-white/40 relative overflow-hidden"
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="relative">
        <h2 className="text-lg font-semibold bg-gradient-to-r from-unmute-purple to-unmute-pink bg-clip-text text-transparent mb-2">
          Hello, {username || "Beautiful Soul"}
        </h2>
        
        <p className="text-xs text-gray-600 italic mb-3">
          "{randomAffirmation}"
        </p>
        
        <div className="flex flex-wrap gap-2">
          <Link 
            to="/reels" 
            className="flex items-center gap-1 bg-primary/10 text-primary font-medium px-3 py-1 rounded-full hover:bg-primary/20 transition-all text-xs"
          >
            <Sparkles className="h-3 w-3 mr-1" />
            Explore Reels
          </Link>
          <Link 
            to="/vibe-check" 
            className="flex items-center gap-1 bg-cosmic-crush/10 text-cosmic-crush font-medium px-3 py-1 rounded-full hover:bg-cosmic-crush/20 transition-all text-xs"
          >
            <Activity className="h-3 w-3 mr-1" />
            Vibe Check
          </Link>
          <Link 
            to="/story" 
            className="flex items-center gap-1 bg-amber-600/10 text-amber-700 font-medium px-3 py-1 rounded-full hover:bg-amber-600/20 transition-all text-xs"
          >
            <BookOpen className="h-3 w-3 mr-1" />
            Interactive Story
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default HomeGreeting;
