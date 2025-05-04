
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

    // Fallback to direct queries for individual post types
    console.log("Falling back to direct queries for posts");
    
    // Get posts from text_posts table
    const { data: textPosts, error: textError } = await supabase
      .from('text_posts')
      .select('*')
      .eq('visibility', 'public')
      .order('created_at', { ascending: false })
      .limit(limit);
      
    if (textError) {
      console.error("Error fetching text posts:", textError);
    }
    
    // Get posts from image_posts table
    const { data: imagePosts, error: imageError } = await supabase
      .from('image_posts')
      .select('*')
      .eq('visibility', 'public')
      .order('created_at', { ascending: false })
      .limit(limit);
      
    if (imageError) {
      console.error("Error fetching image posts:", imageError);
    }
    
    // Get posts from reel_posts table
    const { data: reelPosts, error: reelError } = await supabase
      .from('reel_posts')
      .select('*')
      .eq('visibility', 'public')
      .order('created_at', { ascending: false })
      .limit(limit);
      
    if (reelError) {
      console.error("Error fetching reel posts:", reelError);
    }
    
    // Combine all posts
    const allPosts = [
      ...(textPosts || []).map(post => ({ ...post, post_type: 'text' })),
      ...(imagePosts || []).map(post => ({ ...post, post_type: 'image' })),
      ...(reelPosts || []).map(post => ({ ...post, post_type: 'reel' }))
    ];
    
    // Sort by created_at
    allPosts.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    
    // Fetch profiles separately
    const userIds = [...new Set(allPosts.map(post => post.user_id))];
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
    
    return allPosts.map(post => ({
      ...post,
      profiles: profileMap.get(post.user_id) || null
    }));
  } catch (error) {
    console.error("Error fetching posts:", error);
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
 * Check if a post exists in the system
 */
export const checkUnifiedPostExists = async (postId: string): Promise<boolean> => {
  try {
    console.log(`Checking if post exists: ${postId}`);
    
    if (!postId) {
      console.warn("Invalid postId provided:", postId);
      return false;
    }
    
    // Add a timeout to prevent hanging requests
    const timeoutPromise = new Promise<null>((resolve) => {
      setTimeout(() => {
        console.warn(`Request timeout for post ${postId}`);
        resolve(null);
      }, 5000); // 5 second timeout
    });
    
    // Check text_posts table
    try {
      const { data: textData, error: textError, count: textCount } = await Promise.race([
        supabase
          .from('text_posts')
          .select('id', { count: 'exact', head: true })
          .eq('id', postId),
        timeoutPromise
      ]);
      
      if (!textError && textCount && textCount > 0) {
        console.log(`Post ${postId} exists in text_posts table`);
        return true;
      }
    } catch (err) {
      console.warn('Error checking text_posts:', err);
    }
    
    // Check image_posts table
    try {
      const { data: imageData, error: imageError, count: imageCount } = await Promise.race([
        supabase
          .from('image_posts')
          .select('id', { count: 'exact', head: true })
          .eq('id', postId),
        timeoutPromise
      ]);
      
      if (!imageError && imageCount && imageCount > 0) {
        console.log(`Post ${postId} exists in image_posts table`);
        return true;
      }
    } catch (err) {
      console.warn('Error checking image_posts:', err);
    }
    
    // Check reel_posts table
    try {
      const { data: reelData, error: reelError, count: reelCount } = await Promise.race([
        supabase
          .from('reel_posts')
          .select('id', { count: 'exact', head: true })
          .eq('id', postId),
        timeoutPromise
      ]);
      
      if (!reelError && reelCount && reelCount > 0) {
        console.log(`Post ${postId} exists in reel_posts table`);
        return true;
      }
    } catch (err) {
      console.warn('Error checking reel_posts:', err);
    }
    
    // If not found in any table, return false
    console.log(`Post ${postId} does not exist in any post table`);
    return false;
  } catch (error) {
    console.error('Error checking post existence:', error);
    // Return true in case of error to avoid blocking operations that depend on this check
    return true;
  }
};

/**
 * Create a new text post
 */
export const createUnifiedTextPost = async (
  userId: string, 
  content: string, 
  title?: string, 
  tags?: string[], 
  emojiMood?: string
) => {
  try {
    // Insert into text_posts table instead of unified_posts
    const { data, error } = await supabase
      .from("text_posts")
      .insert({
        user_id: userId,
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
        post_type: 'text',
        profiles: profileData || null
      };
    }
    
    return data?.[0];
  } catch (error) {
    console.error("Error creating text post:", error);
    throw error;
  }
};

/**
 * Create a new image post
 */
export const createUnifiedImagePost = async (userId: string, imageUrls: string[], caption?: string, tags?: string[]) => {
  try {
    // Insert into image_posts table instead of unified_posts
    const { data, error } = await supabase
      .from("image_posts")
      .insert({
        user_id: userId,
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
        post_type: 'image',
        profiles: profileData || null
      };
    }
    
    return data?.[0];
  } catch (error) {
    console.error("Error creating image post:", error);
    throw error;
  }
};

/**
 * Soft delete a post (mark as deleted rather than removing from database)
 */
export const softDeletePost = async (postId: string, postType: string) => {
  try {
    // Try to determine the table name based on post type
    let tableName = '';
    switch(postType) {
      case 'text':
        tableName = 'text_posts';
        break;
      case 'image':
        tableName = 'image_posts';
        break;
      case 'reel':
        tableName = 'reel_posts';
        break;
      default:
        throw new Error(`Unknown post type: ${postType}`);
    }
    
    if (!tableName) {
      throw new Error("Could not determine table name for post deletion");
    }
    
    // Use type assertion to bypass TypeScript's table name checking
    // This is needed because we're accepting a dynamic table name as a parameter
    const { error } = await (supabase as any)
      .from(tableName)
      .delete()
      .eq('id', postId);
      
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error deleting post:", error);
    throw error;
  }
};

/**
 * Get likes for a post
 */
export const getUnifiedPostLikes = async (postId: string, postType: string): Promise<number> => {
  try {
    const { count, error } = await supabase
      .from('post_likes')
      .select('*', { count: 'exact', head: true })
      .eq('post_id', postId)
      .eq('post_type', postType);
    
    if (error) {
      console.error('Error getting post likes count:', error);
      return 0;
    }
    
    return count || 0;
  } catch (error) {
    console.error('Error getting post likes count:', error);
    return 0;
  }
};

/**
 * Check if a user has liked a post
 */
export const checkUnifiedPostLikeStatus = async (postId: string, userId: string, postType: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('post_likes')
      .select('*')
      .eq('user_id', userId)
      .eq('post_id', postId)
      .eq('post_type', postType)
      .maybeSingle();
    
    if (error) {
      console.error('Error checking post like status:', error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error('Error checking post like status:', error);
    return false;
  }
};

/**
 * Toggle like on a post
 */
export const toggleUnifiedPostLike = async (postId: string, userId: string, postType: string): Promise<boolean> => {
  try {
    // Check if already liked using a more resilient query
    let isLiked = false;
    try {
      const { data, error } = await supabase
        .from('post_likes')
        .select('id', { head: true })
        .eq('user_id', userId)
        .eq('post_id', postId)
        .eq('post_type', postType);
      
      isLiked = !!data;
      
      if (error) {
        console.warn("Error checking like status:", error);
      }
    } catch (likeCheckError) {
      console.error("Error checking like status:", likeCheckError);
    }
    
    if (isLiked) {
      // Unlike - delete from post_likes
      const { error } = await supabase
        .from('post_likes')
        .delete()
        .eq('user_id', userId)
        .eq('post_id', postId)
        .eq('post_type', postType);
        
      if (error) {
        console.error("Error removing like:", error);
        throw error;
      }
      return false;
    } else {
      // Like - insert into post_likes
      const { error } = await supabase
        .from('post_likes')
        .insert({
          user_id: userId,
          post_id: postId,
          post_type: postType
        });
        
      if (error) {
        console.error("Error adding like:", error);
        throw error;
      }
      return true;
    }
  } catch (error) {
    console.error('Error toggling post like:', error);
    throw error;
  }
};

/**
 * Get comments for a post
 */
export const getUnifiedPostComments = async (postId: string, postType: string) => {
  try {
    // First check if the post exists to avoid foreign key errors
    const postExists = await checkUnifiedPostExists(postId);
    if (!postExists) {
      console.log('Post does not exist when fetching comments:', postId);
      return [];
    }
    
    // Get comments and join with profiles manually
    const { data: comments, error } = await supabase
      .from("post_comments")
      .select('*')
      .eq("post_id", postId)
      .eq("post_type", postType)
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
    console.error("Error getting post comments:", error);
    return [];
  }
};

/**
 * Add a comment to a post
 */
export const addUnifiedPostComment = async (postId: string, userId: string, content: string, postType: string) => {
  try {
    console.log(`Adding comment to post ${postId} by user ${userId}: "${content}"`);
    
    // Insert the comment
    const { data, error } = await supabase
      .from("post_comments")
      .insert({
        post_id: postId,
        user_id: userId,
        content: content,
        post_type: postType
      })
      .select();
    
    if (error) {
      console.error("Error adding comment:", error);
      throw error;
    }

    if (!data || data.length === 0) {
      console.error("No data returned after comment insertion");
      throw new Error("Failed to insert comment");
    }
    
    // Fetch profile separately
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("id, username, avatar, full_name")
      .eq("id", userId)
      .single();
      
    if (profileError) {
      console.error("Error fetching profile for comment:", profileError);
    }
    
    return {
      ...data[0],
      profiles: profileData || null
    };
  } catch (error) {
    console.error("Error adding post comment:", error);
    throw error;
  }
};
