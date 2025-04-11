
import { supabase } from "@/integrations/supabase/client";

// Search for users
export const searchUsers = async (query: string, limit: number = 20) => {
  try {
    if (!query || query.length < 2) {
      return [];
    }
    
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .or(`username.ilike.%${query}%,full_name.ilike.%${query}%`)
      .limit(limit);
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error("Error searching users:", error);
    throw error;
  }
};

// Search for content (posts, reels, etc.)
export const searchContent = async (
  query: string, 
  options: { 
    contentType?: 'images' | 'text' | 'reels' | 'all';
    limit?: number; 
    offset?: number;
    tags?: string[];
  } = {}
) => {
  try {
    if (!query || query.length < 2) {
      return {
        items: [],
        total: 0
      };
    }
    
    const { 
      contentType = 'all',
      limit = 20,
      offset = 0,
      tags = []
    } = options;
    
    // Use switch to determine which tables to search based on contentType
    let results: any[] = [];
    let total = 0;
    
    if (contentType === 'all' || contentType === 'text') {
      const { data: textPosts, error: textError, count: textCount } = await supabase
        .from("posts_text")
        .select("*, profiles:profiles(*)", { count: 'exact' })
        .or(`title.ilike.%${query}%,body.ilike.%${query}%`)
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);
      
      if (textError) throw textError;
      
      if (textPosts) {
        results = [...results, ...textPosts.map(post => ({ ...post, type: 'text' }))];
        total += textCount || 0;
      }
    }
    
    if (contentType === 'all' || contentType === 'images') {
      let imagesQuery = supabase
        .from("posts_images")
        .select("*, profiles:profiles(*)", { count: 'exact' })
        .or(`caption.ilike.%${query}%`);
      
      // Add tag filtering if specified
      if (tags && tags.length > 0) {
        imagesQuery = imagesQuery.contains('tags', tags);
      }
      
      const { data: imagePosts, error: imagesError, count: imagesCount } = await imagesQuery
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);
      
      if (imagesError) throw imagesError;
      
      if (imagePosts) {
        results = [...results, ...imagePosts.map(post => ({ ...post, type: 'image' }))];
        total += imagesCount || 0;
      }
    }
    
    if (contentType === 'all' || contentType === 'reels') {
      let reelsQuery = supabase
        .from("posts_reels")
        .select("*, profiles:profiles(*)", { count: 'exact' })
        .or(`caption.ilike.%${query}%`);
      
      // Add tag filtering if specified
      if (tags && tags.length > 0) {
        reelsQuery = reelsQuery.contains('tags', tags);
      }
      
      const { data: reelPosts, error: reelsError, count: reelsCount } = await reelsQuery
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);
      
      if (reelsError) throw reelsError;
      
      if (reelPosts) {
        results = [...results, ...reelPosts.map(post => ({ ...post, type: 'reel' }))];
        total += reelsCount || 0;
      }
    }
    
    // Sort combined results by created_at
    results.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return dateB - dateA;
    });
    
    // Trim to respect limit
    results = results.slice(0, limit);
    
    return {
      items: results,
      total
    };
  } catch (error) {
    console.error("Error searching content:", error);
    throw error;
  }
};

// Get trending hashtags/topics
export const getTrendingTopics = async (limit: number = 10) => {
  try {
    // This is a simplistic implementation
    // In a real app, you'd use a more sophisticated algorithm
    
    // Get recent posts across all types
    const { data: recentPosts, error: postsError } = await supabase
      .from("posts_text")
      .select("tags, created_at")
      .order("created_at", { ascending: false })
      .limit(100);
    
    if (postsError) throw postsError;
    
    const { data: recentImages, error: imagesError } = await supabase
      .from("posts_images")
      .select("tags, created_at")
      .order("created_at", { ascending: false })
      .limit(100);
    
    if (imagesError) throw imagesError;
    
    const { data: recentReels, error: reelsError } = await supabase
      .from("posts_reels")
      .select("tags, created_at")
      .order("created_at", { ascending: false })
      .limit(100);
    
    if (reelsError) throw reelsError;
    
    // Combine all tags and count occurrences
    const allTags = [
      ...(recentPosts || []).flatMap(post => post.tags || []),
      ...(recentImages || []).flatMap(post => post.tags || []),
      ...(recentReels || []).flatMap(post => post.tags || [])
    ];
    
    const tagCounts: Record<string, number> = {};
    allTags.forEach(tag => {
      if (!tag) return;
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
    
    // Convert to array, sort by count, and take top limit
    const trendingTags = Object.entries(tagCounts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
    
    return trendingTags;
  } catch (error) {
    console.error("Error getting trending topics:", error);
    throw error;
  }
};

// Search for communities or groups
export const searchCommunities = async (query: string, limit: number = 10) => {
  try {
    if (!query || query.length < 2) {
      return [];
    }
    
    // First, check if communities table exists
    const { data: tablesData } = await supabase
      .rpc('check_table_exists', { table_name: 'communities' });
      
    if (!tablesData) {
      // If communities table doesn't exist, return empty array
      return [];
    }
    
    // Search for communities
    const { data, error } = await supabase
      .from("communities")
      .select("*")
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
      .limit(limit);
    
    if (error && error.code !== 'PGRST109') { // PGRST109 means table doesn't exist
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error("Error searching communities:", error);
    return [];
  }
};
