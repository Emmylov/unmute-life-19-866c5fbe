
import { supabase } from "@/integrations/supabase/client";
import { createSafeProfile } from "@/utils/safe-data-utils";
import { FeedPost } from "@/services/post-service";

// Main function to be exported with the name used in index.ts
export async function fetchCollabsFeedPosts(limit: number = 10, offset: number = 0): Promise<FeedPost[]> {
  try {
    // This is a placeholder implementation - in a real app, you would fetch actual collab posts
    // Return an empty array for now since we don't have a specific collabs table
    return [];
  } catch (error) {
    console.error('Error fetching collabs feed posts:', error);
    return [];
  }
}

// Export with both function names for compatibility
export const fetchCollabsFeed = fetchCollabsFeedPosts;
