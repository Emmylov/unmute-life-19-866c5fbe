
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Story } from '@/integrations/supabase/story-functions';
import { getInitials } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import StoryViewerModal from './StoryViewerModal';

interface StoryItemProps {
  story: Story;
  onView?: () => void;
  onNavigateNext?: () => void;
  onNavigatePrevious?: () => void;
  hasNext?: boolean;
  hasPrevious?: boolean;
}

const StoryItem = ({ 
  story,
  onView,
  onNavigateNext,
  onNavigatePrevious,
  hasNext = false,
  hasPrevious = false
}: StoryItemProps) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
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
    try {
      setIsLoading(true);
      
      if (!story.media_url) {
        toast.error("Story media not available");
        return;
      }
      
      // Call the onView callback if provided
      onView?.();
      
      // Open the story viewer modal
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error viewing story:', error);
      toast.error("Unable to view story");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="flex flex-col items-center">
        <button
          onClick={handleClick}
          disabled={isLoading}
          className={`w-16 h-16 rounded-full p-[2px] relative ${hasUnseenStory 
            ? "bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500" 
            : "border-2 border-gray-200"}`}
        >
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full z-10">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          <div className="w-full h-full rounded-full overflow-hidden border-2 border-white bg-gray-100 dark:bg-gray-800">
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

      {/* Story Viewer Modal */}
      <StoryViewerModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        story={story}
        onNext={onNavigateNext}
        onPrevious={onNavigatePrevious}
        hasNext={hasNext}
        hasPrevious={hasPrevious}
      />
    </>
  );
};

export default StoryItem;
