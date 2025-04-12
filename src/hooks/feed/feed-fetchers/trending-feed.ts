
import { supabase } from "@/integrations/supabase/client";
import { Post } from "../feed-utils";
import { PostWithEngagement } from "./types";
import { toTypedPromise } from "./utils";

export async function fetchTrendingFeed(limit: number, offset: number): Promise<Post[]> {
  try {
    // Fetch image posts with engagement with proper type annotations
    const imagePostsWithEngagementPromise = toTypedPromise<PostWithEngagement[]>(
      supabase
        .rpc('get_image_posts_with_engagement')
        .range(offset, offset + limit - 1)
    );
    
    // Fetch text posts with engagement with proper type annotations
    const textPostsWithEngagementPromise = toTypedPromise<PostWithEngagement[]>(
      supabase
        .rpc('get_text_posts_with_engagement')
        .range(offset, offset + limit - 1)
    );
    
    // Fetch reels with engagement with proper type annotations
    const reelsWithEngagementPromise = toTypedPromise<PostWithEngagement[]>(
      supabase
        .rpc('get_reels_with_engagement')
        .range(offset, offset + limit - 1)
    );
    
    // Wait for all promises to resolve
    const results = await Promise.all([
      imagePostsWithEngagementPromise,
      textPostsWithEngagementPromise,
      reelsWithEngagementPromise
    ]);
    
    const [imagePostsWithEngagementRes, textPostsWithEngagementRes, reelsWithEngagementRes] = results;
    
    let combinedPosts: Post[] = [];
    
    if (imagePostsWithEngagementRes.error || textPostsWithEngagementRes.error || reelsWithEngagementRes.error) {
      // Fallback to regular posts if the RPC functions fail
      return await fetchTrendingFeedFallback(limit, offset);
    } else {
      // Process the engagement data results with proper typing
      const imagePostsWithEngagement: Post[] = imagePostsWithEngagementRes.data ? 
        imagePostsWithEngagementRes.data.map((post: PostWithEngagement) => ({ ...post, type: 'image' })) : [];
      
      const textPostsWithEngagement: Post[] = textPostsWithEngagementRes.data ?
        textPostsWithEngagementRes.data.map((post: PostWithEngagement) => ({ ...post, type: 'text' })) : [];
      
      const reelsWithEngagement: Post[] = reelsWithEngagementRes.data ?
        reelsWithEngagementRes.data.map((post: PostWithEngagement) => ({ ...post, type: 'reel' })) : [];
      
      combinedPosts = [...imagePostsWithEngagement, ...textPostsWithEngagement, ...reelsWithEngagement];
      
      // Sort by engagement score
      combinedPosts.sort((a: any, b: any) => 
        ('engagement_score' in b && 'engagement_score' in a) ? 
          b.engagement_score - a.engagement_score : 0
      );
    }
    
    return combinedPosts.slice(0, limit);
  } catch (error) {
    console.error("Error fetching trending feed:", error);
    return [];
  }
}

// Fallback function when RPC functions fail
async function fetchTrendingFeedFallback(limit: number, offset: number): Promise<Post[]> {
  try {
    const imagePostsPromise = toTypedPromise<any[]>(
      supabase
        .from("posts_images")
        .select("*, profiles:profiles(*)")
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1)
    );
    
    const textPostsPromise = toTypedPromise<any[]>(
      supabase
        .from("posts_text")
        .select("*, profiles:profiles(*)")
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1)
    );
    
    const reelsPostsPromise = toTypedPromise<any[]>(
      supabase
        .from("posts_reels")
        .select("*, profiles:profiles(*)")
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1)
    );
    
    // Wait for all fallback promises to resolve
    const [imagePostsRes, textPostsRes, reelsPostsRes] = await Promise.all([
      imagePostsPromise, 
      textPostsPromise, 
      reelsPostsPromise
    ]);
    
    if (imagePostsRes.error) throw imagePostsRes.error;
    if (textPostsRes.error) throw textPostsRes.error;
    if (reelsPostsRes.error) throw reelsPostsRes.error;
    
    // Process the fallback results
    const imagePosts: Post[] = imagePostsRes.data ? imagePostsRes.data.map((post: any) => ({ ...post, type: 'image' })) : [];
    const textPosts: Post[] = textPostsRes.data ? textPostsRes.data.map((post: any) => ({ ...post, type: 'text' })) : [];
    const reelPosts: Post[] = reelsPostsRes.data ? reelsPostsRes.data.map((post: any) => ({ ...post, type: 'reel' })) : [];
    
    const combinedPosts = [...imagePosts, ...textPosts, ...reelPosts];
    
    return combinedPosts
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, limit);
  } catch (error) {
    console.error("Error in trending feed fallback:", error);
    return [];
  }
}
