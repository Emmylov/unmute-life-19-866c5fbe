
import React, { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { format } from "date-fns";
import { Heart, ThumbsUp, X, Star, StarOff, Smile } from "lucide-react";

interface Profile {
  id: string;
  username: string;
  avatar: string;
  full_name?: string;
}

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
}

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  profile: Profile;
}

const MessageBubble = ({ message, isOwn, profile }: MessageBubbleProps) => {
  const [showReactions, setShowReactions] = useState(false);
  const [starred, setStarred] = useState(false);
  const [reaction, setReaction] = useState<string | null>(null);
  
  const toggleStar = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setStarred(!starred);
  };
  
  const addReaction = (emoji: string) => {
    setReaction(emoji);
    setShowReactions(false);
  };

  const messageTime = message.created_at 
    ? format(new Date(message.created_at), 'h:mm a')
    : '';

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4 group relative`}>
      {/* Message container */}
      <div className={`max-w-[70%] flex ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        {!isOwn && (
          <Avatar className="h-8 w-8 mr-2 mt-1">
            <AvatarImage src={profile?.avatar} />
            <AvatarFallback className="bg-unmute-blue text-white">
              {profile?.username?.charAt(0).toUpperCase() || "?"}
            </AvatarFallback>
          </Avatar>
        )}
        
        {/* Message content */}
        <div>
          <div 
            className={`py-2 px-4 rounded-2xl shadow-sm ${
              isOwn
                ? 'bg-gradient-to-r from-unmute-purple to-unmute-purple/90 text-white'
                : 'bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700'
            }`}
          >
            <p className="text-sm">{message.content}</p>
          </div>
          
          {/* Time and reactions row */}
          <div className={`flex items-center mt-1 text-xs text-gray-500 ${isOwn ? 'justify-end' : 'justify-start'}`}>
            <span>{messageTime}</span>
            
            {reaction && (
              <div className="ml-2 flex items-center">
                <span className="text-base">{reaction}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Star button - visible on hover */}
      <button 
        className={`opacity-0 group-hover:opacity-100 transition-opacity absolute ${isOwn ? 'left-0 -ml-8' : 'right-0 -mr-8'} top-2`}
        onClick={toggleStar}
      >
        {starred ? <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" /> : <StarOff className="h-4 w-4 text-gray-400" />}
      </button>
      
      {/* Reaction button */}
      <div className={`absolute ${isOwn ? 'left-0 -ml-10' : 'right-0 -mr-10'} bottom-8`}>
        {showReactions ? (
          <div className="flex items-center bg-white dark:bg-gray-800 rounded-full shadow-lg p-1 animate-fade-in">
            <button onClick={() => setShowReactions(false)} className="p-1">
              <X className="h-3 w-3" />
            </button>
            <button onClick={() => addReaction("❤️")} className="p-1 text-lg">❤️</button>
            <button onClick={() => addReaction("😂")} className="p-1 text-lg">😂</button>
            <button onClick={() => addReaction("👍")} className="p-1 text-lg">👍</button>
            <button onClick={() => addReaction("🔥")} className="p-1 text-lg">🔥</button>
          </div>
        ) : (
          <button 
            className="opacity-0 group-hover:opacity-100 transition-opacity bg-white dark:bg-gray-800 rounded-full shadow p-1.5"
            onClick={() => setShowReactions(true)}
          >
            <Smile className="h-3 w-3 text-gray-500" />
          </button>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
