
import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";

interface GameCardProps {
  game: {
    id: string;
    title: string;
    description: string;
    icon: string;
    difficulty: string;
    comingSoon: boolean;
  };
}

const GameCard = ({ game }: GameCardProps) => {
  const navigate = useNavigate();

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
      }}
    >
      <Card
        className={`relative overflow-hidden group cursor-pointer transition-all duration-300 hover:shadow-lg ${
          game.comingSoon ? 'opacity-75' : ''
        }`}
        onClick={() => !game.comingSoon && navigate(`/games/${game.id}`)}
      >
        <div className="p-6">
          <div className="text-4xl mb-4">{game.icon}</div>
          <h3 className="text-xl font-semibold mb-2 text-gray-900">{game.title}</h3>
          <p className="text-gray-600 mb-4">{game.description}</p>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium px-2.5 py-0.5 rounded bg-primary/10 text-primary">
              {game.difficulty}
            </span>
            
            {game.comingSoon ? (
              <span className="text-sm font-medium text-gray-500">
                Coming Soon
              </span>
            ) : (
              <span className="text-sm font-medium text-primary">
                Play Now →
              </span>
            )}
          </div>
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </Card>
    </motion.div>
  );
};

export default GameCard;
