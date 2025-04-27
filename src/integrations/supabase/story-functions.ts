
import { supabase } from "./client";
import { toast } from "sonner";

// Type definitions
export interface Story {
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
  viewed?: boolean;
}

// Function to fetch stories with profiles data
export const fetchStoriesWithProfiles = async (): Promise<Story[]> => {
  try {
    console.log("Fetching stories with profiles...");
    
    // First fetch stories
    const { data: storiesData, error: storiesError } = await supabase
      .from('stories')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);
    
    if (storiesError) {
      console.error("Error fetching stories:", storiesError);
      return [];
    }
    
    if (!storiesData || storiesData.length === 0) {
      console.log("No stories found");
      return [];
    }
    
    console.log("Fetched stories:", storiesData.length);
    
    // Get unique user IDs
    const userIds = [...new Set(storiesData.map((story: any) => story.user_id))] as string[];
    
    if (userIds.length === 0) {
      console.log("No user IDs found in stories");
      return storiesData;
    }
    
    try {
      // Fetch profiles for those user IDs
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username, full_name, avatar')
        .in('id', userIds);
      
      if (profilesError) {
        console.error("Error fetching profiles:", profilesError);
        // Still return stories without profile data
        return storiesData;
      }
      
      if (!profilesData || profilesData.length === 0) {
        console.log("No profiles found for user IDs");
        return storiesData;
      }
      
      console.log("Fetched profiles:", profilesData.length);
      
      // Merge profiles with stories
      const storiesWithProfiles = storiesData.map((story: any) => {
        const userProfile = profilesData.find(profile => profile.id === story.user_id);
        return {
          ...story,
          profiles: userProfile || undefined
        };
      });
      
      return storiesWithProfiles;
    } catch (profileError) {
      console.error("Error processing profiles for stories:", profileError);
      // Return stories without profile data if profile fetch fails
      return storiesData;
    }
  } catch (error) {
    console.error("Error in fetchStoriesWithProfiles:", error);
    // Return empty array instead of throwing to prevent UI crashes
    return [];
  }
};

// Function to create a new story
export const createStory = async (
  userId: string,
  mediaUrl: string,
  caption?: string | null,
  mood?: string | null,
  storagePath?: string | null
): Promise<string> => {
  try {
    if (!userId || !mediaUrl) {
      const errorMsg = "Missing required parameters: userId and mediaUrl must be provided";
      toast.error(errorMsg);
      throw new Error(errorMsg);
    }
    
    // Check if the media URL contains identifiable media types
    const isVideo = mediaUrl.includes("video") || 
                   mediaUrl.match(/\.(mp4|webm|mov|mkv)$/i) !== null;
    
    const isAudio = mediaUrl.includes("audio") || 
                   mediaUrl.match(/\.(mp3|wav|ogg|m4a|aac)$/i) !== null ||
                   (!isVideo && mediaUrl.endsWith(".webm"));
    
    const { data, error } = await supabase
      .from('stories')
      .insert({
        user_id: userId,
        media_url: mediaUrl,
        caption: caption || null,
        mood: mood || null,
        storage_path: storagePath || null
      })
      .select('id')
      .single();
    
    if (error) {
      console.error("Error creating story:", error);
      toast.error(`Failed to create story: ${error.message}`);
      throw error;
    }
    
    toast.success("Your story has been posted!");
    return data.id;
  } catch (error) {
    console.error("Error in createStory:", error);
    toast.error("Failed to create your story. Please try again.");
    throw error;
  }
};

// Function to view a story
export const viewStory = async (storyId: string, userId: string): Promise<boolean> => {
  try {
    if (!storyId || !userId) {
      console.error("Missing storyId or userId in viewStory");
      return false;
    }
    
    // Insert a record into story_views table if you have one
    // This is commented out since we don't have this table yet
    // You can uncomment and implement this when you create the story_views table
    /*
    const { error } = await supabase
      .from('story_views')
      .insert({
        story_id: storyId,
        user_id: userId,
        viewed_at: new Date().toISOString()
      });
    
    if (error) {
      console.error("Error recording story view:", error);
      return false;
    }
    */
    
    // For now, just log the view
    console.log(`User ${userId} viewed story ${storyId}`);
    
    return true;
  } catch (error) {
    console.error("Error viewing story:", error);
    return false;
  }
};

// Function to check if a user has viewed a story
export const hasViewedStory = async (storyId: string, userId: string): Promise<boolean> => {
  try {
    // This is a placeholder for checking if a user has viewed a story
    // You would implement proper logic based on your database schema
    
    // For demonstration purposes, always return false to show unviewed stories
    return false;
  } catch (error) {
    console.error("Error checking story view status:", error);
    return false;
  }
};
