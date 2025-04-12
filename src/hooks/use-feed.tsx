import { useState, useEffect, useCallback } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { trackAnalyticEvent } from "@/services/analytics-service";
import { toast } from "sonner";

interface FeedOptions {
  feedType?: 'forYou' | 'following' | 'trending' | 'music' | 'collabs';
  limit?: number;
  tags?: string[];
}

export const useFeed = (options: FeedOptions = {}) => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [offset, setOffset] = useState<number>(0);
  const { user, profile } = useAuth();
  
  const { 
    feedType = 'forYou', 
    limit = 10,
    tags
  } = options;
  
  const fetchFeed = useCallback(async (reset: boolean = false) => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const newOffset = reset ? 0 : offset;
      let newPosts: any[] = [];
      
      switch (feedType) {
        case 'following':
          newPosts = await fetchFollowingFeed(user.id, limit, newOffset);
          break;
          
        case 'trending':
          newPosts = await fetchTrendingFeed(limit, newOffset);
          break;
          
        case 'music':
          newPosts = await fetchMusicFeed(limit, newOffset);
          break;
          
        case 'collabs':
          newPosts = await fetchCollabsFeed(limit, newOffset);
          break;
          
        case 'forYou':
        default:
          newPosts = await fetchPersonalizedFeed(user.id, profile?.interests, limit, newOffset);
          break;
      }
      
      setHasMore(newPosts.length === limit);
      
      if (reset) {
        setPosts(newPosts);
      } else {
        setPosts(prev => [...prev, ...newPosts]);
      }
      
      if (reset) {
        setOffset(limit);
      } else {
        setOffset(offset + limit);
      }
      
      trackAnalyticEvent(user.id, 'feed_view', { feed_type: feedType, offset: newOffset, limit });
    } catch (err: any) {
      console.error("Error fetching feed:", err);
      setError(err.message || "Failed to load feed");
      toast.error("Failed to load feed");
    } finally {
      setLoading(false);
    }
  }, [user, profile, feedType, limit, offset, tags]);
  
  const fetchMore = useCallback(() => {
    if (loading || !hasMore) return;
    fetchFeed();
  }, [fetchFeed, loading, hasMore]);
  
  const refresh = useCallback(() => {
    fetchFeed(true);
  }, [fetchFeed]);
  
  useEffect(() => {
    if (user) {
      fetchFeed(true);
    }
  }, [user, feedType, tags]);
  
  return {
    posts,
    loading,
    error,
    hasMore,
    fetchMore,
    refresh
  };
};

async function fetchFollowingFeed(userId: string, limit: number, offset: number): Promise<any[]> {
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

async function fetchTrendingFeed(limit: number, offset: number): Promise<any[]> {
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
    
    const imagePostsWithEngagementRes = await imagePostsWithEngagementPromise;
    const textPostsWithEngagementRes = await textPostsWithEngagementPromise;
    const reelsWithEngagementRes = await reelsWithEngagementPromise;
    
    let combinedPosts: any[] = [];
    
    if (imagePostsWithEngagementRes.error || textPostsWithEngagementRes.error || reelsWithEngagementRes.error) {
      const [imagePostsRes, textPostsRes, reelsPostsRes] = await Promise.all([
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

async function fetchMusicFeed(limit: number, offset: number): Promise<any[]> {
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

async function fetchCollabsFeed(limit: number, offset: number): Promise<any[]> {
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
      const [imagePostsRes, textPostsRes, reelsPostsRes] = await Promise.all([
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

async function fetchPersonalizedFeed(userId: string, interests: string[] = [], limit: number, offset: number): Promise<any[]> {
  try {
    if (interests && interests.length > 0) {
      const [imagePostsRes, textPostsRes, reelsPostsRes] = await Promise.all([
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

async function fetchSupplementalPosts(userId: string, limit: number, offset: number): Promise<any[]> {
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
