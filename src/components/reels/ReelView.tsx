
import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Heart, MessageCircle, Repeat, Bookmark, 
  Volume2, VolumeX, Play, Pause, ChevronUp, ChevronDown
} from "lucide-react";
import { motion, useAnimation, PanInfo } from "framer-motion";
import { Tables } from "@/integrations/supabase/types";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getInitials } from "@/lib/utils";
import EmojiReactions from "./EmojiReactions";

interface ReelWithUser {
  reel: Tables<"reels">;
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
  const [showFullCaption, setShowFullCaption] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const controls = useAnimation();

  const { reel, user } = reelWithUser;
  const caption = reel.caption || "";
  const hashtags = caption.match(/#[\w]+/g) || [];

  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch(error => {
          console.error("Error playing video:", error);
        });
      } else {
        videoRef.current.pause();
      }
      
      // Handle mute state
      videoRef.current.muted = isMuted;
    }
  }, [isPlaying, videoRef, isMuted, currentIndex]);

  // Reset play state when reel changes
  useEffect(() => {
    setIsPlaying(true);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(error => {
        console.error("Error auto-playing video:", error);
      });
    }
  }, [currentIndex]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleLike = async () => {
    setLiked(!liked);
    // Show heart animation
    controls.start({
      scale: [1, 1.2, 1],
      opacity: [1, 1, 0],
      transition: { duration: 0.8 }
    });
    
    // Here you would also update the like in Supabase
  };

  const toggleSave = () => {
    setSaved(!saved);
    // Here you would also update the save in Supabase
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
      {/* Video */}
      <div className="absolute inset-0 flex items-center justify-center">
        <video 
          ref={videoRef}
          src={reel.video_url}
          className="w-full h-full object-cover"
          playsInline
          loop
          onClick={togglePlay}
          poster={reel.thumbnail_url || undefined}
        />
      </div>

      {/* Play/Pause overlay */}
      {!isPlaying && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 flex items-center justify-center bg-black/30"
        >
          <Play className="w-16 h-16 text-white opacity-80" />
        </motion.div>
      )}

      {/* Floating heart animation */}
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        animate={controls}
        initial={{ opacity: 0, scale: 1 }}
      >
        <Heart className="w-20 h-20 text-primary filter drop-shadow-lg" fill={liked ? "#ec4899" : "none"} />
      </motion.div>

      {/* Navigation indicators */}
      {hasNext && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-white"
          whileHover={{ y: -4, opacity: 1 }}
        >
          <ChevronUp className="w-6 h-6 animate-bounce" />
        </motion.div>
      )}
      
      {hasPrevious && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          className="absolute top-6 left-1/2 transform -translate-x-1/2 text-white"
          whileHover={{ y: 4, opacity: 1 }}
        >
          <ChevronDown className="w-6 h-6 animate-bounce" />
        </motion.div>
      )}

      {/* Overlay UI */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top info */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center pointer-events-auto z-10">
          <Link to={`/profile/${user?.username || user?.id}`} className="flex items-center space-x-2">
            <Avatar className="h-10 w-10 border-2 border-white">
              <AvatarImage src={user?.avatar || ""} alt={user?.username || "User"} />
              <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                {getInitials(user?.full_name || user?.username || "U")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h4 className="text-white font-medium text-sm">
                {user?.full_name || user?.username || "User"}
              </h4>
              <p className="text-white/80 text-xs">@{user?.username || "username"}</p>
            </div>
          </Link>
          
          <Button size="sm" variant="secondary" className="rounded-full text-xs h-8 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white">
            Follow
          </Button>
        </div>
        
        {/* Side actions */}
        <div className="absolute bottom-20 right-4 flex flex-col space-y-6 pointer-events-auto">
          <motion.button 
            whileHover={{ scale: 1.1 }} 
            whileTap={{ scale: 0.95 }}
            className="flex flex-col items-center"
            onClick={toggleLike}
          >
            <div className="w-12 h-12 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center">
              <Heart className={`w-6 h-6 ${liked ? "text-pink-500 fill-pink-500" : "text-white"}`} />
            </div>
            <span className="text-white text-xs mt-1 font-medium">
              {liked ? "Liked" : "Like"}
            </span>
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.1 }} 
            whileTap={{ scale: 0.95 }}
            className="flex flex-col items-center"
          >
            <div className="w-12 h-12 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <span className="text-white text-xs mt-1">Comment</span>
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.1 }} 
            whileTap={{ scale: 0.95 }}
            className="flex flex-col items-center"
          >
            <div className="w-12 h-12 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center">
              <Repeat className="w-6 h-6 text-white" />
            </div>
            <span className="text-white text-xs mt-1">Repost</span>
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.1 }} 
            whileTap={{ scale: 0.95 }}
            className="flex flex-col items-center"
            onClick={toggleSave}
          >
            <div className="w-12 h-12 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center">
              <Bookmark className={`w-6 h-6 ${saved ? "text-blue-400 fill-blue-400" : "text-white"}`} />
            </div>
            <span className="text-white text-xs mt-1">
              {saved ? "Saved" : "Save"}
            </span>
          </motion.button>
        </div>

        {/* Bottom info */}
        <div className="absolute bottom-6 left-4 right-24 pointer-events-auto">
          {/* Caption */}
          {caption && (
            <div className="mb-3">
              <p className="text-white text-sm">
                {showFullCaption ? caption : caption.length > 100 ? `${caption.substring(0, 100)}...` : caption}
                {caption.length > 100 && (
                  <button 
                    className="text-white/80 ml-1 font-medium"
                    onClick={() => setShowFullCaption(!showFullCaption)}
                  >
                    {showFullCaption ? "See less" : "See more"}
                  </button>
                )}
              </p>
            </div>
          )}
          
          {/* Hashtags */}
          {hashtags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {hashtags.map((tag, index) => (
                <Link 
                  key={index} 
                  to={`/explore?tag=${tag.substring(1)}`}
                  className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full text-xs text-white hover:bg-white/30 transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>
          )}
          
          {/* Audio info */}
          {reel.audio && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <motion.div 
                  animate={{ rotate: isPlaying ? 360 : 0 }} 
                  transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                  className="w-4 h-4 rounded-full bg-gradient-to-br from-pink-500 to-purple-600"
                />
              </div>
              <div className="text-white/90 text-sm font-medium">
                {reel.audio}
              </div>
            </div>
          )}
        </div>

        {/* Emoji reactions */}
        <div className="absolute bottom-28 left-4 pointer-events-auto">
          <EmojiReactions reelId={reel.id} />
        </div>

        {/* Mute button */}
        <button 
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center pointer-events-auto"
          onClick={toggleMute}
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4 text-white" />
          ) : (
            <Volume2 className="w-4 h-4 text-white" />
          )}
        </button>
      </div>
    </motion.div>
  );
};

export default ReelView;
