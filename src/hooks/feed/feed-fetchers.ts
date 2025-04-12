
import { supabase } from "@/integrations/supabase/client";
import { fetchSupplementalPosts } from "./feed-utils";

export async function fetchFollowingFeed(userId: string, limit: number, offset: number): Promise<any[]> {
  try {
    const { data: followingData, error: followingError } = await supabase
      .from("user_follows" as any)
      .select("following_id")
      .eq("follower_id", userId);
    
    if (followingError) throw followingError;
    
    const followingIds = followingData && Array.isArray(followingData) 
      ? followingData.map((item: any) => item.following_id) 
      : [];
    
    const userIds = [...followingIds, userId];
    
    if (userIds.length === 1) {
      const { data, error } = await supabase
        .from("posts_images" as any)
        .select("*, profiles:profiles(*)")
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);
      
      if (error) throw error;
      return data ? data.map((post: any) => ({ ...post, type: 'image' })) : [];
    }
    
    const imagePostsRes = await supabase
      .from("posts_images" as any)
      .select("*, profiles:profiles(*)")
      .in("user_id", userIds)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);
      
    const textPostsRes = await supabase
      .from("posts_text" as any)
      .select("*, profiles:profiles(*)")
      .in("user_id", userIds)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);
      
    const reelsPostsRes = await supabase
      .from("posts_reels" as any)
      .select("*, profiles:profiles(*)")
      .in("user_id", userIds)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (imagePostsRes.error) throw imagePostsRes.error;
    if (textPostsRes.error) throw textPostsRes.error;
    if (reelsPostsRes.error) throw reelsPostsRes.error;
    
    const imagePosts = imagePostsRes.data ? imagePostsRes.data.map((post: any) => ({ ...post, type: 'image' })) : [];
    const textPosts = textPostsRes.data ? textPostsRes.data.map((post: any) => ({ ...post, type: 'text' })) : [];
    const reelPosts = reelsPostsRes.data ? reelsPostsRes.data.map((post: any) => ({ ...post, type: 'reel' })) : [];
    
    const combinedPosts = [...imagePosts, ...textPosts, ...reelPosts];
    
    return combinedPosts.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    ).slice(0, limit);
  } catch (error) {
    console.error("Error fetching following feed:", error);
    return [];
  }
}

export async function fetchTrendingFeed(limit: number, offset: number): Promise<any[]> {
  try {
    const imagePostsWithEngagementPromise = supabase
      .rpc('get_image_posts_with_engagement' as any)
      .range(offset, offset + limit - 1);
    
    const textPostsWithEngagementPromise = supabase
      .rpc('get_text_posts_with_engagement' as any)
      .range(offset, offset + limit - 1);
    
    const reelsWithEngagementPromise = supabase
      .rpc('get_reels_with_engagement' as any)
      .range(offset, offset + limit - 1);
    
    const results = await Promise.all([
      imagePostsWithEngagementPromise,
      textPostsWithEngagementPromise,
      reelsWithEngagementPromise
    ]);
    
    const imagePostsWithEngagementRes = results[0];
    const textPostsWithEngagementRes = results[1];
    const reelsWithEngagementRes = results[2];
    
    let combinedPosts: any[] = [];
    
    if (imagePostsWithEngagementRes.error || textPostsWithEngagementRes.error || reelsWithEngagementRes.error) {
      const results = await Promise.all([
        supabase
          .from("posts_images" as any)
          .select("*, profiles:profiles(*)")
          .order("created_at", { ascending: false })
          .range(offset, offset + limit - 1),
        
        supabase
          .from("posts_text" as any)
          .select("*, profiles:profiles(*)")
          .order("created_at", { ascending: false })
          .range(offset, offset + limit - 1),
        
        supabase
          .from("posts_reels" as any)
          .select("*, profiles:profiles(*)")
          .order("created_at", { ascending: false })
          .range(offset, offset + limit - 1)
      ]);
      
      const imagePostsRes = results[0];
      const textPostsRes = results[1];
      const reelsPostsRes = results[2];
      
      if (imagePostsRes.error) throw imagePostsRes.error;
      if (textPostsRes.error) throw textPostsRes.error;
      if (reelsPostsRes.error) throw reelsPostsRes.error;
      
      const imagePosts = imagePostsRes.data ? imagePostsRes.data.map((post: any) => ({ ...post, type: 'image' })) : [];
      const textPosts = textPostsRes.data ? textPostsRes.data.map((post: any) => ({ ...post, type: 'text' })) : [];
      const reelPosts = reelsPostsRes.data ? reelsPostsRes.data.map((post: any) => ({ ...post, type: 'reel' })) : [];
      
      combinedPosts = [...imagePosts, ...textPosts, ...reelPosts];
    } else {
      const imagePostsWithEngagement = imagePostsWithEngagementRes.data ? 
        imagePostsWithEngagementRes.data.map((post: any) => ({ ...post, type: 'image' })) : [];
      
      const textPostsWithEngagement = textPostsWithEngagementRes.data ?
        textPostsWithEngagementRes.data.map((post: any) => ({ ...post, type: 'text' })) : [];
      
      const reelsWithEngagement = reelsWithEngagementRes.data ?
        reelsWithEngagementRes.data.map((post: any) => ({ ...post, type: 'reel' })) : [];
      
      combinedPosts = [...imagePostsWithEngagement, ...textPostsWithEngagement, ...reelsWithEngagement];
      
      combinedPosts.sort((a, b) => b.engagement_score - a.engagement_score);
    }
    
    return combinedPosts.slice(0, limit);
  } catch (error) {
    console.error("Error fetching trending feed:", error);
    return [];
  }
}

export async function fetchMusicFeed(limit: number, offset: number): Promise<any[]> {
  try {
    const { data: reels, error } = await supabase
      .from("posts_reels" as any)
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

export async function fetchCollabsFeed(limit: number, offset: number): Promise<any[]> {
  try {
    const { data: hasCollabs } = await supabase.rpc('check_table_exists' as any, { table_name: 'collabs' });
    
    if (hasCollabs) {
      const { data, error } = await supabase
        .from("collabs" as any)
        .select("*, profiles:user_id(*)")
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);
      
      if (error) throw error;
      return (data || []).map((collab: any) => ({ ...collab, type: 'collab' }));
    } else {
      const results = await Promise.all([
        supabase
          .from("posts_images" as any)
          .select("*, profiles:profiles(*)")
          .or('caption.ilike.%collab%,tags.cs.{collab}')
          .order("created_at", { ascending: false })
          .range(offset, offset + limit - 1),
        
        supabase
          .from("posts_text" as any)
          .select("*, profiles:profiles(*)")
          .or('title.ilike.%collab%,body.ilike.%collab%,tags.cs.{collab}')
          .order("created_at", { ascending: false })
          .range(offset, offset + limit - 1),
        
        supabase
          .from("posts_reels" as any)
          .select("*, profiles:profiles(*)")
          .or('caption.ilike.%collab%,tags.cs.{collab}')
          .order("created_at", { ascending: false })
          .range(offset, offset + limit - 1)
      ]);
      
      const imagePostsRes = results[0];
      const textPostsRes = results[1];
      const reelsPostsRes = results[2];
      
      const combinedPosts = [
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

export async function fetchPersonalizedFeed(userId: string, interests: string[] = [], limit: number, offset: number): Promise<any[]> {
  try {
    if (interests && interests.length > 0) {
      const results = await Promise.all([
        supabase
          .from("posts_images" as any)
          .select("*, profiles:profiles(*)")
          .overlaps('tags', interests)
          .order("created_at", { ascending: false })
          .range(offset, offset + limit - 1),
        
        supabase
          .from("posts_text" as any)
          .select("*, profiles:profiles(*)")
          .overlaps('tags', interests)
          .order("created_at", { ascending: false })
          .range(offset, offset + limit - 1),
        
        supabase
          .from("posts_reels" as any)
          .select("*, profiles:profiles(*)")
          .overlaps('tags', interests)
          .order("created_at", { ascending: false })
          .range(offset, offset + limit - 1)
      ]);
      
      const imagePostsRes = results[0];
      const textPostsRes = results[1];
      const reelsPostsRes = results[2];
      
      const imagePosts = imagePostsRes.data ? imagePostsRes.data.map((post: any) => ({ ...post, type: 'image' })) : [];
      const textPosts = textPostsRes.data ? textPostsRes.data.map((post: any) => ({ ...post, type: 'text' })) : [];
      const reelPosts = reelsPostsRes.data ? reelsPostsRes.data.map((post: any) => ({ ...post, type: 'reel' })) : [];
      
      const interestMatchedPosts = [...imagePosts, ...textPosts, ...reelPosts];
      
      if (interestMatchedPosts.length >= limit) {
        return interestMatchedPosts
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, limit);
      }
      
      const remainingNeeded = limit - interestMatchedPosts.length;
      const supplementalPosts = await fetchSupplementalPosts(userId, remainingNeeded, offset);
      
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
