
import { supabase } from "@/integrations/supabase/client";
import { Post } from "../feed-utils";
import { toTypedPromise } from "./utils";

export async function fetchFollowingFeed(userId: string, limit: number, offset: number): Promise<Post[]> {
  try {
    const { data: followingData, error: followingError } = await supabase
      .from("user_follows")
      .select("following_id")
      .eq("follower_id", userId);
    
    if (followingError) throw followingError;
    
    const followingIds = followingData && Array.isArray(followingData) 
      ? followingData.map((item: any) => item.following_id) 
      : [];
    
    const userIds = [...followingIds, userId];
    
    if (userIds.length === 1) {
      const { data, error } = await supabase
        .from("posts_images")
        .select("*, profiles:profiles(*)")
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);
      
      if (error) throw error;
      return data ? data.map((post: any) => ({ ...post, type: 'image' })) : [];
    }
    
    // Fetch image posts with proper type annotations
    const imagePostsPromise = toTypedPromise<any[]>(
      supabase
        .from("posts_images")
        .select("*, profiles:profiles(*)")
        .in("user_id", userIds)
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1)
    );
      
    // Fetch text posts with proper type annotations
    const textPostsPromise = toTypedPromise<any[]>(
      supabase
        .from("posts_text")
        .select("*, profiles:profiles(*)")
        .in("user_id", userIds)
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1)
    );
      
    // Fetch reels posts with proper type annotations
    const reelsPostsPromise = toTypedPromise<any[]>(
      supabase
        .from("posts_reels")
        .select("*, profiles:profiles(*)")
        .in("user_id", userIds)
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1)
    );
    
    // Wait for all promises to resolve
    const [imagePostsRes, textPostsRes, reelsPostsRes] = await Promise.all([
      imagePostsPromise, 
      textPostsPromise, 
      reelsPostsPromise
    ]);
    
    if (imagePostsRes.error) throw imagePostsRes.error;
    if (textPostsRes.error) throw textPostsRes.error;
    if (reelsPostsRes.error) throw reelsPostsRes.error;
    
    // Process the results with proper typing
    const imagePosts: Post[] = imagePostsRes.data ? imagePostsRes.data.map((post: any) => ({ ...post, type: 'image' })) : [];
    const textPosts: Post[] = textPostsRes.data ? textPostsRes.data.map((post: any) => ({ ...post, type: 'text' })) : [];
    const reelPosts: Post[] = reelsPostsRes.data ? reelsPostsRes.data.map((post: any) => ({ ...post, type: 'reel' })) : [];
    
    const combinedPosts: Post[] = [...imagePosts, ...textPosts, ...reelPosts];
    
    return combinedPosts.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    ).slice(0, limit);
  } catch (error) {
    console.error("Error fetching following feed:", error);
    return [];
  }
}
