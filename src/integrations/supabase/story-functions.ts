
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
    
    if (storiesError) throw storiesError;
    if (!storiesData || storiesData.length === 0) return [];
    
    // Get unique user IDs
    const userIds = [...new Set(storiesData.map((story: any) => story.user_id))];
    
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
    throw error;
  }
};

// Function to create a new story
export const createStory = async (
  userId: string,
  mediaUrl: string,
  caption?: string,
  mood?: string,
  storagePath?: string
): Promise<string> => {
  try {
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
    
    if (error) throw error;
    return data.id;
  } catch (error) {
    console.error("Error in createStory:", error);
    throw error;
  }
};
