
import { supabase } from "@/integrations/supabase/client";

// Define proper type for posts
export interface Post {
  id: string;
  created_at: string;
  createdAt?: string; // Allow both formats for compatibility
  type?: 'image' | 'text' | 'reel' | 'collab';
  userId?: string; // Allow both user_id and userId
  user_id?: string;
  // Additional optional properties for all post types
  [key: string]: any;
}

// This function is kept for backward compatibility but now delegates to the specialized modules
export async function fetchSupplementalPosts(
  userId: string, 
  limit: number, 
  offset: number,
  trendingFeedFetcher?: (limit: number, offset: number) => Promise<Post[]>,
  followingFeedFetcher?: (userId: string, limit: number, offset: number) => Promise<Post[]>
): Promise<Post[]> {
  try {
    // Import the functions dynamically if not provided
    if (!trendingFeedFetcher || !followingFeedFetcher) {
      const feedFetchers = await import('./feed-fetchers');
      trendingFeedFetcher = feedFetchers.fetchTrendingFeed;
      followingFeedFetcher = feedFetchers.fetchFollowingFeed;
    }
    
    const [trendingPosts, followingPosts] = await Promise.all([
      trendingFeedFetcher(Math.ceil(limit / 2), offset),
      followingFeedFetcher(userId, Math.ceil(limit / 2), offset)
    ]);
    
    const combined: Post[] = [...trendingPosts, ...followingPosts];
    const uniquePosts = Array.from(
      new Map(combined.map(post => [post.id, post])).values()
    );
    
    return uniquePosts.slice(0, limit);
  } catch (error) {
    console.error("Error fetching supplemental posts:", error);
    return [];
  }
}
