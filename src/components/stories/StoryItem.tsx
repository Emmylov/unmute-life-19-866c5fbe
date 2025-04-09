
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { formatDistanceToNow } from "date-fns";
import { Play, Pause, Heart } from "lucide-react";

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
  
  const isAudio = story.media_url?.includes("audio") || !story.media_url?.includes("video");
  const profile = story.profiles;
  const displayName = profile?.full_name || profile?.username || "User";
  
  const handlePlayPause = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlaying(!isPlaying);
  };
  
  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLiked(!liked);
  };
  
  const toggleDialog = () => {
    setIsDialogOpen(!isDialogOpen);
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
              {isAudio ? (
                <div className="w-full h-full flex flex-col items-center justify-center">
                  <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                    <Button
                      className="h-16 w-16 rounded-full"
                      onClick={() => setIsPlaying(!isPlaying)}
                    >
                      {isPlaying ? (
                        <Pause className="h-8 w-8" />
                      ) : (
                        <Play className="h-8 w-8" />
                      )}
                    </Button>
                  </div>
                  
                  <audio
                    src={story.media_url}
                    className="hidden"
                    controls
                    autoPlay={isPlaying}
                    onEnded={() => setIsPlaying(false)}
                  />
                  
                  {story.caption && (
                    <p className="text-center mt-8 max-w-xs px-4">{story.caption}</p>
                  )}
                </div>
              ) : (
                <div className="w-full h-full relative">
                  <video 
                    src={story.media_url}
                    className="w-full h-full object-contain"
                    controls
                    autoPlay={isPlaying}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onEnded={() => setIsPlaying(false)}
                  />
                  
                  {story.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      <p className="text-white text-center">{story.caption}</p>
                    </div>
                  )}
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
