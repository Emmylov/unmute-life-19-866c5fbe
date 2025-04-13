
import React, { useState, useEffect } from "react";
import { motion, useAnimation, PanInfo } from "framer-motion";
import { Flag, MessageCircle, Bookmark, Share2, Heart, Eye, Repeat } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";
import EmojiReactions from "./EmojiReactions";
import ReelVideo from "./controls/ReelVideo";
import ReelUserInfo from "./controls/ReelUserInfo";
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
import { FeelBar } from "@/components/reels/FeelBar";
import ReelUnmuteThread from "@/components/reels/ReelUnmuteThread";

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
    vibe_tag?: string | null;
    mood_vibe?: string | null;
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
  const [isUnmuteThreadOpen, setIsUnmuteThreadOpen] = useState(false);
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const controls = useAnimation();
  const { reel, user } = reelWithUser;
  const { user: currentUser } = useAuth();
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

  // Generate gradient based on mood vibe
  const getGradient = () => {
    switch(reel.mood_vibe) {
      case 'Uplifting':
        return 'from-blue-50 via-indigo-50 to-purple-50';
      case 'Raw':
        return 'from-gray-50 via-neutral-50 to-gray-50';
      case 'Funny':
        return 'from-amber-50 via-yellow-50 to-orange-50';
      case 'Vulnerable':
        return 'from-pink-50 via-rose-50 to-red-50';
      default:
        return 'from-white/40 via-white/60 to-white/40';
    }
  };

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
    
    // Reset emotion selection when changing reels
    setSelectedEmotion(null);
  }, [reel.id, currentUser]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleEmotionSelect = (emotion: string) => {
    if (!currentUser) {
      toast.error("You must be logged in to react to reels");
      return;
    }
    
    // Toggle emotion if already selected
    if (selectedEmotion === emotion) {
      setSelectedEmotion(null);
      toast("Reaction removed");
    } else {
      setSelectedEmotion(emotion);
      toast.success(`You felt: ${emotion}`);
      
      // Show animation if selecting new emotion
      controls.start({
        scale: [1, 1.2, 1],
        opacity: [1, 1, 0],
        transition: { duration: 0.8 }
      });
    }
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
    const shareData = getShareData();
    
    try {
      if (navigator.share) {
        navigator.share(shareData);
      } else {
        // Fallback for browsers that don't support Web Share API
        navigator.clipboard.writeText(shareData.url);
        toast.success("Link copied to clipboard!");
      }
    } catch (error) {
      console.error("Error sharing:", error);
      if ((error as Error).name !== 'AbortError') {
        toast.error("Failed to share");
      }
    }
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

  const openUnmuteThread = () => {
    setIsUnmuteThreadOpen(true);
    // Pause video when opening comments
    setIsPlaying(false);
  };

  return (
    <motion.div 
      className="relative w-full h-full overflow-hidden"
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={0.2}
      onDragEnd={handleDragEnd}
    >
      {/* Main card with rounded corners and shadow */}
      <div className="absolute inset-x-1 inset-y-2 rounded-2xl overflow-hidden shadow-xl">
        {/* Gradient background based on mood vibe */}
        <div className={`absolute inset-0 bg-gradient-to-br ${getGradient()} opacity-20`}></div>
        
        <ReelVideo 
          videoUrl={reel.video_url}
          thumbnailUrl={reel.thumbnail_url}
          isPlaying={isPlaying}
          isMuted={isMuted}
          currentIndex={currentIndex}
          onTogglePlay={togglePlay}
        />

        {/* Heart animation when liking */}
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-30"
          animate={controls}
          initial={{ opacity: 0, scale: 1 }}
        >
          {selectedEmotion ? (
            <div className="text-6xl filter drop-shadow-lg">
              {selectedEmotion === 'Relatable' && '💬'}
              {selectedEmotion === 'Made Me Feel' && '❤️'}
              {selectedEmotion === 'Shared This' && '🔄'}
              {selectedEmotion === 'Still Thinking' && '👀'}
            </div>
          ) : (
            <Heart className="w-24 h-24 text-pink-500 filter drop-shadow-lg" fill={liked ? "#ec4899" : "none"} />
          )}
        </motion.div>

        {/* Navigation for next/previous */}
        <ReelNavigation hasNext={hasNext} hasPrevious={hasPrevious} />

        {/* Modern overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

        <div className="absolute inset-0 pointer-events-none">
          {/* Top section with user info and report button - enhanced design */}
          <div className="absolute top-0 left-0 right-0 p-4 z-20 flex justify-between items-start">
            <div className="backdrop-blur-md bg-black/20 rounded-full px-3 py-2 pointer-events-auto flex items-center">
              <ReelUserInfo user={user} />
              {reel.vibe_tag && (
                <span className="ml-2 py-0.5 px-2 bg-white/20 rounded-full text-xs text-white font-medium">
                  {reel.vibe_tag}
                </span>
              )}
            </div>
            
            <button 
              onClick={handleReportReel}
              disabled={isReporting}
              className="p-2 rounded-full bg-black/20 backdrop-blur-md pointer-events-auto hover:bg-black/30 transition-colors"
            >
              <Flag className="w-4 h-4 text-white/80 hover:text-white" />
            </button>
          </div>
          
          {/* Feel Bar instead of traditional likes - modern design */}
          <div className="absolute bottom-32 left-4 right-4 pointer-events-auto">
            <FeelBar 
              selectedEmotion={selectedEmotion}
              onEmotionSelect={handleEmotionSelect}
            />
          </div>

          {/* Bottom section with caption and audio info - improved UI */}
          <div className={`absolute bottom-16 left-4 ${isMobile ? 'right-16' : 'right-24'} pointer-events-auto`}>
            <div className="backdrop-blur-lg bg-black/30 rounded-xl p-4 space-y-2">
              <ReelCaption caption={reel.caption} />
              
              <ReelAudioInfo 
                audio={reel.audio} 
                audioType={reel.audio_type} 
                audioUrl={reel.audio_url} 
              />
              
              {reel.tags && reel.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {reel.tags.map((tag, index) => (
                    <span key={index} className="text-xs text-white bg-white/20 rounded-full px-2 py-0.5">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Side actions - modern redesign */}
          <div className="absolute bottom-24 right-3 md:right-4 flex flex-col space-y-5 pointer-events-auto z-20">
            {/* Comment button */}
            <button 
              onClick={openUnmuteThread}
              className="flex flex-col items-center"
            >
              <div className="w-12 h-12 rounded-full bg-black/30 backdrop-blur-lg hover:bg-black/40 flex items-center justify-center transition-colors">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs text-white/90 mt-1.5 font-medium">
                {commentCount > 0 ? commentCount : 'Comment'}
              </span>
            </button>
            
            {/* Share button */}
            <button 
              onClick={handleRepostReel}
              className="flex flex-col items-center"
            >
              <div className="w-12 h-12 rounded-full bg-black/30 backdrop-blur-lg hover:bg-black/40 flex items-center justify-center transition-colors">
                <Repeat className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs text-white/90 mt-1.5 font-medium">Share</span>
            </button>
            
            {/* Save button */}
            <button 
              onClick={handleToggleSave}
              className="flex flex-col items-center"
            >
              <div className={`w-12 h-12 rounded-full ${saved ? 'bg-blue-500/50' : 'bg-black/30'} backdrop-blur-lg hover:bg-black/40 flex items-center justify-center transition-colors`}>
                <Bookmark className="w-5 h-5 text-white" fill={saved ? "white" : "none"} />
              </div>
              <span className="text-xs text-white/90 mt-1.5 font-medium">{saved ? 'Saved' : 'Save'}</span>
            </button>
          </div>

          {/* Mute button - improved */}
          <div className="absolute bottom-4 right-4 pointer-events-auto">
            <ReelMuteButton isMuted={isMuted} onToggleMute={toggleMute} />
          </div>
        </div>
      </div>

      {/* Unmute Thread Modal */}
      <ReelUnmuteThread
        reelId={reel.id}
        isOpen={isUnmuteThreadOpen}
        onClose={() => {
          setIsUnmuteThreadOpen(false);
          setIsPlaying(true); // Resume video when closing comments
        }}
      />
    </motion.div>
  );
};

export default ReelView;
