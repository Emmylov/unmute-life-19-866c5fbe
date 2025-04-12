
import { supabase } from "@/integrations/supabase/client";
import { Post } from "./feed-utils";

// Extended post interfaces for specific use cases
interface ProfileWithPosts extends Post {
  profiles: any;
}

interface PostWithEngagement extends Post {
  engagement_score: number;
}

// Define a type for API responses
interface SupabaseResponse<T> {
  data: T | null;
  error: any;
}

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
    
    // Type the promises properly
    const imagePostsPromise: Promise<SupabaseResponse<any[]>> = supabase
      .from("posts_images")
      .select("*, profiles:profiles(*)")
      .in("user_id", userIds)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);
      
    const textPostsPromise: Promise<SupabaseResponse<any[]>> = supabase
      .from("posts_text")
      .select("*, profiles:profiles(*)")
      .in("user_id", userIds)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);
      
    const reelsPostsPromise: Promise<SupabaseResponse<any[]>> = supabase
      .from("posts_reels")
      .select("*, profiles:profiles(*)")
      .in("user_id", userIds)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);
    
    const [imagePostsRes, textPostsRes, reelsPostsRes] = await Promise.all([
      imagePostsPromise, 
      textPostsPromise, 
      reelsPostsPromise
    ]);
    
    if (imagePostsRes.error) throw imagePostsRes.error;
    if (textPostsRes.error) throw textPostsRes.error;
    if (reelsPostsRes.error) throw reelsPostsRes.error;
    
    // Use explicit typing to avoid 'never' errors
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

export async function fetchTrendingFeed(limit: number, offset: number): Promise<Post[]> {
  try {
    // Properly typed promise definitions
    const imagePostsWithEngagementPromise: Promise<SupabaseResponse<any[]>> = supabase
      .rpc('get_image_posts_with_engagement')
      .range(offset, offset + limit - 1);
    
    const textPostsWithEngagementPromise: Promise<SupabaseResponse<any[]>> = supabase
      .rpc('get_text_posts_with_engagement')
      .range(offset, offset + limit - 1);
    
    const reelsWithEngagementPromise: Promise<SupabaseResponse<any[]>> = supabase
      .rpc('get_reels_with_engagement')
      .range(offset, offset + limit - 1);
    
    const results = await Promise.all([
      imagePostsWithEngagementPromise,
      textPostsWithEngagementPromise,
      reelsWithEngagementPromise
    ]);
    
    const [imagePostsWithEngagementRes, textPostsWithEngagementRes, reelsWithEngagementRes] = results;
    
    let combinedPosts: Post[] = [];
    
    if (imagePostsWithEngagementRes.error || textPostsWithEngagementRes.error || reelsWithEngagementRes.error) {
      // Fallback to regular posts if the RPC functions fail
      const imagePostsPromise: Promise<SupabaseResponse<any[]>> = supabase
        .from("posts_images")
        .select("*, profiles:profiles(*)")
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);
      
      const textPostsPromise: Promise<SupabaseResponse<any[]>> = supabase
        .from("posts_text")
        .select("*, profiles:profiles(*)")
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);
      
      const reelsPostsPromise: Promise<SupabaseResponse<any[]>> = supabase
        .from("posts_reels")
        .select("*, profiles:profiles(*)")
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);
      
      const [imagePostsRes, textPostsRes, reelsPostsRes] = await Promise.all([
        imagePostsPromise, 
        textPostsPromise, 
        reelsPostsPromise
      ]);
      
      if (imagePostsRes.error) throw imagePostsRes.error;
      if (textPostsRes.error) throw textPostsRes.error;
      if (reelsPostsRes.error) throw reelsPostsRes.error;
      
      // Fixed type annotations for these arrays
      const imagePosts: Post[] = imagePostsRes.data ? imagePostsRes.data.map((post: any) => ({ ...post, type: 'image' })) : [];
      const textPosts: Post[] = textPostsRes.data ? textPostsRes.data.map((post: any) => ({ ...post, type: 'text' })) : [];
      const reelPosts: Post[] = reelsPostsRes.data ? reelsPostsRes.data.map((post: any) => ({ ...post, type: 'reel' })) : [];
      
      combinedPosts = [...imagePosts, ...textPosts, ...reelPosts];
    } else {
      // Fixed type annotations for these arrays with engagement data
      const imagePostsWithEngagement: PostWithEngagement[] = imagePostsWithEngagementRes.data ? 
        imagePostsWithEngagementRes.data.map((post: any) => ({ ...post, type: 'image' })) : [];
      
      const textPostsWithEngagement: PostWithEngagement[] = textPostsWithEngagementRes.data ?
        textPostsWithEngagementRes.data.map((post: any) => ({ ...post, type: 'text' })) : [];
      
      const reelsWithEngagement: PostWithEngagement[] = reelsWithEngagementRes.data ?
        reelsWithEngagementRes.data.map((post: any) => ({ ...post, type: 'reel' })) : [];
      
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

export async function fetchMusicFeed(limit: number, offset: number): Promise<Post[]> {
  try {
    const { data: reels, error } = await supabase
      .from("posts_reels")
      .select("*, profiles:profiles(*)")
      .not("audio_url", "is", null)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (error) throw error;
    
    return (reels || []).map((reel: any) => ({ ...reel, type: 'reel' }));
  } catch (error) {
    console.error("Error fetching music feed:", error);
    return [];
  }
}

export async function fetchCollabsFeed(limit: number, offset: number): Promise<Post[]> {
  try {
    // First check if the collabs table exists
    const { data: hasCollabs } = await supabase.rpc('check_table_exists', { table_name: 'collabs' });
    
    if (hasCollabs) {
      // Use the 'any' type for the dynamic table query
      const { data, error } = await (supabase as any)
        .from("collabs")
        .select("*, profiles:user_id(*)")
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);
      
      if (error) throw error;
      return (data || []).map((collab: any) => ({ ...collab, type: 'collab' }));
    } else {
      // Search for collabs in other posts
      const imagePostsPromise: Promise<SupabaseResponse<any[]>> = supabase
        .from("posts_images")
        .select("*, profiles:profiles(*)")
        .or('caption.ilike.%collab%,tags.cs.{collab}')
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);
      
      const textPostsPromise: Promise<SupabaseResponse<any[]>> = supabase
        .from("posts_text")
        .select("*, profiles:profiles(*)")
        .or('title.ilike.%collab%,body.ilike.%collab%,tags.cs.{collab}')
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);
      
      const reelsPostsPromise: Promise<SupabaseResponse<any[]>> = supabase
        .from("posts_reels")
        .select("*, profiles:profiles(*)")
        .or('caption.ilike.%collab%,tags.cs.{collab}')
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);
      
      const [imagePostsRes, textPostsRes, reelsPostsRes] = await Promise.all([
        imagePostsPromise,
        textPostsPromise,
        reelsPostsPromise
      ]);
      
      // Fixed type annotations
      const combinedPosts: Post[] = [
        ...(imagePostsRes.data || []).map((post: any) => ({ ...post, type: 'image' })),
        ...(textPostsRes.data || []).map((post: any) => ({ ...post, type: 'text' })),
        ...(reelsPostsRes.data || []).map((post: any) => ({ ...post, type: 'reel' }))
      ];
      
      return combinedPosts
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, limit);
    }
  } catch (error) {
    console.error("Error fetching collabs feed:", error);
    return [];
  }
}

export async function fetchPersonalizedFeed(userId: string, interests: string[] = [], limit: number, offset: number): Promise<Post[]> {
  try {
    if (interests && interests.length > 0) {
      // Fetch posts based on user interests
      const imagePostsPromise: Promise<SupabaseResponse<any[]>> = supabase
        .from("posts_images")
        .select("*, profiles:profiles(*)")
        .overlaps('tags', interests)
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);
      
      const textPostsPromise: Promise<SupabaseResponse<any[]>> = supabase
        .from("posts_text")
        .select("*, profiles:profiles(*)")
        .overlaps('tags', interests)
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);
      
      const reelsPostsPromise: Promise<SupabaseResponse<any[]>> = supabase
        .from("posts_reels")
        .select("*, profiles:profiles(*)")
        .overlaps('tags', interests)
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);
      
      const [imagePostsRes, textPostsRes, reelsPostsRes] = await Promise.all([
        imagePostsPromise,
        textPostsPromise,
        reelsPostsPromise
      ]);
      
      // Fix type annotations
      const imagePosts: Post[] = imagePostsRes.data ? imagePostsRes.data.map((post: any) => ({ ...post, type: 'image' })) : [];
      const textPosts: Post[] = textPostsRes.data ? textPostsRes.data.map((post: any) => ({ ...post, type: 'text' })) : [];
      const reelPosts: Post[] = reelsPostsRes.data ? reelsPostsRes.data.map((post: any) => ({ ...post, type: 'reel' })) : [];
      
      const interestMatchedPosts: Post[] = [...imagePosts, ...textPosts, ...reelPosts];
      
      if (interestMatchedPosts.length >= limit) {
        return interestMatchedPosts
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, limit);
      }
      
      const remainingNeeded = limit - interestMatchedPosts.length;
      const supplementalPosts = await import('./feed-utils').then(module => 
        module.fetchSupplementalPosts(userId, remainingNeeded, offset, fetchTrendingFeed, fetchFollowingFeed)
      );
      
      return [...interestMatchedPosts, ...supplementalPosts]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, limit);
    } else {
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
