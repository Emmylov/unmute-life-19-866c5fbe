
import React from "react";
import { Link } from "react-router-dom";
import { Sparkles, Activity, Heart } from "lucide-react";
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
      className="bg-gradient-to-r from-dream-mist to-white/80 rounded-xl p-6 shadow-md border border-white/40 relative overflow-hidden"
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="absolute -right-12 -top-12 w-36 h-36 bg-unmute-purple/5 rounded-full blur-2xl" />
      <div className="absolute -left-8 -bottom-8 w-28 h-28 bg-unmute-pink/5 rounded-full blur-xl" />
      
      <div className="relative">
        <div className="flex items-center mb-3">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Heart className="h-5 w-5 mr-2 text-cosmic-crush" />
          </motion.div>
          <h2 className="text-2xl font-semibold bg-gradient-to-r from-unmute-purple to-unmute-pink bg-clip-text text-transparent">
            Hello, {username || "Beautiful Soul"}! 
          </h2>
        </div>
        
        <p className="text-gray-600 italic mb-4 font-medium">
          "{randomAffirmation}"
        </p>
        
        <div className="flex flex-wrap gap-2">
          <Link 
            to="/reels" 
            className="flex items-center gap-2 bg-gradient-to-r from-primary/80 to-primary text-white px-4 py-2 rounded-full hover:opacity-90 transition-all shadow-sm"
          >
            <Sparkles className="h-4 w-4" />
            Explore Reels
          </Link>
          <Link 
            to="/vibe-check" 
            className="flex items-center gap-2 bg-gradient-to-r from-cosmic-crush to-unmute-pink text-white px-4 py-2 rounded-full hover:opacity-90 transition-all shadow-sm"
          >
            <Activity className="h-4 w-4" />
            Do a Vibe Check
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default HomeGreeting;
