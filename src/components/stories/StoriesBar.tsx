
import React, { useState } from 'react';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from "sonner";

interface StoryProps {
  id: string;
  avatarUrl: string;
  username: string;
  hasUnseenStory: boolean;
}

const StoriesBar = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  
  // Dummy stories data (replace with real data from API)
  const stories: StoryProps[] = [
    {
      id: '1',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
      username: 'Your story',
      hasUnseenStory: false,
    },
    {
      id: '2',
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=256&q=80',
      username: 'sarah',
      hasUnseenStory: true,
    },
    {
      id: '3',
      avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=256&q=80',
      username: 'alex',
      hasUnseenStory: true,
    },
    {
      id: '4',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
      username: 'michael',
      hasUnseenStory: false,
    },
    {
      id: '5',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80',
      username: 'jessica',
      hasUnseenStory: true,
    },
    {
      id: '6',
      avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=256&q=80',
      username: 'emily',
      hasUnseenStory: true,
    },
    {
      id: '7',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=256&q=80',
      username: 'david',
      hasUnseenStory: false,
    },
  ];

  const scrollLeft = () => {
    const newPosition = Math.max(0, scrollPosition - 200);
    setScrollPosition(newPosition);
    document.getElementById('stories-container')!.scrollTo({ left: newPosition, behavior: 'smooth' });
  };

  const scrollRight = () => {
    const container = document.getElementById('stories-container')!;
    const newPosition = Math.min(
      container.scrollWidth - container.clientWidth,
      scrollPosition + 200
    );
    setScrollPosition(newPosition);
    container.scrollTo({ left: newPosition, behavior: 'smooth' });
  };

  const handleStoryClick = (id: string, username: string) => {
    toast.info(`Viewing ${username}'s story`);
  };

  const handleCreateStory = () => {
    toast.info("Create story feature coming soon!");
  };

  return (
    <div className="relative bg-white rounded-xl p-3 shadow-sm">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute left-0 z-10 bg-white/80 rounded-full shadow-md hover:bg-white hidden sm:flex"
          onClick={scrollLeft}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div
          id="stories-container"
          className="flex gap-4 overflow-x-auto scrollbar-hide px-2 py-1"
          style={{ scrollBehavior: 'smooth' }}
        >
          {/* Create story button */}
          <div className="flex flex-col items-center">
            <Button 
              onClick={handleCreateStory}
              className="h-16 w-16 rounded-full border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center hover:border-primary hover:bg-gray-100"
            >
              <Plus className="h-6 w-6 text-gray-500" />
            </Button>
            <span className="text-xs mt-1 text-center">Add story</span>
          </div>

          {/* Stories */}
          {stories.map((story) => (
            <div key={story.id} className="flex flex-col items-center">
              <button
                onClick={() => handleStoryClick(story.id, story.username)}
                className={cn(
                  "h-16 w-16 rounded-full p-[2px]",
                  story.hasUnseenStory
                    ? "bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500"
                    : "border-2 border-gray-200"
                )}
              >
                <div className="h-full w-full rounded-full overflow-hidden border-2 border-white">
                  <img
                    src={story.avatarUrl}
                    alt={story.username}
                    className="h-full w-full object-cover"
                  />
                </div>
              </button>
              <span className="text-xs mt-1 text-center truncate max-w-[60px]">
                {story.username}
              </span>
            </div>
          ))}
        </div>

        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute right-0 z-10 bg-white/80 rounded-full shadow-md hover:bg-white hidden sm:flex"
          onClick={scrollRight}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default StoriesBar;
