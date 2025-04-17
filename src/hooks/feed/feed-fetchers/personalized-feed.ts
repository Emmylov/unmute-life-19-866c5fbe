import { supabase } from "@/integrations/supabase/client";
import { Post } from "../feed-utils";
import { fetchFollowingFeed } from "./following-feed";
import { fetchTrendingFeed } from "./trending-feed";

/**
 * Fetches a personalized feed for a user that includes:
 * 1. Posts from followed users
 * 2. Trending posts related to user interests
 * 3. Some discovery posts from outside user's network
 */
export const fetchPersonalizedFeed = async (
  userId: string,
  interests?: string[],
  limitCount: number = 10,
  offsetCount: number = 0
): Promise<Post[]> => {
  try {
    // Try to fetch from both regular posts and posts_text tables
    const { data: postsData, error: postsError } = await supabase
      .from('posts')
      .select('*, profiles(*)')
      .order('created_at', { ascending: false })
      .limit(limitCount);
      
    if (postsError) {
      console.error("Error fetching posts:", postsError);
    }
    
    const { data: postsTextData, error: postsTextError } = await supabase
      .from('posts_text')
      .select('*, profiles(*)')
      .order('created_at', { ascending: false })
      .limit(limitCount);
      
    if (postsTextError) {
      console.error("Error fetching posts_text:", postsTextError);
    }
      
    // If we have posts from any source, return them
    const combinedPosts = [
      ...(postsData || []), 
      ...(postsTextData || [])
    ].sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    ).slice(0, limitCount);
    
    if (combinedPosts.length > 0) {
      return combinedPosts as Post[];
    }
    
    // Fall back to following and trending feeds if no direct posts found
    try {
      // Try to get posts from people you follow
      const followingPosts = await fetchFollowingFeed(userId, limitCount, offsetCount);
      
      if (followingPosts.length > 0) {
        return followingPosts;
      }
    } catch (followError) {
      console.error("Error in following feed:", followError);
    }

    try {
      // Fall back to trending posts
      const trendingPosts = await fetchTrendingFeed(limitCount, offsetCount);
      return trendingPosts;
    } catch (trendError) {
      console.error("Error in trending feed fallback:", trendError);
    }

    // If all else fails, return an empty array
    return [];
    
  } catch (error) {
    console.error("Error in personalized feed:", error);
    return [];
  }
};
