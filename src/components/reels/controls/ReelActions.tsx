
import React from "react";
import { Heart, MessageCircle, Repeat, Bookmark } from "lucide-react";
import ReelActionButton from "./ReelActionButton";
import { useAnimation } from "framer-motion";

interface ReelActionsProps {
  reelId: string;
  liked: boolean;
  saved: boolean;
  onLike: () => void;
  onSave: () => void;
  onComment: () => void;
}

const ReelActions = ({ reelId, liked, saved, onLike, onSave, onComment }: ReelActionsProps) => {
  return (
    <div className="absolute bottom-20 right-4 flex flex-col space-y-6 pointer-events-auto">
      <ReelActionButton 
        icon={Heart} 
        label={liked ? "Liked" : "Like"}
        isActive={liked}
        activeColor="text-pink-500 fill-pink-500"
        onClick={onLike}
      />
      
      <ReelActionButton 
        icon={MessageCircle} 
        label="Comment"
        onClick={onComment}
      />
      
      <ReelActionButton 
        icon={Repeat} 
        label="Repost"
      />
      
      <ReelActionButton 
        icon={Bookmark} 
        label={saved ? "Saved" : "Save"}
        isActive={saved}
        activeColor="text-blue-400 fill-blue-400"
        onClick={onSave}
      />
    </div>
  );
};

export default ReelActions;
