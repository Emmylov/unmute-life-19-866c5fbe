
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Story } from '@/integrations/supabase/story-functions';
import { getInitials } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

interface StoryItemProps {
  story: Story;
}

const StoryItem = ({ story }: StoryItemProps) => {
  const { user } = useAuth();
  
  // Determine if this is the current user's story
  const isCurrentUser = user?.id === story.user_id;
  
  // Get profile info with proper fallback handling
  const username = isCurrentUser 
    ? 'Your story'
    : story.profiles?.username || 'User';
  
  const avatarUrl = story.profiles?.avatar || '';
  const initials = getInitials(story.profiles?.full_name || username);
  
  // Determine if story has been seen (implement this logic with your storage mechanism)
  const hasUnseenStory = true; // This would be dynamic based on your seen/unseen tracking

  const handleClick = () => {
    // Implement story viewing logic here
    console.log('View story:', story.id);
    // You'd typically open a modal or navigate to a story view component
  };

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={handleClick}
        className={`w-16 h-16 rounded-full p-[2px] ${hasUnseenStory 
          ? "bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500" 
          : "border-2 border-gray-200"}`}
      >
        <div className="w-full h-full rounded-full overflow-hidden border-2 border-white">
          <Avatar className="w-full h-full">
            <AvatarImage src={avatarUrl} alt={username} />
            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
              {initials}
            </AvatarFallback>
          </Avatar>
        </div>
      </button>
      <span className="text-xs mt-1 truncate w-16 text-center font-medium">
        {username}
      </span>
    </div>
  );
};

export default StoryItem;
