
import React, { useState, useEffect } from "react";
import { motion, useAnimation, PanInfo } from "framer-motion";
import { Share2, Heart } from "lucide-react";
import ReelVideo from "./controls/ReelVideo";
import ReelMuteButton from "./controls/ReelMuteButton";
import ReelNavigation from "./controls/ReelNavigation";
import ReelControls from "./controls/ReelControls";
import ReelContent from "./controls/ReelContent";
import ReelSideActions from "./controls/ReelSideActions";
import ReelEmotionDisplay from "./controls/ReelEmotionDisplay";
import ReelUnmuteThread from "@/components/reels/ReelUnmuteThread";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { getCommentCount } from "@/services/comment-service";
import { 
  checkReelLikeStatus, 
  toggleReelLike, 
  checkReelSaveStatus, 
  toggleReelSave,
  repostReel
} from "@/services/reel-service";
import { ReelWithUser } from "@/types/reels";

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
  const [isUnmuteThreadOpen, setIsUnmuteThreadOpen] = useState(false);
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const controls = useAnimation();
  const { reel, user } = reelWithUser;
  const { user: currentUser } = useAuth();

  const getGradient = () => {
    switch(reel.mood_vibe) {
      case 'Uplifting':
        return 'from-blue-100 via-indigo-100 to-purple-100';
      case 'Raw':
        return 'from-gray-100 via-gray-200 to-gray-100';
      case 'Funny':
        return 'from-yellow-100 via-orange-50 to-amber-100';
      case 'Vulnerable':
        return 'from-pink-50 via-rose-100 to-red-50';
      default:
        return 'from-white/40 via-white/60 to-white/40';
    }
  };

  useEffect(() => {
    const fetchReelData = async () => {
      if (!currentUser) return;
      
      try {
        const count = await getCommentCount(reel.id);
        setCommentCount(count || 0);
        
        const isLiked = await checkReelLikeStatus(reel.id, currentUser.id);
        setLiked(isLiked);
        
        const isSaved = await checkReelSaveStatus(reel.id, currentUser.id);
        setSaved(isSaved);
      } catch (error) {
        console.error("Error fetching reel data:", error);
      }
    };
    
    fetchReelData();
    
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
    
    if (selectedEmotion === emotion) {
      setSelectedEmotion(null);
      toast("Reaction removed");
    } else {
      setSelectedEmotion(emotion);
      toast.success(`You felt: ${emotion}`);
      
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
  
  const handleShare = () => {
    const shareData = getShareData();
    
    try {
      if (navigator.share) {
        navigator.share(shareData);
      } else {
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
      <div className="absolute inset-4 rounded-2xl overflow-hidden shadow-xl">
        <div className={`absolute inset-0 bg-gradient-to-br ${getGradient()} opacity-20`}></div>
        
        <ReelVideo 
          videoUrl={reel.video_url}
          thumbnailUrl={reel.thumbnail_url}
          isPlaying={isPlaying}
          isMuted={isMuted}
          currentIndex={currentIndex}
          onTogglePlay={togglePlay}
        />

        <ReelEmotionDisplay
          selectedEmotion={selectedEmotion}
          liked={liked}
          controls={controls}
        />

        <ReelNavigation hasNext={hasNext} hasPrevious={hasPrevious} />

        {/* Subtle gradient overlays for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40 pointer-events-none" />

        {/* User controls with improved spacing */}
        <div className="absolute inset-x-5 top-5">
          <ReelControls 
            reelWithUser={reelWithUser}
            selectedEmotion={selectedEmotion}
            onEmotionSelect={handleEmotionSelect}
            openUnmuteThread={openUnmuteThread}
          />
        </div>

        {/* Reel content with better spacing and backdrop */}
        <div className="absolute inset-x-5 bottom-24">
          <ReelContent reel={reel} />
        </div>

        {/* Side actions with improved positioning */}
        <div className="absolute right-5 bottom-32">
          <ReelSideActions 
            commentCount={commentCount}
            saved={saved}
            onOpenUnmuteThread={openUnmuteThread}
            onRepost={handleRepostReel}
            onToggleSave={handleToggleSave}
          />
        </div>

        {/* Mute button with better positioning */}
        <div className="absolute bottom-6 right-5">
          <ReelMuteButton isMuted={isMuted} onToggleMute={toggleMute} />
        </div>
      </div>

      <ReelUnmuteThread
        reelId={reel.id}
        isOpen={isUnmuteThreadOpen}
        onClose={() => {
          setIsUnmuteThreadOpen(false);
          setIsPlaying(true);
        }}
      />
    </motion.div>
  );
};

export default ReelView;
