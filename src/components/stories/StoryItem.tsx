
import React, { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { formatDistanceToNow } from "date-fns";
import { Play, Pause, Heart, Volume2, VolumeX } from "lucide-react";

interface StoryItemProps {
  story: {
    id: string;
    media_url: string;
    caption?: string;
    mood?: string;
    created_at: string;
    profiles?: {
      id: string;
      username?: string;
      full_name?: string;
      avatar?: string;
    };
  };
  onClick?: () => void;
}

const StoryItem = ({ story, onClick }: StoryItemProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [liked, setLiked] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  
  // Determine the media type based on the URL or file extension
  const isAudio = story.media_url?.includes("audio") || 
                 (story.media_url?.match(/\.(mp3|wav|ogg|m4a|aac)$/i) !== null);
  const isVideo = story.media_url?.includes("video") || 
                 (story.media_url?.match(/\.(mp4|webm|mov|mkv)$/i) !== null);
                 
  const mediaType = isAudio ? "audio" : isVideo ? "video" : "unknown";
  
  const profile = story.profiles;
  const displayName = profile?.full_name || profile?.username || "User";
  
  useEffect(() => {
    // Reset play state when dialog closes
    if (!isDialogOpen) {
      setIsPlaying(false);
      if (audioRef.current) audioRef.current.pause();
      if (videoRef.current) videoRef.current.pause();
    }
  }, [isDialogOpen]);
  
  const handlePlayPause = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlaying(!isPlaying);
    
    if (isDialogOpen) {
      if (mediaType === "audio" && audioRef.current) {
        if (isPlaying) {
          audioRef.current.pause();
        } else {
          audioRef.current.play().catch(err => console.error("Error playing audio:", err));
        }
      } else if (mediaType === "video" && videoRef.current) {
        if (isPlaying) {
          videoRef.current.pause();
        } else {
          videoRef.current.play().catch(err => console.error("Error playing video:", err));
        }
      }
    }
  };
  
  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLiked(!liked);
  };
  
  const toggleDialog = () => {
    setIsDialogOpen(!isDialogOpen);
  };
  
  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
  };
  
  return (
    <>
      <div 
        onClick={onClick || toggleDialog}
        className="cursor-pointer"
      >
        <div className="w-16 h-16 rounded-full border-2 border-primary p-[2px] relative mx-auto">
          <Avatar className="w-full h-full">
            <AvatarImage src={profile?.avatar || ''} />
            <AvatarFallback className="bg-gray-200 text-gray-600">
              {displayName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <Button 
            variant="default"
            size="sm" 
            className="absolute bottom-0 right-0 h-6 w-6 rounded-full p-0 shadow-md"
            onClick={handlePlayPause}
          >
            {isPlaying ? (
              <Pause className="h-3 w-3" />
            ) : (
              <Play className="h-3 w-3" />
            )}
          </Button>
        </div>
        
        <span className="text-xs mt-1 block text-center truncate w-16">
          {displayName.split(' ')[0]}
        </span>
        
        {story.mood && (
          <span className="text-lg block text-center leading-none">{story.mood}</span>
        )}
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md p-0 overflow-hidden">
          <DialogTitle className="sr-only">Story</DialogTitle>
          <div className="flex flex-col h-[60vh]">
            <div className="p-4 border-b">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={profile?.avatar || ''} />
                  <AvatarFallback className="bg-gray-200 text-gray-600">
                    {displayName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div>
                  <h4 className="font-medium">{displayName}</h4>
                  <p className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(story.created_at), { addSuffix: true })}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex-grow flex items-center justify-center bg-gray-100 dark:bg-gray-900">
              {mediaType === "audio" ? (
                <div className="w-full h-full flex flex-col items-center justify-center">
                  <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                    <Button
                      className="h-16 w-16 rounded-full"
                      onClick={() => {
                        setIsPlaying(!isPlaying);
                        if (audioRef.current) {
                          if (isPlaying) {
                            audioRef.current.pause();
                          } else {
                            audioRef.current.play().catch(err => console.error("Error playing audio:", err));
                          }
                        }
                      }}
                    >
                      {isPlaying ? (
                        <Pause className="h-8 w-8" />
                      ) : (
                        <Play className="h-8 w-8" />
                      )}
                    </Button>
                  </div>
                  
                  <audio
                    ref={audioRef}
                    src={story.media_url}
                    className="hidden"
                    controls
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onEnded={() => setIsPlaying(false)}
                  />
                  
                  {story.caption && (
                    <p className="text-center mt-8 max-w-xs px-4">{story.caption}</p>
                  )}
                </div>
              ) : mediaType === "video" ? (
                <div className="w-full h-full relative">
                  <video 
                    ref={videoRef}
                    src={story.media_url}
                    className="w-full h-full object-contain"
                    playsInline
                    muted={isMuted}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onEnded={() => setIsPlaying(false)}
                    onClick={handlePlayPause}
                  />
                  
                  <div className="absolute top-4 right-4 space-x-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="opacity-70 hover:opacity-100"
                      onClick={toggleMute}
                    >
                      {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    </Button>
                    
                    <Button 
                      variant="secondary"
                      size="sm"
                      className="opacity-70 hover:opacity-100"
                      onClick={handlePlayPause}
                    >
                      {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                  </div>
                  
                  {story.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      <p className="text-white text-center">{story.caption}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-4">
                  <p className="text-gray-500">Media type not supported</p>
                </div>
              )}
            </div>
            
            <div className="p-4 border-t">
              <div className="flex justify-between items-center">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleLike}
                  className={liked ? "text-red-500" : ""}
                >
                  <Heart className="h-5 w-5 mr-1" fill={liked ? "currentColor" : "none"} />
                  Like
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default StoryItem;
