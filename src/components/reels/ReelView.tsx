import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useReel } from "@/hooks/use-reel";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Share, Volume2, VolumeX } from "lucide-react";
import { useSocialActions } from "@/hooks/use-social-actions";
import { formatCompactNumber, formatTimeAgo } from "@/lib/utils";
import { ErrorDisplay } from "@/components/ui/error-display";
import { Reel } from "@/types/reel";

const ReelView = () => {
  const { reelId } = useParams<{ reelId: string }>();
  const { reel, isLoading, error, refetch } = useReel(reelId || "");
  const { user } = useAuth();
  const { toggleFollow, checkFollowStatus, toggleLikePost, hasLikedPost, getPostLikesCount } = useSocialActions();
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

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
      
      // Make API call
      const result = await toggleLikePost(reel.id, 'reel');
      
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

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error || !reel) {
    return (
      <div className="p-4">
        <ErrorDisplay 
          title="Failed to load reel" 
          message={error?.message || "This reel might have been deleted or is unavailable"} 
          onRetry={refetch}
        />
      </div>
    );
  }

  return (
    <div className="relative">
      <video
        ref={videoRef}
        src={reel.video_url}
        controls
        muted={isMuted}
        className="w-full aspect-video rounded-xl"
      />
      <div className="absolute bottom-4 left-4">
        <Link to={`/profile/${reel.user_id}`} className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={reel.profiles?.avatar || ""} alt={reel.profiles?.username || "User"} />
            <AvatarFallback>{reel.profiles?.username?.[0]?.toUpperCase() || "U"}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-semibold">{reel.profiles?.username || "Anonymous"}</p>
            <p className="text-xs text-gray-400">{formatTimeAgo(reel.created_at)}</p>
          </div>
        </Link>
      </div>
      <div className="absolute top-4 right-4">
        <Button variant="ghost" size="icon" onClick={toggleMute}>
          {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
        </Button>
      </div>
      <div className="absolute bottom-4 right-4 flex flex-col items-center gap-3">
        <Button variant="ghost" size="icon" onClick={handleLikeToggle}>
          <Heart className={`h-6 w-6 ${isLiked ? 'fill-red-500 text-red-500' : 'text-white'}`} />
          <span className="text-sm">{formatCompactNumber(likesCount)}</span>
        </Button>
        <Button variant="ghost" size="icon">
          <MessageCircle className="h-6 w-6 text-white" />
          <span className="text-sm">{formatCompactNumber(123)}</span>
        </Button>
        <Button variant="ghost" size="icon">
          <Share className="h-6 w-6 text-white" />
        </Button>
        <Button variant="outline" size="sm" onClick={handleFollowToggle}>
          {isFollowing ? "Unfollow" : "Follow"}
        </Button>
      </div>
    </div>
  );
};

export default ReelView;
