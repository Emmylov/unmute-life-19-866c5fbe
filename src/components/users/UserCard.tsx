
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Users } from "lucide-react";
import { getInitials } from "@/lib/utils";
import { useSocialActions } from "@/hooks/use-social-actions";
import { toast } from "sonner";

interface UserCardProps {
  user: any;
  featured?: boolean;
  trending?: boolean;
}

const UserCard = ({ user, featured = false, trending = false }: UserCardProps) => {
  const { toggleFollow, loadingFollowState } = useSocialActions();
  const [isFollowing, setIsFollowing] = useState(user.isFollowing || false);
  
  const handleFollowToggle = async () => {
    try {
      const result = await toggleFollow(user.id);
      setIsFollowing(result);
    } catch (error) {
      console.error("Error toggling follow:", error);
    }
  };
  
  const handleMessage = () => {
    toast.info("Chat feature coming soon!");
  };
  
  return (
    <motion.div 
      whileHover={{ y: -5, boxShadow: "0 10px 30px -5px rgba(0, 0, 0, 0.1)" }} 
      className={`relative bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-sm overflow-hidden ${
        featured ? "border-unmute-purple/30" : ""
      } ${trending ? "border-unmute-pink/30" : ""}`}
    >
      {featured && (
        <div className="absolute top-2 right-2 bg-gradient-to-r from-unmute-purple to-unmute-teal text-white text-xs px-2 py-0.5 rounded-full">
          Featured
        </div>
      )}
      
      {trending && (
        <div className="absolute top-2 right-2 bg-gradient-to-r from-unmute-pink to-unmute-coral text-white text-xs px-2 py-0.5 rounded-full">
          Trending
        </div>
      )}
      
      <div className="flex items-center">
        <Link to={`/profile/${user.username || user.id}`} className="flex-shrink-0">
          <Avatar className="h-14 w-14 border-2 border-white shadow-sm">
            <AvatarImage src={user.avatar} alt={user.username} />
            <AvatarFallback className="bg-gradient-to-br from-unmute-purple to-unmute-pink text-white">
              {getInitials(user.full_name || user.username || "U")}
            </AvatarFallback>
          </Avatar>
        </Link>
        <div className="ml-3 overflow-hidden">
          <Link to={`/profile/${user.username || user.id}`} className="block">
            <h3 className="font-medium text-sm truncate">
              {user.full_name || user.username || "User"}
            </h3>
            <p className="text-xs text-gray-500 truncate">@{user.username || "user"}</p>
          </Link>
          <div className="flex items-center mt-1 space-x-3 text-xs text-gray-500">
            <span className="flex items-center">
              <Users className="h-3 w-3 mr-1" />
              {user.followers || 0}
            </span>
            <span className="flex items-center">
              <Heart className="h-3 w-3 mr-1" />
              {Math.floor(Math.random() * 100)}
            </span>
          </div>
        </div>
      </div>
      
      <div className="mt-4 flex space-x-2">
        <Button 
          size="sm" 
          variant={isFollowing ? "outline" : "default"} 
          className={`flex-1 ${isFollowing ? 'hover:bg-red-50' : 'bg-gradient-to-r from-unmute-purple to-unmute-pink'}`}
          onClick={handleFollowToggle}
          disabled={loadingFollowState[user.id]}
        >
          {loadingFollowState[user.id] ? "..." : isFollowing ? "Following" : "Follow"}
        </Button>
        <Button 
          size="sm" 
          variant="outline" 
          className="flex-1"
          onClick={handleMessage}
        >
          <MessageCircle className="h-4 w-4 mr-1" /> Message
        </Button>
      </div>
    </motion.div>
  );
};

export default UserCard;
