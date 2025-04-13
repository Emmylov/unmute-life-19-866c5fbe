
import { supabase } from "./client";

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
}

// Function to fetch stories with profiles data
export const fetchStoriesWithProfiles = async (): Promise<Story[]> => {
  try {
    // First fetch stories
    const { data: storiesData, error: storiesError } = await (supabase
      .from('stories') as any)
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (storiesError) {
      console.error("Error fetching stories:", storiesError);
      throw storiesError;
    }
    
    if (!storiesData || storiesData.length === 0) return [];
    
    console.log("Fetched stories:", storiesData);
    
    // Get unique user IDs
    const userIds = [...new Set(storiesData.map((story: any) => story.user_id))] as string[];
    
    // Fetch profiles for those user IDs
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('id, username, full_name, avatar')
      .in('id', userIds);
    
    if (profilesError) {
      console.error("Error fetching profiles:", profilesError);
      return storiesData; // Return stories without profile data
    }
    
    // Merge profiles with stories
    const storiesWithProfiles = storiesData.map((story: any) => {
      const userProfile = profilesData?.find(profile => profile.id === story.user_id);
      return {
        ...story,
        profiles: userProfile || undefined
      };
    });
    
    return storiesWithProfiles;
  } catch (error) {
    console.error("Error in fetchStoriesWithProfiles:", error);
    return []; // Return empty array instead of throwing to prevent UI crashes
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
    console.log("Creating story with: ", { userId, mediaUrl, caption, mood, storagePath });
    
    // Validate required parameters
    if (!userId || !mediaUrl) {
      throw new Error("Missing required parameters: userId and mediaUrl must be provided");
    }
    
    // Check if the media URL contains identifiable media types
    const isVideo = mediaUrl.includes("video") || 
                   mediaUrl.match(/\.(mp4|webm|mov|mkv)$/i) !== null;
    
    const isAudio = mediaUrl.includes("audio") || 
                   mediaUrl.match(/\.(mp3|wav|ogg|m4a|aac)$/i) !== null ||
                   (!isVideo && mediaUrl.endsWith(".webm"));
                   
    console.log("Media type detection:", { isVideo, isAudio });
    
    const { data, error } = await (supabase
      .from('stories') as any)
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
      throw error;
    }
    
    console.log("Story created successfully with ID:", data.id);
    return data.id;
  } catch (error) {
    console.error("Error in createStory:", error);
    throw error;
  }
};
