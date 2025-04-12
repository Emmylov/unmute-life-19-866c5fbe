
import { supabase } from "@/integrations/supabase/client";
import { fetchTrendingFeed, fetchFollowingFeed } from "./feed-fetchers";

export async function fetchSupplementalPosts(userId: string, limit: number, offset: number): Promise<any[]> {
  try {
    const [trendingPosts, followingPosts] = await Promise.all([
      fetchTrendingFeed(Math.ceil(limit / 2), offset),
      fetchFollowingFeed(userId, Math.ceil(limit / 2), offset)
    ]);
    
    const combined = [...trendingPosts, ...followingPosts];
    const uniquePosts = Array.from(
      new Map(combined.map(post => [post.id, post])).values()
    );
    
    return uniquePosts.slice(0, limit);
  } catch (error) {
    console.error("Error fetching supplemental posts:", error);
    return [];
  }
}
