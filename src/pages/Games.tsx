
import React from "react";
import AppLayout from "@/components/layout/AppLayout";
import { motion } from "framer-motion";
import GameCard from "@/components/games/GameCard";
import { Gamepad2 } from "lucide-react";

const Games = () => {
  const games = [
    {
      id: "memory",
      title: "Memory Match",
      description: "Test your memory by matching pairs of cards",
      icon: "🎴",
      difficulty: "Easy",
      comingSoon: false
    },
    {
      id: "word-scramble",
      title: "Word Scramble",
      description: "Unscramble words to boost your mood",
      icon: "📝",
      difficulty: "Medium",
      comingSoon: true
    },
    {
      id: "bubble-pop",
      title: "Bubble Pop",
      description: "Pop bubbles with positive affirmations",
      icon: "🫧",
      difficulty: "Easy",
      comingSoon: true
    }
  ];

  return (
    <AppLayout pageTitle="Games">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center gap-2 mb-4">
            <Gamepad2 className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-gray-900">Fun & Games</h1>
          </div>
          <p className="text-gray-600">Take a break and play some mood-boosting games!</p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          initial="hidden"
          animate="show"
        >
          {games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default Games;
