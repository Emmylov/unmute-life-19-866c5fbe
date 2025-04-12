
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Play, Heart, MessageSquare } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";

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
      className="relative rounded-xl overflow-hidden shadow-md bg-black group"
    >
      <Link to={`/reels?reel=${reel.id}`} className="block h-full">
        <AspectRatio ratio={9/16} className="h-full">
          <img
            src={reel.coverImage}
            alt={reel.title}
            className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />
          
          {/* Play button overlay on hover */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-primary/80 rounded-full p-3 backdrop-blur-sm">
              <Play className="h-8 w-8 text-white" fill="white" />
            </div>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
            <p className="font-medium text-sm line-clamp-2">{reel.title}</p>
            <p className="text-xs opacity-80 mb-1">@{reel.username}</p>
            <div className="flex items-center mt-2 space-x-3 text-xs">
              <div className="flex items-center">
                <Heart className="h-3 w-3 mr-1 text-pink-400" />
                <span>{reel.likes.toLocaleString()}</span>
              </div>
              {reel.views && (
                <div className="flex items-center">
                  <MessageSquare className="h-3 w-3 mr-1 text-blue-400" />
                  <span>{reel.views.toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>
        </AspectRatio>
      </Link>
    </motion.div>
  );
};

export default TrendingReelCard;
