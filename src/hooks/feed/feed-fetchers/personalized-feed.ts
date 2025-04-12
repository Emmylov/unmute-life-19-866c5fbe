
import { supabase } from "@/integrations/supabase/client";
import { Post } from "../feed-utils";
import { fetchFollowingFeed } from "./following-feed";
import { fetchTrendingFeed } from "./trending-feed";
import { toTypedPromise } from "./utils";

export async function fetchPersonalizedFeed(userId: string, interests: string[] = [], limit: number, offset: number): Promise<Post[]> {
  try {
    if (interests && interests.length > 0) {
      // Fetch posts based on user interests, using toTypedPromise for all queries
      const imagePostsPromise = toTypedPromise<any[]>(
        supabase
          .from("posts_images")
          .select("*, profiles:profiles(*)")
          .overlaps('tags', interests)
          .order("created_at", { ascending: false })
          .range(offset, offset + limit - 1)
      );
      
      const textPostsPromise = toTypedPromise<any[]>(
        supabase
          .from("posts_text")
          .select("*, profiles:profiles(*)")
          .overlaps('tags', interests)
          .order("created_at", { ascending: false })
          .range(offset, offset + limit - 1)
      );
      
      const reelsPostsPromise = toTypedPromise<any[]>(
        supabase
          .from("posts_reels")
          .select("*, profiles:profiles(*)")
          .overlaps('tags', interests)
          .order("created_at", { ascending: false })
          .range(offset, offset + limit - 1)
      );
      
      // Wait for all promises to resolve
      const [imagePostsRes, textPostsRes, reelsPostsRes] = await Promise.all([
        imagePostsPromise,
        textPostsPromise,
        reelsPostsPromise
      ]);
      
      // Process the results
      const imagePosts: Post[] = imagePostsRes.data ? imagePostsRes.data.map((post: any) => ({ ...post, type: 'image' })) : [];
      const textPosts: Post[] = textPostsRes.data ? textPostsRes.data.map((post: any) => ({ ...post, type: 'text' })) : [];
      const reelPosts: Post[] = reelsPostsRes.data ? reelsPostsRes.data.map((post: any) => ({ ...post, type: 'reel' })) : [];
      
      const interestMatchedPosts: Post[] = [...imagePosts, ...textPosts, ...reelPosts];
      
      if (interestMatchedPosts.length >= limit) {
        return interestMatchedPosts
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, limit);
      }
      
      // Not enough interest-matched posts, get supplemental posts
      const remainingNeeded = limit - interestMatchedPosts.length;
      const supplementalPosts = await fetchSupplementalPosts(userId, remainingNeeded, offset);
      
      return [...interestMatchedPosts, ...supplementalPosts]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, limit);
    } else {
      // No specific interests, get mix of following and trending posts
      const followingPosts = await fetchFollowingFeed(userId, Math.ceil(limit / 2), offset);
      
      if (followingPosts.length < Math.ceil(limit / 2)) {
        const trendingPosts = await fetchTrendingFeed(limit - followingPosts.length, offset);
        return [...followingPosts, ...trendingPosts]
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, limit);
      }
      
      return followingPosts.slice(0, limit);
    }
  } catch (error) {
    console.error("Error fetching personalized feed:", error);
    return [];
  }
}

// Custom version of fetchSupplementalPosts for this module
async function fetchSupplementalPosts(
  userId: string, 
  limit: number, 
  offset: number
): Promise<Post[]> {
  try {
    const [trendingPosts, followingPosts] = await Promise.all([
      fetchTrendingFeed(Math.ceil(limit / 2), offset),
      fetchFollowingFeed(userId, Math.ceil(limit / 2), offset)
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
