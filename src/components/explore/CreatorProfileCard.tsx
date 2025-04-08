
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface CreatorProfileCardProps {
  creator: {
    id: string;
    name: string;
    username: string;
    followers: number;
    avatar: string;
  };
}

const CreatorProfileCard = ({ creator }: CreatorProfileCardProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="min-w-[160px] max-w-[160px] rounded-xl overflow-hidden shadow-sm border p-4 flex flex-col items-center text-center"
    >
      <Link to={`/profile/${creator.username}`} className="block">
        <div className="w-16 h-16 rounded-full overflow-hidden mb-3 ring-2 ring-unmute-purple">
          <img
            src={creator.avatar}
            alt={creator.name}
            className="w-full h-full object-cover"
          />
        </div>
        <h3 className="font-medium text-sm">{creator.name}</h3>
        <p className="text-xs text-gray-500 mb-2">@{creator.username}</p>
      </Link>
      <Button size="sm" variant="outline" className="text-xs w-full">
        Follow
      </Button>
    </motion.div>
  );
};

export default CreatorProfileCard;
