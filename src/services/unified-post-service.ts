
import { supabase } from "@/integrations/supabase/client";

/**
 * Get posts for the user's feed from the unified_posts table
 */
export const getUnifiedFeedPosts = async (userId: string, limit: number = 20) => {
  try {
    // Try using the get_feed_posts function first
    const { data: functionPosts, error: functionError } = await supabase
      .rpc('get_feed_posts', { 
        user_uuid: userId, 
        post_limit: limit 
      });
      
    if (!functionError && functionPosts && functionPosts.length > 0) {
      // Fetch user profiles for these posts
      const userIds = [...new Set(functionPosts.map(post => post.user_id))];
      const { data: profilesData } = await supabase
        .from("profiles")
        .select("id, username, avatar, full_name")
        .in("id", userIds);
        
      const profileMap = new Map();
      if (profilesData) {
        profilesData.forEach(profile => {
          profileMap.set(profile.id, profile);
        });
      }
      
      return functionPosts.map(post => ({
        ...post,
        profiles: profileMap.get(post.user_id) || null
      }));
    }

    // Fallback to standard query
    const { data: queryPosts, error: queryError } = await supabase
      .from('unified_posts')
      .select(`
        *,
        profiles:user_id (id, username, avatar, full_name)
      `)
      .eq('is_deleted', false)
      .eq('visibility', 'public')
      .or(`user_id.eq.${userId},user_id.in.(${getFollowingQuery(userId)})`)
      .order('created_at', { ascending: false })
      .limit(limit);
      
    if (queryError) throw queryError;
    
    return queryPosts || [];
  } catch (error) {
    console.error("Error fetching unified feed posts:", error);
    throw error;
  }
};

/**
 * Helper function to generate the subquery for following users
 */
const getFollowingQuery = (userId: string) => {
  return `select following_id from user_follows where follower_id = '${userId}'`;
};

/**
 * Check if a post exists in the unified_posts table
 */
export const checkUnifiedPostExists = async (postId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('unified_posts')
      .select('id')
      .eq('id', postId)
      .eq('is_deleted', false)
      .single();
      
    if (error || !data) return false;
    return true;
  } catch (error) {
    console.error('Error checking post existence:', error);
    return false;
  }
};

/**
 * Create a new text post in the unified_posts table
 */
export const createUnifiedTextPost = async (userId: string, content: string, title?: string, tags?: string[], emojiMood?: string) => {
  try {
    const { data, error } = await supabase
      .from("unified_posts")
      .insert({
        user_id: userId,
        post_type: 'text',
        title,
        content,
        tags,
        emoji_mood: emojiMood,
        visibility: 'public'
      })
      .select(`*, profiles:user_id (*)`)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error creating unified text post:", error);
    throw error;
  }
};

/**
 * Create a new image post in the unified_posts table
 */
export const createUnifiedImagePost = async (userId: string, imageUrls: string[], caption?: string, tags?: string[]) => {
  try {
    const { data, error } = await supabase
      .from("unified_posts")
      .insert({
        user_id: userId,
        post_type: 'image',
        image_urls: imageUrls,
        caption,
        tags,
        visibility: 'public'
      })
      .select(`*, profiles:user_id (*)`)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error creating unified image post:", error);
    throw error;
  }
};

/**
 * Soft delete a post (mark as deleted rather than removing from database)
 */
export const softDeletePost = async (postId: string) => {
  try {
    // Try using the soft_delete_post function first
    const { data: functionResult, error: functionError } = await supabase
      .rpc('soft_delete_post', { post_id: postId });
      
    if (!functionError) {
      return true;
    }

    // Fallback to standard update
    const { error } = await supabase
      .from('unified_posts')
      .update({ 
        is_deleted: true,
        deleted_at: new Date().toISOString()
      })
      .eq('id', postId);
      
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error soft deleting post:", error);
    throw error;
  }
};

/**
 * Get likes for a post
 */
export const getUnifiedPostLikes = async (postId: string): Promise<number> => {
  try {
    const { count, error } = await supabase
      .from('unified_post_likes')
      .select('*', { count: 'exact', head: true })
      .eq('post_id', postId);
    
    if (error) throw error;
    return count || 0;
  } catch (error) {
    console.error('Error getting unified post likes count:', error);
    return 0;
  }
};

/**
 * Check if a user has liked a post
 */
export const checkUnifiedPostLikeStatus = async (postId: string, userId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('unified_post_likes')
      .select('*')
      .eq('user_id', userId)
      .eq('post_id', postId)
      .maybeSingle();
    
    if (error) throw error;
    return !!data;
  } catch (error) {
    console.error('Error checking unified post like status:', error);
    return false;
  }
};

/**
 * Toggle like on a post
 */
export const toggleUnifiedPostLike = async (postId: string, userId: string): Promise<boolean> => {
  try {
    // Check if post exists first
    const postExists = await checkUnifiedPostExists(postId);
    if (!postExists) {
      console.log('Post does not exist:', postId);
      return false;
    }
    
    // Check if already liked
    const isLiked = await checkUnifiedPostLikeStatus(postId, userId);
    
    if (isLiked) {
      // Unlike - delete from unified_post_likes
      const { error } = await supabase
        .from('unified_post_likes')
        .delete()
        .eq('user_id', userId)
        .eq('post_id', postId);
        
      if (error) throw error;
      return false;
    } else {
      // Like - insert into unified_post_likes
      const { error } = await supabase
        .from('unified_post_likes')
        .insert({
          user_id: userId,
          post_id: postId
        });
        
      if (error) throw error;
      return true;
    }
  } catch (error) {
    console.error('Error toggling unified post like:', error);
    throw error;
  }
};

/**
 * Get comments for a post
 */
export const getUnifiedPostComments = async (postId: string) => {
  try {
    const { data, error } = await supabase
      .from("unified_post_comments")
      .select(`
        *,
        profiles:user_id (
          id, username, avatar, full_name
        )
      `)
      .eq("post_id", postId)
      .eq("is_deleted", false)
      .order("created_at", { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error getting unified post comments:", error);
    return [];
  }
};

/**
 * Add a comment to a post
 */
export const addUnifiedPostComment = async (postId: string, userId: string, content: string) => {
  try {
    const { data, error } = await supabase
      .from("unified_post_comments")
      .insert({
        post_id: postId,
        user_id: userId,
        content: content
      })
      .select(`
        *,
        profiles:user_id (
          id, username, avatar, full_name
        )
      `)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error adding unified post comment:", error);
    throw error;
  }
};
