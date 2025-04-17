
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { PlusCircle } from 'lucide-react';

const StoriesBar = () => {
  const { user } = useAuth();
  
  // Placeholder stories for demonstration
  const stories = [
    {
      id: '1',
      username: 'your_story',
      avatar: null,
      isYourStory: true,
      hasSeen: false
    },
    {
      id: '2',
      username: 'mindful_user',
      avatar: null,
      hasSeen: false
    },
    {
      id: '3',
      username: 'wellness_journey',
      avatar: null,
      hasSeen: true
    },
    {
      id: '4',
      username: 'peaceful_mind',
      avatar: null,
      hasSeen: false
    },
    {
      id: '5',
      username: 'calm_spirit',
      avatar: null,
      hasSeen: true
    }
  ];

  return (
    <div className="flex overflow-x-auto gap-4 py-3 scrollbar-hide">
      {stories.map(story => (
        <div key={story.id} className="flex flex-col items-center flex-shrink-0">
          <div className={`w-16 h-16 rounded-full p-[2px] ${story.hasSeen ? 'bg-gray-200' : 'bg-gradient-to-r from-unmute-purple to-unmute-pink'}`}>
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
              {story.isYourStory ? (
                <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center">
                  <PlusCircle className="h-7 w-7 text-primary" />
                </div>
              ) : story.avatar ? (
                <img src={story.avatar} alt={story.username} className="w-full h-full rounded-full object-cover" />
              ) : (
                <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-semibold">
                  {story.username[0].toUpperCase()}
                </div>
              )}
            </div>
          </div>
          <span className="text-xs mt-1 font-medium truncate w-16 text-center">
            {story.isYourStory ? 'Your Story' : story.username}
          </span>
        </div>
      ))}
    </div>
  );
};

export default StoriesBar;
