
import React, { useState, useEffect } from "react";
import StoryItem from "./StoryItem";
import { PlusCircle } from "lucide-react";
import StoryModal from "./StoryModal";
import { toast } from "sonner";
import { fetchStoriesWithProfiles, Story } from "@/integrations/supabase/story-functions";
import { useAuth } from "@/contexts/AuthContext";

interface StoryFeedProps {
  profile: any;
}

const StoryFeed = ({ profile }: StoryFeedProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchStories = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedStories = await fetchStoriesWithProfiles();
      
      if (!fetchedStories || fetchedStories.length === 0) {
        console.log("No stories available or error fetching stories");
        // Instead of setting error, just set empty array
        setStories([]);
        return;
      }
      
      console.log("Successfully fetched stories:", fetchedStories.length);
      setStories(fetchedStories);
    } catch (error) {
      console.error("Error fetching stories:", error);
      setError("Could not load stories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  const handleOpenModal = () => {
    if (!user) {
      toast.error("Please log in to create a story");
      return;
    }
    setIsModalOpen(true);
  };

  return (
    <div className="overflow-x-auto py-2 -mx-2 px-2 scrollbar-hide">
      <div className="flex space-x-4">
        <div className="flex flex-col items-center cursor-pointer" onClick={handleOpenModal}>
          <div className="w-16 h-16 rounded-full bg-primary/10 p-[2px] shadow-md">
            <div className="w-full h-full rounded-full flex items-center justify-center bg-white dark:bg-gray-800">
              <PlusCircle className="h-7 w-7 text-primary" />
            </div>
          </div>
          <span className="text-xs mt-1 font-medium">New Story</span>
        </div>

        {loading ? (
          // Loading skeleton
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="animate-pulse flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700"></div>
              <div className="w-10 h-2 bg-gray-200 dark:bg-gray-700 rounded mt-1"></div>
            </div>
          ))
        ) : error ? (
          <div className="text-sm text-red-500 px-2">{error}</div>
        ) : stories.length > 0 ? (
          // Stories list
          stories.map((story) => (
            <StoryItem key={story.id} story={story} />
          ))
        ) : (
          // Empty state with placeholder stories
          <div className="flex flex-col items-center justify-center px-4 py-2">
            <span className="text-sm text-gray-500">No stories yet. Be the first to create one!</span>
          </div>
        )}
      </div>

      {profile ? (
        <StoryModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)}
          onSuccess={fetchStories}
          profile={profile}
        />
      ) : null}
    </div>
  );
};

export default StoryFeed;
