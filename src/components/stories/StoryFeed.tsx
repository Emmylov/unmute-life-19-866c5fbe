
import React, { useState, useEffect } from "react";
import StoryItem from "./StoryItem";
import { PlusCircle } from "lucide-react";
import StoryModal from "./StoryModal";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface StoryFeedProps {
  profile: any;
}

// Define the Story type to match our database schema
interface Story {
  id: string;
  user_id: string;
  media_url: string;
  caption?: string;
  mood?: string;
  created_at: string;
  storage_path?: string;
  profiles?: {
    id: string;
    username?: string;
    full_name?: string;
    avatar?: string;
  };
}

const StoryFeed = ({ profile }: StoryFeedProps) => {
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStories = async () => {
    try {
      setLoading(true);
      // Use 'from' with type assertion to work around TypeScript limitations
      const { data, error } = await (supabase
        .from('stories') as any)
        .select(`
          *,
          profiles:user_id (id, username, full_name, avatar)
        `)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setStories(data || []);
    } catch (error) {
      console.error("Error fetching stories:", error);
      toast({
        title: "Error",
        description: "Could not load stories. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  return (
    <div className="overflow-x-auto py-2 -mx-2 px-2 scrollbar-hide">
      <div className="flex space-x-4">
        <div className="flex flex-col items-center cursor-pointer" onClick={() => setIsModalOpen(true)}>
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
        ) : stories.length > 0 ? (
          // Stories list
          stories.map((story) => (
            <StoryItem key={story.id} story={story} />
          ))
        ) : (
          // Empty state with placeholder stories
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center opacity-60">
              <div className="w-16 h-16 rounded-full bg-dream-mist p-[2px] flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-400/50">
                </div>
              </div>
              <span className="text-xs mt-1 truncate w-16 text-center font-medium text-gray-400">
                {i === 0 ? "First" : i === 1 ? "Add" : i === 2 ? "Your" : i === 3 ? "Own" : "Story"}
              </span>
            </div>
          ))
        )}
      </div>

      {profile ? (
        <StoryModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)}
          onSuccess={fetchStories}
          profile={profile}
        />
      ) : isModalOpen && (
        <>
          {toast({
            title: "Login Required",
            description: "Please log in to create a story",
            variant: "destructive"
          })}
          {setIsModalOpen(false)}
        </>
      )}
    </div>
  );
};

export default StoryFeed;
