
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useSocialActions } from "@/hooks/use-social-actions";
import { useAuth } from "@/contexts/AuthContext";

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
  const { user } = useAuth();
  const { toggleFollow, checkFollowStatus, loadingFollowState } = useSocialActions();
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkIsFollowing = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const following = await checkFollowStatus(creator.id);
        setIsFollowing(following);
      } catch (error) {
        console.error("Error checking follow status:", error);
      } finally {
        setLoading(false);
      }
    };
    
    checkIsFollowing();
  }, [user, creator.id, checkFollowStatus]);

  const handleFollowToggle = async () => {
    if (!user) return;
    
    try {
      const result = await toggleFollow(creator.id);
      setIsFollowing(result);
    } catch (error) {
      console.error("Error toggling follow:", error);
    }
  };
  
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
      <Button 
        size="sm" 
        variant={isFollowing ? "outline" : "default"}
        className={`text-xs w-full ${isFollowing ? 'hover:bg-red-50' : ''}`}
        onClick={handleFollowToggle}
        disabled={loading || loadingFollowState[creator.id]}
      >
        {isFollowing ? "Following" : "Follow"}
      </Button>
    </motion.div>
  );
};

export default CreatorProfileCard;
