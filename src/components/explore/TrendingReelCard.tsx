
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

interface TrendingReelCardProps {
  reel: {
    id: string;
    title: string;
    username: string;
    likes: number;
    views?: number;
    coverImage: string;
  };
}

const TrendingReelCard = ({ reel }: TrendingReelCardProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.2 }}
      className="relative rounded-xl overflow-hidden aspect-[9/16] shadow-md bg-black"
    >
      <Link to={`/reels?reel=${reel.id}`}>
        <img
          src={reel.coverImage}
          alt={reel.title}
          className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
          <p className="font-medium text-sm line-clamp-2">{reel.title}</p>
          <p className="text-xs opacity-80">@{reel.username}</p>
          <div className="flex items-center mt-1 text-xs">
            <span>❤️ {reel.likes.toLocaleString()}</span>
            {reel.views && (
              <>
                <span className="mx-2">•</span>
                <span>{reel.views.toLocaleString()} views</span>
              </>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default TrendingReelCard;
