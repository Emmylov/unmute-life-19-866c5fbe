
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useSocialActions } from "@/hooks/use-social-actions";
import { useAuth } from "@/contexts/AuthContext";
import { Heart, Check } from "lucide-react";

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
  const [showReactionAnimation, setShowReactionAnimation] = useState(false);
  
  // Store follow status in localStorage to persist UI state between refreshes
  const localStorageKey = user ? `follow_${user.id}_${creator.id}` : null;

  useEffect(() => {
    let isMounted = true;
    
    const checkIsFollowing = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      
      // Check localStorage first for UI persistence
      if (localStorageKey) {
        const savedFollowState = localStorage.getItem(localStorageKey);
        if (savedFollowState === 'true') {
          setIsFollowing(true);
        }
      }
      
      try {
        if (isMounted) setLoading(true);
        
        // Then verify with database
        try {
          const following = await checkFollowStatus(creator.id);
          if (isMounted) {
            setIsFollowing(following);
            
            // Update localStorage
            if (localStorageKey) {
              localStorage.setItem(localStorageKey, following.toString());
            }
          }
        } catch (error) {
          console.error("Error checking follow status:", error);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    
    checkIsFollowing();
    
    return () => {
      isMounted = false;
    };
  }, [user, creator.id, checkFollowStatus, localStorageKey]);

  const handleFollowToggle = async () => {
    if (!user) return;
    
    // Optimistic UI update
    const previousState = isFollowing;
    setIsFollowing(!previousState);
    
    // Update localStorage immediately for UI persistence
    if (localStorageKey) {
      localStorage.setItem(localStorageKey, (!previousState).toString());
    }
    
    try {
      const result = await toggleFollow(creator.id);
      setIsFollowing(result);
      
      // Update localStorage with server result
      if (localStorageKey) {
        localStorage.setItem(localStorageKey, result.toString());
      }
      
      // Show reaction animation
      setShowReactionAnimation(true);
      setTimeout(() => setShowReactionAnimation(false), 1000);
      
    } catch (error) {
      console.error("Error toggling follow:", error);
      // Revert to previous state if error
      setIsFollowing(previousState);
      if (localStorageKey) {
        localStorage.setItem(localStorageKey, previousState.toString());
      }
    }
  };
  
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="min-w-[160px] max-w-[160px] rounded-xl overflow-hidden shadow-sm border p-4 flex flex-col items-center text-center relative"
    >
      <AnimatePresence>
        {showReactionAnimation && (
          <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1.5, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
          >
            {isFollowing ? (
              <Check className="text-green-500 h-12 w-12" />
            ) : (
              <Heart className="text-red-500 h-12 w-12" />
            )}
          </motion.div>
        )}
      </AnimatePresence>
      
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
        {loading ? "Loading..." : isFollowing ? "Following" : "Follow"}
      </Button>
    </motion.div>
  );
};

export default CreatorProfileCard;
