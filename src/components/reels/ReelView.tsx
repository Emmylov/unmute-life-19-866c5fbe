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
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { getCommentCount } from "@/services/comment-service";

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

  useEffect(() => {
    const checkLikeStatus = async () => {
      if (!currentUser) return;
      
      try {
        const { data, error } = await supabase
          .from("reel_likes")
          .select("*")
          .eq("reel_id", reel.id)
          .eq("user_id", currentUser.id)
          .maybeSingle();
          
        if (!error && data) {
          setLiked(true);
        }
      } catch (error) {
        console.error("Error checking like status:", error);
      }
    };
    
    const checkSaveStatus = async () => {
      if (!currentUser) return;
      
      try {
        const { data, error } = await supabase
          .from("saved_reels")
          .select("*")
          .eq("reel_id", reel.id)
          .eq("user_id", currentUser.id)
          .maybeSingle();
          
        if (!error && data) {
          setSaved(true);
        }
      } catch (error) {
        console.error("Error checking save status:", error);
      }
    };
    
    const fetchCommentCount = async () => {
      try {
        const count = await getCommentCount(reel.id);
        setCommentCount(count || 0);
      } catch (error) {
        console.error("Error fetching comment count:", error);
      }
    };
    
    checkLikeStatus();
    checkSaveStatus();
    fetchCommentCount();
  }, [reel.id, currentUser]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleLike = async () => {
    if (!currentUser) {
      toast.error("You must be logged in to like reels");
      return;
    }
    
    try {
      if (liked) {
        await supabase
          .from("reel_likes")
          .delete()
          .eq("reel_id", reel.id)
          .eq("user_id", currentUser.id);
          
        setLiked(false);
        toast.success("Reel unliked!");
      } 
      else {
        await supabase
          .from("reel_likes")
          .insert({
            reel_id: reel.id,
            user_id: currentUser.id
          });
          
        setLiked(true);
        toast.success("Reel liked!");
        
        controls.start({
          scale: [1, 1.2, 1],
          opacity: [1, 1, 0],
          transition: { duration: 0.8 }
        });
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      toast.error("Failed to update like status");
    }
  };

  const toggleSave = async () => {
    if (!currentUser) {
      toast.error("You must be logged in to save reels");
      return;
    }
    
    try {
      if (saved) {
        await supabase
          .from("saved_reels")
          .delete()
          .eq("reel_id", reel.id)
          .eq("user_id", currentUser.id);
          
        setSaved(false);
        toast.success("Reel removed from saved items");
      } 
      else {
        await supabase
          .from("saved_reels")
          .insert({
            reel_id: reel.id,
            user_id: currentUser.id,
            created_at: new Date().toISOString()
          });
          
        setSaved(true);
        toast.success("Reel saved to your collection");
      }
    } catch (error) {
      console.error("Error toggling save:", error);
      toast.error("Failed to update save status");
    }
  };
  
  const repostReel = async () => {
    if (!currentUser) {
      toast.error("You must be logged in to repost");
      return;
    }
    
    try {
      const { data: existingRepost, error: checkError } = await supabase
        .from("reposted_reels")
        .select("*")
        .eq("reel_id", reel.id)
        .eq("user_id", currentUser.id)
        .maybeSingle();
        
      if (checkError) throw checkError;
      
      if (existingRepost) {
        toast.info("You've already reposted this reel");
        return;
      }
      
      await supabase
        .from("reposted_reels")
        .insert({
          reel_id: reel.id,
          user_id: currentUser.id,
          original_user_id: user.id,
          created_at: new Date().toISOString()
        });
        
      toast.success("Reel reposted to your profile");
    } catch (error) {
      console.error("Error reposting:", error);
      toast.error("Failed to repost the reel");
    }
  };
  
  const reportReel = async () => {
    if (!currentUser) {
      toast.error("You must be logged in to report content");
      return;
    }
    
    if (isReporting) return;
    
    setIsReporting(true);
    
    try {
      await supabase
        .from("reported_content")
        .insert({
          content_id: reel.id,
          content_type: "reel",
          user_id: currentUser.id,
          reason: "inappropriate content",
          status: "pending",
          created_at: new Date().toISOString()
        });
        
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
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        animate={controls}
        initial={{ opacity: 0, scale: 1 }}
      >
        <Heart className="w-20 h-20 text-primary filter drop-shadow-lg" fill={liked ? "#ec4899" : "none"} />
      </motion.div>

      <ReelNavigation hasNext={hasNext} hasPrevious={hasPrevious} />

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-4 left-4 right-4 z-10">
          <ReelUserInfo user={user} />
        </div>
        
        <div className="absolute top-4 right-4 z-10 pointer-events-auto">
          <button 
            onClick={reportReel}
            disabled={isReporting}
            className="p-2 rounded-full bg-black/30 backdrop-blur-md"
          >
            <Flag className="w-5 h-5 text-white/80 hover:text-white" />
          </button>
        </div>
        
        <ReelActions 
          reelId={reel.id} 
          liked={liked} 
          saved={saved}
          commentCount={commentCount}
          onLike={toggleLike} 
          onSave={toggleSave}
          onRepost={repostReel}
          onShare={handleShare}
          shareData={getShareData()}
        />

        <div className="absolute bottom-6 left-4 right-24 pointer-events-auto">
          <ReelCaption caption={reel.caption} />
          
          <ReelAudioInfo 
            audio={reel.audio} 
            audioType={reel.audio_type} 
            audioUrl={reel.audio_url} 
          />
        </div>

        <div className="absolute bottom-28 left-4 pointer-events-auto">
          <EmojiReactions reelId={reel.id} />
        </div>

        <ReelMuteButton isMuted={isMuted} onToggleMute={toggleMute} />
      </div>
    </motion.div>
  );
};

export default ReelView;
