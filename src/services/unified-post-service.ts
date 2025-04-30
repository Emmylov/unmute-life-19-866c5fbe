
import { supabase } from "@/integrations/supabase/client";

/**
 * Get posts for the user's feed from the unified_posts table
 * @param userId The user's ID
 * @param limit Number of posts to fetch
 * @param options Optional fetch options
 */
export const getUnifiedFeedPosts = async (
  userId: string, 
  limit: number = 20, 
  options?: { cache?: 'default' | 'no-cache' }
) => {
  try {
    // Try using the get_feed_posts function first - most reliable approach
    const { data: functionPosts, error: functionError } = await supabase
      .rpc('get_feed_posts', { 
        user_uuid: userId, 
        post_limit: limit 
      });
      
    if (!functionError && functionPosts && functionPosts.length > 0) {
      console.log("Successfully fetched posts from get_feed_posts function");
      
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
    } else if (functionError) {
      console.error("Error using get_feed_posts function:", functionError);
    }

    // Fallback to direct query with manual joins
    console.log("Falling back to direct query for unified posts");
    const { data: unifiedPosts, error: unifiedError } = await supabase
      .from('unified_posts')
      .select('*')
      .eq('is_deleted', false)
      .eq('visibility', 'public')
      .order('created_at', { ascending: false })
      .limit(limit);
      
    if (unifiedError) {
      console.error("Error fetching unified posts:", unifiedError);
      throw unifiedError;
    }
    
    if (!unifiedPosts || unifiedPosts.length === 0) {
      return [];
    }
    
    // Fetch profiles separately
    const userIds = [...new Set(unifiedPosts.map(post => post.user_id))];
    const { data: profilesData, error: profilesError } = await supabase
      .from("profiles")
      .select("id, username, avatar, full_name")
      .in("id", userIds);
      
    if (profilesError) {
      console.error("Error fetching profiles:", profilesError);
    }
    
    const profileMap = new Map();
    if (profilesData) {
      profilesData.forEach(profile => {
        profileMap.set(profile.id, profile);
      });
    }
    
    return unifiedPosts.map(post => ({
      ...post,
      profiles: profileMap.get(post.user_id) || null
    }));
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
    console.log(`Checking if unified post exists: ${postId}`);
    
    // First try using the unified_posts table
    const { data: unifiedData, error: unifiedError, count: unifiedCount } = await supabase
      .from('unified_posts')
      .select('id', { count: 'exact', head: true })
      .eq('id', postId)
      .eq('is_deleted', false);
      
    if (unifiedError) {
      console.error('Error checking unified post existence:', unifiedError);
    } else if (unifiedCount && unifiedCount > 0) {
      console.log(`Unified post ${postId} exists in unified_posts table`);
      return true;
    }
    
    // If not found in unified_posts, try posts_text table
    const { data: textData, error: textError, count: textCount } = await supabase
      .from('posts_text')
      .select('id', { count: 'exact', head: true })
      .eq('id', postId);
      
    if (textError) {
      console.error('Error checking text post existence:', textError);
    } else if (textCount && textCount > 0) {
      console.log(`Post ${postId} exists in posts_text table`);
      return true;
    }
    
    // If not found in posts_text, try posts_images table
    const { data: imageData, error: imageError, count: imageCount } = await supabase
      .from('posts_images')
      .select('id', { count: 'exact', head: true })
      .eq('id', postId);
      
    if (imageError) {
      console.error('Error checking image post existence:', imageError);
    } else if (imageCount && imageCount > 0) {
      console.log(`Post ${postId} exists in posts_images table`);
      return true;
    }
    
    // If not found in any table, return false
    console.log(`Post ${postId} does not exist in any post table`);
    return false;
  } catch (error) {
    console.error('Error checking post existence:', error);
    return false;
  }
};

/**
 * Create a new text post in the unified_posts table
 */
export const createUnifiedTextPost = async (
  userId: string, 
  content: string, 
  title?: string, 
  tags?: string[], 
  emojiMood?: string
) => {
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
      .select();
    
    if (error) throw error;
    
    // Fetch the profile separately since we had relationship issues
    if (data && data.length > 0) {
      const { data: profileData } = await supabase
        .from("profiles")
        .select("id, username, avatar, full_name")
        .eq("id", userId)
        .single();
        
      return {
        ...data[0],
        profiles: profileData || null
      };
    }
    
    return data?.[0];
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
      .select();
    
    if (error) throw error;
    
    // Fetch the profile separately since we had relationship issues
    if (data && data.length > 0) {
      const { data: profileData } = await supabase
        .from("profiles")
        .select("id, username, avatar, full_name")
        .eq("id", userId)
        .single();
        
      return {
        ...data[0],
        profiles: profileData || null
      };
    }
    
    return data?.[0];
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
    
    if (error) {
      console.error('Error getting unified post likes count:', error);
      return 0;
    }
    
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
    
    if (error) {
      console.error('Error checking unified post like status:', error);
      return false;
    }
    
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
    // Check if post exists first with our improved check function
    const postExists = await checkUnifiedPostExists(postId);
    if (!postExists) {
      console.log('Post does not exist:', postId);
      return false;
    }
    
    // Check if already liked using a more resilient query
    let isLiked = false;
    try {
      const { data, error } = await supabase
        .from('unified_post_likes')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('post_id', postId);
      
      isLiked = !!data || false;
      
      if (error) {
        console.warn("Error checking like status using unified_post_likes:", error);
        // Fall back to post_likes table if needed
        const { data: legacyData, error: legacyError } = await supabase
          .from('post_likes')
          .select('post_id', { head: true })
          .eq('user_id', userId)
          .eq('post_id', postId);
          
        if (!legacyError) {
          isLiked = !!legacyData;
        }
      }
    } catch (likeCheckError) {
      console.error("Error checking like status:", likeCheckError);
    }
    
    if (isLiked) {
      // Unlike - delete from unified_post_likes
      const { error } = await supabase
        .from('unified_post_likes')
        .delete()
        .eq('user_id', userId)
        .eq('post_id', postId);
        
      if (error) {
        console.error("Error removing like:", error);
        throw error;
      }
      return false;
    } else {
      // Like - insert into unified_post_likes
      const { error } = await supabase
        .from('unified_post_likes')
        .insert({
          user_id: userId,
          post_id: postId
        });
        
      if (error) {
        // If there's an error with unified_post_likes, try the post_likes table
        console.warn("Error adding like to unified_post_likes, trying post_likes:", error);
        
        // Try the legacy post_likes table as a fallback
        const { error: legacyError } = await supabase
          .from('post_likes')
          .insert({
            user_id: userId,
            post_id: postId
          });
          
        if (legacyError) {
          console.error("Error adding like to post_likes as well:", legacyError);
          throw legacyError;
        }
      }
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
    // First check if the post exists to avoid foreign key errors
    const postExists = await checkUnifiedPostExists(postId);
    if (!postExists) {
      console.log('Post does not exist when fetching comments:', postId);
      return [];
    }
    
    // Get comments and join with profiles manually
    const { data: comments, error } = await supabase
      .from("unified_post_comments")
      .select('*')
      .eq("post_id", postId)
      .eq("is_deleted", false)
      .order("created_at", { ascending: false });
    
    if (error) {
      console.error("Error getting comments:", error);
      throw error;
    }
    
    if (!comments || comments.length === 0) {
      return [];
    }
    
    // Fetch profiles separately
    const userIds = [...new Set(comments.map(comment => comment.user_id))];
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
    
    return comments.map(comment => ({
      ...comment,
      profiles: profileMap.get(comment.user_id) || null
    }));
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
    // First check if the post exists to avoid foreign key errors
    const postExists = await checkUnifiedPostExists(postId);
    if (!postExists) {
      console.log('Post does not exist when adding comment:', postId);
      throw new Error("Post does not exist");
    }
    
    const { data, error } = await supabase
      .from("unified_post_comments")
      .insert({
        post_id: postId,
        user_id: userId,
        content: content
      })
      .select('*')
      .single();
    
    if (error) {
      console.error("Error adding comment:", error);
      throw error;
    }
    
    // Fetch profile separately
    const { data: profileData } = await supabase
      .from("profiles")
      .select("id, username, avatar, full_name")
      .eq("id", userId)
      .single();
      
    return {
      ...data,
      profiles: profileData || null
    };
  } catch (error) {
    console.error("Error adding unified post comment:", error);
    throw error;
  }
};
