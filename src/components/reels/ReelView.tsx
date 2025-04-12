
import React, { useState, useEffect } from "react";
import { motion, useAnimation, PanInfo } from "framer-motion";
import { Heart, Flag } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";
import EmojiReactions from "./EmojiReactions";
import ReelVideo from "./controls/ReelVideo";
import ReelUserInfo from "./controls/ReelUserInfo";
import ReelActions from "./controls/ReelActions";
import ReelCaption from "./controls/ReelCaption";
import ReelAudioInfo from "./controls/ReelAudioInfo";
import ReelNavigation from "./controls/ReelNavigation";
import ReelMuteButton from "./controls/ReelMuteButton";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { getCommentCount } from "@/services/comment-service";
import { useIsMobile, useIsTablet } from "@/hooks/use-responsive";
import { 
  checkReelLikeStatus, 
  toggleReelLike, 
  checkReelSaveStatus, 
  toggleReelSave,
  repostReel,
  reportReel
} from "@/services/reel-service";

interface ReelWithUser {
  reel: {
    id: string;
    user_id: string;
    created_at: string;
    video_url: string;
    thumbnail_url?: string | null;
    caption?: string | null;
    audio?: string | null;
    audio_type?: string | null;
    audio_url?: string | null;
    allow_comments?: boolean | null;
    allow_duets?: boolean | null;
    duration?: number | null;
    original_audio_volume?: number | null;
    overlay_audio_volume?: number | null;
    tags?: string[] | null;
  };
  user: Tables<"profiles">;
}

interface ReelViewProps {
  reelWithUser: ReelWithUser;
  onNext: () => void;
  onPrevious: () => void;
  onSwipe: (direction: string) => void;
  hasNext: boolean;
  hasPrevious: boolean;
  currentIndex: number;
  totalReels: number;
}

const ReelView = ({ 
  reelWithUser, 
  onNext, 
  onPrevious,
  onSwipe,
  hasNext,
  hasPrevious,
  currentIndex,
  totalReels
}: ReelViewProps) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [commentCount, setCommentCount] = useState(0);
  const [isReporting, setIsReporting] = useState(false);
  const controls = useAnimation();
  const { reel, user } = reelWithUser;
  const { user: currentUser } = useAuth();
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

  useEffect(() => {
    const fetchReelData = async () => {
      if (!currentUser) return;
      
      try {
        // Get comment count
        const count = await getCommentCount(reel.id);
        setCommentCount(count || 0);
        
        // Check if reel is liked
        const isLiked = await checkReelLikeStatus(reel.id, currentUser.id);
        setLiked(isLiked);
        
        // Check if reel is saved
        const isSaved = await checkReelSaveStatus(reel.id, currentUser.id);
        setSaved(isSaved);
      } catch (error) {
        console.error("Error fetching reel data:", error);
      }
    };
    
    fetchReelData();
  }, [reel.id, currentUser]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleToggleLike = async () => {
    if (!currentUser) {
      toast.error("You must be logged in to like reels");
      return;
    }
    
    try {
      const result = await toggleReelLike(reel.id, currentUser.id);
      setLiked(result);
      
      if (result) {
        toast.success("Reel liked!");
        
        controls.start({
          scale: [1, 1.2, 1],
          opacity: [1, 1, 0],
          transition: { duration: 0.8 }
        });
      } else {
        toast.success("Reel unliked!");
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      toast.error("Failed to update like status");
    }
  };

  const handleToggleSave = async () => {
    if (!currentUser) {
      toast.error("You must be logged in to save reels");
      return;
    }
    
    try {
      const result = await toggleReelSave(reel.id, currentUser.id);
      setSaved(result);
      
      if (result) {
        toast.success("Reel saved to your collection");
      } else {
        toast.success("Reel removed from saved items");
      }
    } catch (error) {
      console.error("Error toggling save:", error);
      toast.error("Failed to update save status");
    }
  };
  
  const handleRepostReel = async () => {
    if (!currentUser) {
      toast.error("You must be logged in to repost");
      return;
    }
    
    try {
      const result = await repostReel(reel.id, currentUser.id, user.id);
      
      if (result) {
        toast.success("Reel reposted to your profile");
      }
    } catch (error) {
      console.error("Error reposting:", error);
      toast.error("Failed to repost the reel");
    }
  };
  
  const handleReportReel = async () => {
    if (!currentUser) {
      toast.error("You must be logged in to report content");
      return;
    }
    
    if (isReporting) return;
    
    setIsReporting(true);
    
    try {
      await reportReel(reel.id, currentUser.id);
      toast.success("Reel reported. Thank you for helping keep our platform safe.");
    } catch (error) {
      console.error("Error reporting reel:", error);
      toast.error("Failed to report the reel");
    } finally {
      setIsReporting(false);
    }
  };
  
  const handleShare = () => {
    console.log("Reel shared:", reel.id);
  };
  
  const getShareData = () => {
    const username = user?.username || 'User';
    const caption = reel.caption || 'Check out this reel';
    const url = window.location.origin + '/reels?reel=' + reel.id;
    
    return {
      title: `${username}'s reel on Unmute Life`,
      text: caption.length > 50 ? caption.substring(0, 50) + '...' : caption,
      url: url
    };
  };

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 50;
    
    if (info.offset.y < -threshold && hasNext) {
      onSwipe("up");
    } else if (info.offset.y > threshold && hasPrevious) {
      onSwipe("down");
    }
  };

  return (
    <motion.div 
      className="relative w-full h-full bg-black overflow-hidden"
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={0.2}
      onDragEnd={handleDragEnd}
    >
      <ReelVideo 
        videoUrl={reel.video_url}
        thumbnailUrl={reel.thumbnail_url}
        isPlaying={isPlaying}
        isMuted={isMuted}
        currentIndex={currentIndex}
        onTogglePlay={togglePlay}
      />

      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-30"
        animate={controls}
        initial={{ opacity: 0, scale: 1 }}
      >
        <Heart className="w-20 h-20 text-primary filter drop-shadow-lg" fill={liked ? "#ec4899" : "none"} />
      </motion.div>

      <ReelNavigation hasNext={hasNext} hasPrevious={hasPrevious} />

      {/* Glass overlay effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/40 pointer-events-none" />

      <div className="absolute inset-0 pointer-events-none">
        {/* Top section with user info and report button */}
        <div className="absolute top-0 left-0 right-0 p-4 z-20 flex justify-between items-start">
          <div className="backdrop-blur-sm bg-black/20 rounded-full px-3 py-2 pointer-events-auto">
            <ReelUserInfo user={user} />
          </div>
          
          <button 
            onClick={handleReportReel}
            disabled={isReporting}
            className="p-2 rounded-full bg-black/30 backdrop-blur-sm pointer-events-auto hover:bg-black/50 transition-colors"
          >
            <Flag className="w-5 h-5 text-white/80 hover:text-white" />
          </button>
        </div>
        
        {/* Side actions */}
        <ReelActions 
          reelId={reel.id} 
          liked={liked} 
          saved={saved}
          commentCount={commentCount}
          onLike={handleToggleLike} 
          onSave={handleToggleSave}
          onRepost={handleRepostReel}
          onShare={handleShare}
          shareData={getShareData()}
        />

        {/* Bottom section with caption and audio info */}
        <div className={`absolute bottom-6 left-4 ${isMobile ? 'right-16' : 'right-24'} pointer-events-auto`}>
          <div className="backdrop-blur-sm bg-black/20 rounded-xl p-3 space-y-2">
            <ReelCaption caption={reel.caption} />
            
            <ReelAudioInfo 
              audio={reel.audio} 
              audioType={reel.audio_type} 
              audioUrl={reel.audio_url} 
            />
          </div>
        </div>

        {/* Bottom left emoji reactions */}
        <div className={`absolute ${isMobile ? 'bottom-20' : 'bottom-28'} left-4 pointer-events-auto`}>
          <EmojiReactions reelId={reel.id} />
        </div>

        {/* Mute button in slightly different position based on device */}
        <div className={`absolute ${isMobile ? 'bottom-4 right-4' : 'top-20 left-4'} pointer-events-auto`}>
          <ReelMuteButton isMuted={isMuted} onToggleMute={toggleMute} />
        </div>
      </div>
    </motion.div>
  );
};

export default ReelView;
