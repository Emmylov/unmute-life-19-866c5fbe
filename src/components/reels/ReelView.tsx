import React, { useState, useEffect } from "react";
import { motion, useAnimation, PanInfo } from "framer-motion";
import { Flag, MessageCircle, Bookmark, Share2, Heart, Eye, Repeat } from "lucide-react";
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
  const [isReporting, setIsReporting] = useState(false);
  const [isUnmuteThreadOpen, setIsUnmuteThreadOpen] = useState(false);
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const controls = useAnimation();
  const { reel, user } = reelWithUser;
  const { user: currentUser } = useAuth();
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

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
      <div className={`absolute inset-x-1 inset-y-2 rounded-2xl overflow-hidden shadow-lg`}>
        <div className={`absolute inset-0 bg-gradient-to-br ${getGradient()} opacity-20`}></div>
        
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
          {selectedEmotion ? (
            <div className="text-5xl filter drop-shadow-lg">
              {selectedEmotion === 'Relatable' && '💬'}
              {selectedEmotion === 'Made Me Feel' && '❤️'}
              {selectedEmotion === 'Shared This' && '🔄'}
              {selectedEmotion === 'Still Thinking' && '👀'}
            </div>
          ) : (
            <Heart className="w-20 h-20 text-primary filter drop-shadow-lg" fill={liked ? "#ec4899" : "none"} />
          )}
        </motion.div>

        <ReelNavigation hasNext={hasNext} hasPrevious={hasPrevious} />

        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30 pointer-events-none" />

        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 right-0 p-4 z-20 flex justify-between items-start">
            <div className="backdrop-blur-sm bg-black/10 rounded-full px-3 py-1.5 pointer-events-auto flex items-center">
              <ReelUserInfo user={user} />
              {reel.vibe_tag && (
                <span className="ml-2 py-0.5 px-2 bg-primary/20 rounded-full text-xs text-primary font-medium">
                  {reel.vibe_tag}
                </span>
              )}
            </div>
            
            <button 
              onClick={handleReportReel}
              disabled={isReporting}
              className="p-2 rounded-full bg-black/10 backdrop-blur-sm pointer-events-auto hover:bg-black/20 transition-colors"
            >
              <Flag className="w-4 h-4 text-white/80 hover:text-white" />
            </button>
          </div>
          
          <div className="absolute bottom-32 left-4 right-4 pointer-events-auto">
            <FeelBar 
              selectedEmotion={selectedEmotion}
              onEmotionSelect={handleEmotionSelect}
            />
          </div>

          <div className={`absolute bottom-16 left-4 ${isMobile ? 'right-16' : 'right-24'} pointer-events-auto`}>
            <div className="backdrop-blur-sm bg-black/10 rounded-xl p-3 space-y-2">
              <ReelCaption caption={reel.caption} />
              
              <ReelAudioInfo 
                audio={reel.audio} 
                audioType={reel.audio_type} 
                audioUrl={reel.audio_url} 
              />
              
              {reel.tags && reel.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {reel.tags.map((tag, index) => (
                    <span key={index} className="text-xs text-primary bg-primary/10 rounded-full px-2 py-0.5">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="absolute bottom-24 right-3 md:right-4 flex flex-col space-y-5 pointer-events-auto z-20">
            <button 
              onClick={openUnmuteThread}
              className="flex flex-col items-center"
            >
              <div className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md hover:bg-black/30 flex items-center justify-center transition-colors">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs text-white/90 mt-1">
                {commentCount > 0 ? commentCount : 'Unmute'}
              </span>
            </button>
            
            <button 
              onClick={handleRepostReel}
              className="flex flex-col items-center"
            >
              <div className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md hover:bg-black/30 flex items-center justify-center transition-colors">
                <Repeat className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs text-white/90 mt-1">Share</span>
            </button>
            
            <button 
              onClick={handleToggleSave}
              className="flex flex-col items-center"
            >
              <div className={`w-10 h-10 rounded-full ${saved ? 'bg-blue-500/50' : 'bg-black/20'} backdrop-blur-md hover:bg-black/30 flex items-center justify-center transition-colors`}>
                <Bookmark className="w-5 h-5 text-white" fill={saved ? "white" : "none"} />
              </div>
              <span className="text-xs text-white/90 mt-1">Save</span>
            </button>
          </div>

          <div className="absolute bottom-4 right-4 pointer-events-auto">
            <ReelMuteButton isMuted={isMuted} onToggleMute={toggleMute} />
          </div>
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
