
import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useReel } from "@/hooks/use-reel";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Share, Volume2, VolumeX } from "lucide-react";
import { useSocialActions } from "@/hooks/use-social-actions";
import { formatTimeAgo } from "@/lib/utils";
import { ErrorDisplay } from '@/components/ui/error-display';
import { Link } from "react-router-dom";
import { ReelWithUser } from "@/types/reels";
import { motion, useAnimationControls } from "framer-motion";
import ReelMuteButton from "./controls/ReelMuteButton";
import ReelEmotionDisplay from "./controls/ReelEmotionDisplay";
import "@/styles/animation-utils.css";

// Add missing formatCompactNumber utility function
const formatCompactNumber = (num: number): string => {
  if (num < 1000) return num.toString();
  if (num < 1000000) return (num / 1000).toFixed(1) + 'k';
  return (num / 1000000).toFixed(1) + 'm';
};

// Update the component to support both single reel mode and feed mode
interface ReelViewProps {
  reelWithUser?: ReelWithUser;
  onNext?: () => void;
  onPrevious?: () => void;
  onSwipe?: (direction: string) => void;
  hasNext?: boolean;
  hasPrevious?: boolean;
  currentIndex?: number;
  totalReels?: number;
}

const ReelView: React.FC<ReelViewProps> = ({
  reelWithUser,
  onNext,
  onPrevious,
  onSwipe,
  hasNext,
  hasPrevious,
  currentIndex,
  totalReels
}) => {
  const { reelId } = useParams<{ reelId: string }>();
  const { reel: singleReel, loading, error, refetch } = useReel(reelId || "");
  const { user } = useAuth();
  const { toggleFollow, checkFollowStatus, toggleLikePost, hasLikedPost, getPostLikesCount } = useSocialActions();
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const emotionControls = useAnimationControls();
  
  // Determine which reel to display (from props or from hook)
  const reel = reelWithUser ? reelWithUser.reel : singleReel;
  const userProfile = reelWithUser ? reelWithUser.user : singleReel?.profiles || null;
  
  useEffect(() => {
    const checkFollowingStatus = async () => {
      if (user && reel?.user_id) {
        const following = await checkFollowStatus(reel.user_id);
        setIsFollowing(following);
      }
    };

    const checkLikeStatus = async () => {
      if (user && reel?.id) {
        try {
          const liked = await hasLikedPost(reel.id, user.id, 'reel');
          setIsLiked(liked);
        } catch (error) {
          console.error("Error checking like status:", error);
        }
      }
    };

    const getLikes = async () => {
      if (reel?.id) {
        try {
          const count = await getPostLikesCount(reel.id, 'reel');
          setLikesCount(count);
        } catch (error) {
          console.error("Error getting likes count:", error);
        }
      }
    };

    checkFollowingStatus();
    checkLikeStatus();
    getLikes();
  }, [user, reel, checkFollowStatus, hasLikedPost, getPostLikesCount]);

  const handleFollowToggle = async () => {
    if (!user || !reel) return;

    try {
      const result = await toggleFollow(reel.user_id);
      setIsFollowing(result);
    } catch (error) {
      console.error("Error toggling follow:", error);
    }
  };

  const handleLikeToggle = async () => {
    if (!user || !reel) return;

    try {
      // Optimistic UI update
      setIsLiked(!isLiked);
      setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
      
      // Show emotion animation if applicable
      if (!isLiked) {
        emotionControls.start({
          opacity: [0, 1, 0],
          scale: [1, 1.5, 0.8, 0],
          transition: { duration: 1.5 }
        });
      }
      
      // Make API call
      const result = await toggleLikePost(reel.id, user.id, 'reel');
      
      // If result is different from what we expected, revert
      if (result !== !isLiked) {
        setIsLiked(result);
        const count = await getPostLikesCount(reel.id, 'reel');
        setLikesCount(count);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      // Revert on error
      setIsLiked(!isLiked);
      setLikesCount(isLiked ? likesCount + 1 : likesCount - 1);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };
  
  // Handle emotion selection
  const handleEmotionSelect = (emotion: string) => {
    setSelectedEmotion(emotion);
    emotionControls.start({
      opacity: [0, 1, 0],
      scale: [1, 1.5, 0.8, 0],
      transition: { duration: 1.5 }
    });
  };

  if (loading && !reelWithUser) {
    return <div className="flex justify-center items-center h-screen bg-black/90">
      <div className="animate-pulse flex flex-col items-center">
        <div className="w-16 h-16 rounded-full bg-gray-600/50 mb-4"></div>
        <div className="h-2 w-24 bg-gray-600/50 rounded"></div>
      </div>
    </div>;
  }

  if ((error || !reel) && !reelWithUser) {
    return (
      <div className="p-4 bg-black/90 min-h-[80vh] flex items-center justify-center">
        <ErrorDisplay 
          title="Failed to load reel" 
          message={error || "This reel might have been deleted or is unavailable"}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  if (!reel && !reelWithUser) {
    return <div className="flex justify-center items-center h-screen bg-black/90 text-white">No reel found</div>;
  }

  return (
    <motion.div 
      className="relative overflow-hidden rounded-xl aspect-[9/16] bg-black w-full max-w-md mx-auto shadow-xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Video Container */}
      <div className="relative w-full h-full">
        <video
          ref={videoRef}
          src={reel?.video_url}
          playsInline
          autoPlay
          loop
          muted={isMuted}
          className="w-full h-full object-cover"
        />
        
        {/* Gradient Overlay for better text visibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />
        
        {/* Emotion display (hearts, etc.) */}
        <ReelEmotionDisplay 
          selectedEmotion={selectedEmotion}
          liked={isLiked}
          controls={emotionControls}
        />
      </div>
      
      {/* User Info - Top section */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
        <Link to={`/profile/${reel?.user_id}`} className="flex items-center gap-2 group">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Avatar className="border-2 border-white h-10 w-10 shadow-lg">
              <AvatarImage src={userProfile?.avatar || ""} alt={userProfile?.username || "User"} />
              <AvatarFallback className="bg-primary/80 text-white">
                {userProfile?.username?.[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
          </motion.div>
          
          <motion.div 
            className="flex flex-col items-start" 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-sm font-bold text-white group-hover:text-primary transition-colors">
              {userProfile?.username || "Anonymous"}
            </p>
            <p className="text-xs text-white/70">{formatTimeAgo(reel?.created_at || "")}</p>
          </motion.div>
        </Link>
        
        {user && user.id !== reel?.user_id && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleFollowToggle}
              className={`${isFollowing 
                ? 'bg-white/10 text-white border-white/30' 
                : 'bg-primary text-white border-primary'} 
                backdrop-blur-sm hover:bg-primary/80 font-medium rounded-full px-4`}
            >
              {isFollowing ? "Following" : "Follow"}
            </Button>
          </motion.div>
        )}
      </div>
      
      {/* Action buttons - Right side */}
      <motion.div 
        className="absolute bottom-20 right-4 flex flex-col items-center gap-6"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4, staggerChildren: 0.1 }}
      >
        <motion.div 
          className="flex flex-col items-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleLikeToggle}
            className="h-12 w-12 rounded-full bg-black/20 backdrop-blur-sm border border-white/10"
          >
            <Heart 
              className={`h-6 w-6 transition-all duration-300 ${isLiked ? 'text-red-500 fill-red-500 scale-110' : 'text-white'}`} 
            />
          </Button>
          <span className="text-sm mt-1 text-white">{formatCompactNumber(likesCount)}</span>
        </motion.div>
        
        <motion.div 
          className="flex flex-col items-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button 
            variant="ghost" 
            size="icon"
            className="h-12 w-12 rounded-full bg-black/20 backdrop-blur-sm border border-white/10"
          >
            <MessageCircle className="h-6 w-6 text-white" />
          </Button>
          <span className="text-sm mt-1 text-white">Chat</span>
        </motion.div>
        
        <motion.div 
          className="flex flex-col items-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button 
            variant="ghost" 
            size="icon"
            className="h-12 w-12 rounded-full bg-black/20 backdrop-blur-sm border border-white/10"
          >
            <Share className="h-6 w-6 text-white" />
          </Button>
          <span className="text-sm mt-1 text-white">Share</span>
        </motion.div>
      </motion.div>
      
      {/* Mute button */}
      <ReelMuteButton isMuted={isMuted} onToggleMute={toggleMute} />
      
      {/* Caption - Bottom section */}
      {reel?.caption && (
        <motion.div 
          className="absolute bottom-4 left-4 right-16 z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-white text-sm bg-black/30 backdrop-blur-sm p-2 rounded-lg">
            {reel.caption}
          </p>
        </motion.div>
      )}
      
      {/* Reel Navigation */}
      {onPrevious && onNext && (
        <div className="absolute top-1/2 transform -translate-y-1/2 w-full flex justify-between px-4 pointer-events-none">
          {hasPrevious && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="opacity-70 backdrop-blur-sm pointer-events-auto bg-black/30 text-white hover:bg-black/50" 
              onClick={onPrevious}
            >
              &lt;
            </Button>
          )}
          {hasNext && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="opacity-70 backdrop-blur-sm pointer-events-auto ml-auto bg-black/30 text-white hover:bg-black/50" 
              onClick={onNext}
            >
              &gt;
            </Button>
          )}
        </div>
      )}
      
      {/* Reel counter indicator */}
      {typeof currentIndex === 'number' && totalReels && (
        <motion.div 
          className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/30 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {currentIndex + 1} / {totalReels}
        </motion.div>
      )}
    </motion.div>
  );
};

export default ReelView;
