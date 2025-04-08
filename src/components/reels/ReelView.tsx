
import React, { useState, useEffect } from "react";
import { motion, useAnimation, PanInfo } from "framer-motion";
import { Heart } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";
import EmojiReactions from "./EmojiReactions";
import ReelVideo from "./controls/ReelVideo";
import ReelUserInfo from "./controls/ReelUserInfo";
import ReelActions from "./controls/ReelActions";
import ReelCaption from "./controls/ReelCaption";
import ReelAudioInfo from "./controls/ReelAudioInfo";
import ReelNavigation from "./controls/ReelNavigation";
import ReelMuteButton from "./controls/ReelMuteButton";

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
  const controls = useAnimation();
  const { reel, user } = reelWithUser;

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleLike = async () => {
    setLiked(!liked);
    controls.start({
      scale: [1, 1.2, 1],
      opacity: [1, 1, 0],
      transition: { duration: 0.8 }
    });
  };

  const toggleSave = () => {
    setSaved(!saved);
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
        
        <ReelActions 
          reelId={reel.id} 
          liked={liked} 
          saved={saved} 
          onLike={toggleLike} 
          onSave={toggleSave} 
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
