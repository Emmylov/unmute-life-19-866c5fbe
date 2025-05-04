import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { DatabaseReel } from '@/types/reels';

// Find the problematic function(s) with string arguments that should be specific types
// For instance, if there's a function like:

export const softDeletePost = async (postId: string, postType: string) => {
  // Instead of using dynamic table names that could cause type issues:
  // const { data, error } = await supabase.from(postType).update(...)
  
  // Use explicit table names based on the post type:
  if (postType === 'text_posts') {
    const { data, error } = await supabase
      .from('text_posts')
      .update({ is_deleted: true })
      .eq('id', postId);
    return { data, error };
  } else if (postType === 'image_posts') {
    const { data, error } = await supabase
      .from('image_posts')
      .update({ is_deleted: true })
      .eq('id', postId);
    return { data, error };
  } else if (postType === 'reel_posts') {
    const { data, error } = await supabase
      .from('reel_posts')
      .update({ is_deleted: true })
      .eq('id', postId);
    return { data, error };
  } else if (postType === 'meme_posts') {
    const { data, error } = await supabase
      .from('meme_posts')
      .update({ is_deleted: true })
      .eq('id', postId);
    return { data, error };
  } else {
    return { data: null, error: new Error('Invalid post type') };
  }
};

export const getPostById = async (postId: string, postType: string) => {
  try {
    if (postType === 'text_posts') {
      const { data, error } = await supabase
        .from('text_posts')
        .select('*, profiles:user_id(*)')
        .eq('id', postId)
        .single();
      
      if (error) throw error;
      return { data, error: null };
    } else if (postType === 'image_posts') {
      const { data, error } = await supabase
        .from('image_posts')
        .select('*, profiles:user_id(*)')
        .eq('id', postId)
        .single();
      
      if (error) throw error;
      return { data, error: null };
    } else if (postType === 'reel_posts') {
      const { data, error } = await supabase
        .from('reel_posts')
        .select('*, profiles:user_id(*)')
        .eq('id', postId)
        .single();
      
      if (error) throw error;
      return { data, error: null };
    } else if (postType === 'meme_posts') {
      const { data, error } = await supabase
        .from('meme_posts')
        .select('*, profiles:user_id(*)')
        .eq('id', postId)
        .single();
      
      if (error) throw error;
      return { data, error: null };
    } else {
      return { data: null, error: new Error('Invalid post type') };
    }
  } catch (error) {
    console.error('Error fetching post:', error);
    return { data: null, error };
  }
};

export const likePost = async (postId: string, postType: string, userId: string) => {
  try {
    // First check if the like already exists
    const { data: existingLike, error: checkError } = await supabase
      .from('likes')
      .select('*')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .eq('post_type', postType)
      .single();
    
    if (checkError && checkError.code !== 'PGRST116') {
      // PGRST116 means no rows returned, which is expected if the user hasn't liked the post
      throw checkError;
    }
    
    if (existingLike) {
      // User already liked the post, so we'll unlike it
      const { error: unlikeError } = await supabase
        .from('likes')
        .delete()
        .eq('id', existingLike.id);
      
      if (unlikeError) throw unlikeError;
      
      // Decrement the likes count in the post table
      let updateTable = '';
      switch (postType) {
        case 'text_post':
          updateTable = 'text_posts';
          break;
        case 'image_post':
          updateTable = 'image_posts';
          break;
        case 'reel_post':
          updateTable = 'reel_posts';
          break;
        case 'meme_post':
          updateTable = 'meme_posts';
          break;
        default:
          throw new Error('Invalid post type');
      }
      
      const { error: updateError } = await supabase.rpc('decrement_likes_count', {
        p_table_name: updateTable,
        p_post_id: postId
      });
      
      if (updateError) throw updateError;
      
      return { liked: false, error: null };
    } else {
      // User hasn't liked the post, so we'll add a like
      const { error: likeError } = await supabase
        .from('likes')
        .insert({
          id: uuidv4(),
          post_id: postId,
          user_id: userId,
          post_type: postType,
          created_at: new Date().toISOString()
        });
      
      if (likeError) throw likeError;
      
      // Increment the likes count in the post table
      let updateTable = '';
      switch (postType) {
        case 'text_post':
          updateTable = 'text_posts';
          break;
        case 'image_post':
          updateTable = 'image_posts';
          break;
        case 'reel_post':
          updateTable = 'reel_posts';
          break;
        case 'meme_post':
          updateTable = 'meme_posts';
          break;
        default:
          throw new Error('Invalid post type');
      }
      
      const { error: updateError } = await supabase.rpc('increment_likes_count', {
        p_table_name: updateTable,
        p_post_id: postId
      });
      
      if (updateError) throw updateError;
      
      return { liked: true, error: null };
    }
  } catch (error) {
    console.error('Error toggling like:', error);
    return { liked: false, error };
  }
};

export const checkIfUserLikedPost = async (postId: string, postType: string, userId: string) => {
  try {
    const { data, error } = await supabase
      .from('likes')
      .select('*')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .eq('post_type', postType)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned, user hasn't liked the post
        return { liked: false, error: null };
      }
      throw error;
    }
    
    return { liked: true, error: null };
  } catch (error) {
    console.error('Error checking if user liked post:', error);
    return { liked: false, error };
  }
};

export const savePost = async (postId: string, postType: string, userId: string) => {
  try {
    // First check if the post is already saved
    const { data: existingSave, error: checkError } = await supabase
      .from('saved_posts')
      .select('*')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .eq('post_type', postType)
      .single();
    
    if (checkError && checkError.code !== 'PGRST116') {
      // PGRST116 means no rows returned, which is expected if the user hasn't saved the post
      throw checkError;
    }
    
    if (existingSave) {
      // User already saved the post, so we'll unsave it
      const { error: unsaveError } = await supabase
        .from('saved_posts')
        .delete()
        .eq('id', existingSave.id);
      
      if (unsaveError) throw unsaveError;
      
      return { saved: false, error: null };
    } else {
      // User hasn't saved the post, so we'll save it
      const { error: saveError } = await supabase
        .from('saved_posts')
        .insert({
          id: uuidv4(),
          post_id: postId,
          user_id: userId,
          post_type: postType,
          created_at: new Date().toISOString()
        });
      
      if (saveError) throw saveError;
      
      return { saved: true, error: null };
    }
  } catch (error) {
    console.error('Error toggling save:', error);
    return { saved: false, error };
  }
};

export const checkIfUserSavedPost = async (postId: string, postType: string, userId: string) => {
  try {
    const { data, error } = await supabase
      .from('saved_posts')
      .select('*')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .eq('post_type', postType)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned, user hasn't saved the post
        return { saved: false, error: null };
      }
      throw error;
    }
    
    return { saved: true, error: null };
  } catch (error) {
    console.error('Error checking if user saved post:', error);
    return { saved: false, error };
  }
};

export const addComment = async (postId: string, postType: string, userId: string, content: string) => {
  try {
    const commentId = uuidv4();
    
    const { error } = await supabase
      .from('comments')
      .insert({
        id: commentId,
        post_id: postId,
        user_id: userId,
        post_type: postType,
        content,
        created_at: new Date().toISOString()
      });
    
    if (error) throw error;
    
    // Increment the comments count in the post table
    let updateTable = '';
    switch (postType) {
      case 'text_post':
        updateTable = 'text_posts';
        break;
      case 'image_post':
        updateTable = 'image_posts';
        break;
      case 'reel_post':
        updateTable = 'reel_posts';
        break;
      case 'meme_post':
        updateTable = 'meme_posts';
        break;
      default:
        throw new Error('Invalid post type');
    }
    
    const { error: updateError } = await supabase.rpc('increment_comments_count', {
      p_table_name: updateTable,
      p_post_id: postId
    });
    
    if (updateError) throw updateError;
    
    // Fetch the newly created comment with user data
    const { data: newComment, error: fetchError } = await supabase
      .from('comments')
      .select('*, profiles:user_id(*)')
      .eq('id', commentId)
      .single();
    
    if (fetchError) throw fetchError;
    
    return { comment: newComment, error: null };
  } catch (error) {
    console.error('Error adding comment:', error);
    return { comment: null, error };
  }
};

export const getComments = async (postId: string, postType: string, limit = 10, offset = 0) => {
  try {
    const { data, error, count } = await supabase
      .from('comments')
      .select('*, profiles:user_id(*)', { count: 'exact' })
      .eq('post_id', postId)
      .eq('post_type', postType)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (error) throw error;
    
    return { comments: data, count, error: null };
  } catch (error) {
    console.error('Error fetching comments:', error);
    return { comments: [], count: 0, error };
  }
};

export const deleteComment = async (commentId: string, postId: string, postType: string) => {
  try {
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId);
    
    if (error) throw error;
    
    // Decrement the comments count in the post table
    let updateTable = '';
    switch (postType) {
      case 'text_post':
        updateTable = 'text_posts';
        break;
      case 'image_post':
        updateTable = 'image_posts';
        break;
      case 'reel_post':
        updateTable = 'reel_posts';
        break;
      case 'meme_post':
        updateTable = 'meme_posts';
        break;
      default:
        throw new Error('Invalid post type');
    }
    
    const { error: updateError } = await supabase.rpc('decrement_comments_count', {
      p_table_name: updateTable,
      p_post_id: postId
    });
    
    if (updateError) throw updateError;
    
    return { success: true, error: null };
  } catch (error) {
    console.error('Error deleting comment:', error);
    return { success: false, error };
  }
};

export const reportPost = async (postId: string, postType: string, userId: string, reason: string) => {
  try {
    const { error } = await supabase
      .from('reports')
      .insert({
        id: uuidv4(),
        post_id: postId,
        user_id: userId,
        post_type: postType,
        reason,
        created_at: new Date().toISOString()
      });
    
    if (error) throw error;
    
    toast.success('Report submitted successfully');
    return { success: true, error: null };
  } catch (error) {
    console.error('Error reporting post:', error);
    toast.error('Failed to submit report');
    return { success: false, error };
  }
};

export const sharePost = async (postId: string, postType: string, userId: string, sharedWithUserId: string) => {
  try {
    const { error } = await supabase
      .from('shares')
      .insert({
        id: uuidv4(),
        post_id: postId,
        user_id: userId,
        shared_with_user_id: sharedWithUserId,
        post_type: postType,
        created_at: new Date().toISOString()
      });
    
    if (error) throw error;
    
    // Increment the shares count in the post table
    let updateTable = '';
    switch (postType) {
      case 'text_post':
        updateTable = 'text_posts';
        break;
      case 'image_post':
        updateTable = 'image_posts';
        break;
      case 'reel_post':
        updateTable = 'reel_posts';
        break;
      case 'meme_post':
        updateTable = 'meme_posts';
        break;
      default:
        throw new Error('Invalid post type');
    }
    
    const { error: updateError } = await supabase.rpc('increment_shares_count', {
      p_table_name: updateTable,
      p_post_id: postId
    });
    
    if (updateError) throw updateError;
    
    toast.success('Post shared successfully');
    return { success: true, error: null };
  } catch (error) {
    console.error('Error sharing post:', error);
    toast.error('Failed to share post');
    return { success: false, error };
  }
};

export const getPostStats = async (postId: string, postType: string) => {
  try {
    // Get likes count
    const { count: likesCount, error: likesError } = await supabase
      .from('likes')
      .select('*', { count: 'exact' })
      .eq('post_id', postId)
      .eq('post_type', postType);
    
    if (likesError) throw likesError;
    
    // Get comments count
    const { count: commentsCount, error: commentsError } = await supabase
      .from('comments')
      .select('*', { count: 'exact' })
      .eq('post_id', postId)
      .eq('post_type', postType);
    
    if (commentsError) throw commentsError;
    
    // Get shares count
    const { count: sharesCount, error: sharesError } = await supabase
      .from('shares')
      .select('*', { count: 'exact' })
      .eq('post_id', postId)
      .eq('post_type', postType);
    
    if (sharesError) throw sharesError;
    
    return {
      stats: {
        likes: likesCount || 0,
        comments: commentsCount || 0,
        shares: sharesCount || 0
      },
      error: null
    };
  } catch (error) {
    console.error('Error fetching post stats:', error);
    return {
      stats: {
        likes: 0,
        comments: 0,
        shares: 0
      },
      error
    };
  }
};

export const updatePostVisibility = async (postId: string, postType: string, visibility: string) => {
  try {
    let tableName = '';
    switch (postType) {
      case 'text_post':
        tableName = 'text_posts';
        break;
      case 'image_post':
        tableName = 'image_posts';
        break;
      case 'reel_post':
        tableName = 'reel_posts';
        break;
      case 'meme_post':
        tableName = 'meme_posts';
        break;
      default:
        throw new Error('Invalid post type');
    }
    
    const { error } = await supabase
      .from(tableName)
      .update({ visibility })
      .eq('id', postId);
    
    if (error) throw error;
    
    return { success: true, error: null };
  } catch (error) {
    console.error('Error updating post visibility:', error);
    return { success: false, error };
  }
};

export const getPostsByUser = async (userId: string, postType: string, limit = 10, offset = 0) => {
  try {
    let tableName = '';
    switch (postType) {
      case 'text_post':
        tableName = 'text_posts';
        break;
      case 'image_post':
        tableName = 'image_posts';
        break;
      case 'reel_post':
        tableName = 'reel_posts';
        break;
      case 'meme_post':
        tableName = 'meme_posts';
        break;
      default:
        throw new Error('Invalid post type');
    }
    
    const { data, error, count } = await supabase
      .from(tableName)
      .select('*, profiles:user_id(*)', { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (error) throw error;
    
    return { posts: data, count, error: null };
  } catch (error) {
    console.error(`Error fetching ${postType}s by user:`, error);
    return { posts: [], count: 0, error };
  }
};

export const getAllPostsByUser = async (userId: string, limit = 10, offset = 0) => {
  try {
    // Fetch posts from all tables
    const [textPosts, imagePosts, reelPosts, memePosts] = await Promise.all([
      supabase
        .from('text_posts')
        .select('*, profiles:user_id(*)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false }),
      supabase
        .from('image_posts')
        .select('*, profiles:user_id(*)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false }),
      supabase
        .from('reel_posts')
        .select('*, profiles:user_id(*)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false }),
      supabase
        .from('meme_posts')
        .select('*, profiles:user_id(*)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
    ]);
    
    // Check for errors
    if (textPosts.error) throw textPosts.error;
    if (imagePosts.error) throw imagePosts.error;
    if (reelPosts.error) throw reelPosts.error;
    if (memePosts.error) throw memePosts.error;
    
    // Combine all posts and add a type field
    const allPosts = [
      ...(textPosts.data || []).map(post => ({ ...post, postType: 'text_post' })),
      ...(imagePosts.data || []).map(post => ({ ...post, postType: 'image_post' })),
      ...(reelPosts.data || []).map(post => ({ ...post, postType: 'reel_post' })),
      ...(memePosts.data || []).map(post => ({ ...post, postType: 'meme_post' }))
    ];
    
    // Sort by created_at
    allPosts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    
    // Apply pagination
    const paginatedPosts = allPosts.slice(offset, offset + limit);
    
    return { posts: paginatedPosts, count: allPosts.length, error: null };
  } catch (error) {
    console.error('Error fetching all posts by user:', error);
    return { posts: [], count: 0, error };
  }
};

export const getSavedPostsByUser = async (userId: string, limit = 10, offset = 0) => {
  try {
    // Get saved post IDs with their types
    const { data: savedPosts, error: savedError } = await supabase
      .from('saved_posts')
      .select('post_id, post_type')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (savedError) throw savedError;
    
    if (!savedPosts || savedPosts.length === 0) {
      return { posts: [], count: 0, error: null };
    }
    
    // Group saved posts by type
    const postsByType: Record<string, string[]> = {
      text_post: [],
      image_post: [],
      reel_post: [],
      meme_post: []
    };
    
    savedPosts.forEach(post => {
      if (postsByType[post.post_type]) {
        postsByType[post.post_type].push(post.post_id);
      }
    });
    
    // Fetch actual posts for each type
    const fetchPromises = [];
    
    if (postsByType.text_post.length > 0) {
      fetchPromises.push(
        supabase
          .from('text_posts')
          .select('*, profiles:user_id(*)')
          .in('id', postsByType.text_post)
          .then(result => result.data?.map(post => ({ ...post, postType: 'text_post' })) || [])
      );
    }
    
    if (postsByType.image_post.length > 0) {
      fetchPromises.push(
        supabase
          .from('image_posts')
          .select('*, profiles:user_id(*)')
          .in('id', postsByType.image_post)
          .then(result => result.data?.map(post => ({ ...post, postType: 'image_post' })) || [])
      );
    }
    
    if (postsByType.reel_post.length > 0) {
      fetchPromises.push(
        supabase
          .from('reel_posts')
          .select('*, profiles:user_id(*)')
          .in('id', postsByType.reel_post)
          .then(result => result.data?.map(post => ({ ...post, postType: 'reel_post' })) || [])
      );
    }
    
    if (postsByType.meme_post.length > 0) {
      fetchPromises.push(
        supabase
          .from('meme_posts')
          .select('*, profiles:user_id(*)')
          .in('id', postsByType.meme_post)
          .then(result => result.data?.map(post => ({ ...post, postType: 'meme_post' })) || [])
      );
    }
    
    // Wait for all fetches to complete
    const fetchedPostsArrays = await Promise.all(fetchPromises);
    
    // Flatten the arrays
    const fetchedPosts = fetchedPostsArrays.flat();
    
    // Create a map of post IDs to their order in the saved_posts array
    const postOrderMap = new Map();
    savedPosts.forEach((post, index) => {
      postOrderMap.set(post.post_id, index);
    });
    
    // Sort fetched posts according to the original saved order
    fetchedPosts.sort((a, b) => {
      const orderA = postOrderMap.get(a.id) || 0;
      const orderB = postOrderMap.get(b.id) || 0;
      return orderA - orderB;
    });
    
    // Get total count of saved posts
    const { count, error: countError } = await supabase
      .from('saved_posts')
      .select('*', { count: 'exact' })
      .eq('user_id', userId);
    
    if (countError) throw countError;
    
    return { posts: fetchedPosts, count: count || 0, error: null };
  } catch (error) {
    console.error('Error fetching saved posts:', error);
    return { posts: [], count: 0, error };
  }
};

export const getFeedPosts = async (userId: string, limit = 10, offset = 0) => {
  try {
    // Get users that the current user follows
    const { data: followingData, error: followingError } = await supabase
      .from('follows')
      .select('following_id')
      .eq('follower_id', userId);
    
    if (followingError) throw followingError;
    
    // If user doesn't follow anyone, return empty array
    if (!followingData || followingData.length === 0) {
      return { posts: [], count: 0, error: null };
    }
    
    const followingIds = followingData.map(follow => follow.following_id);
    
    // Add the user's own ID to see their own posts in the feed
    followingIds.push(userId);
    
    // Fetch posts from all tables for the followed users
    const [textPosts, imagePosts, reelPosts, memePosts] = await Promise.all([
      supabase
        .from('text_posts')
        .select('*, profiles:user_id(*)')
        .in('user_id', followingIds)
        .order('created_at', { ascending: false }),
      supabase
        .from('image_posts')
        .select('*, profiles:user_id(*)')
        .in('user_id', followingIds)
        .order('created_at', { ascending: false }),
      supabase
        .from('reel_posts')
        .select('*, profiles:user_id(*)')
        .in('user_id', followingIds)
        .order('created_at', { ascending: false }),
      supabase
        .from('meme_posts')
        .select('*, profiles:user_id(*)')
        .in('user_id', followingIds)
        .order('created_at', { ascending: false })
    ]);
    
    // Check for errors
    if (textPosts.error) throw textPosts.error;
    if (imagePosts.error) throw imagePosts.error;
    if (reelPosts.error) throw reelPosts.error;
    if (memePosts.error) throw memePosts.error;
    
    // Combine all posts and add a type field
    const allPosts = [
      ...(textPosts.data || []).map(post => ({ ...post, postType: 'text_post' })),
      ...(imagePosts.data || []).map(post => ({ ...post, postType: 'image_post' })),
      ...(reelPosts.data || []).map(post => ({ ...post, postType: 'reel_post' })),
      ...(memePosts.data || []).map(post => ({ ...post, postType: 'meme_post' }))
    ];
    
    // Sort by created_at
    allPosts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    
    // Apply pagination
    const paginatedPosts = allPosts.slice(offset, offset + limit);
    
    return { posts: paginatedPosts, count: allPosts.length, error: null };
  } catch (error) {
    console.error('Error fetching feed posts:', error);
    return { posts: [], count: 0, error };
  }
};

export const getExplorePosts = async (limit = 10, offset = 0) => {
  try {
    // Fetch popular posts from all tables
    const [textPosts, imagePosts, reelPosts, memePosts] = await Promise.all([
      supabase
        .from('text_posts')
        .select('*, profiles:user_id(*)')
        .eq('visibility', 'public')
        .order('likes_count', { ascending: false })
        .limit(limit),
      supabase
        .from('image_posts')
        .select('*, profiles:user_id(*)')
        .eq('visibility', 'public')
        .order('likes_count', { ascending: false })
        .limit(limit),
      supabase
        .from('reel_posts')
        .select('*, profiles:user_id(*)')
        .eq('visibility', 'public')
        .order('likes_count', { ascending: false })
        .limit(limit),
      supabase
        .from('meme_posts')
        .select('*, profiles:user_id(*)')
        .eq('visibility', 'public')
        .order('likes_count', { ascending: false })
        .limit(limit)
    ]);
    
    // Check for errors
    if (textPosts.error) throw textPosts.error;
    if (imagePosts.error) throw imagePosts.error;
    if (reelPosts.error) throw reelPosts.error;
    if (memePosts.error) throw memePosts.error;
    
    // Combine all posts and add a type field
    const allPosts = [
      ...(textPosts.data || []).map(post => ({ ...post, postType: 'text_post' })),
      ...(imagePosts.data || []).map(post => ({ ...post, postType: 'image_post' })),
      ...(reelPosts.data || []).map(post => ({ ...post, postType: 'reel_post' })),
      ...(memePosts.data || []).map(post => ({ ...post, postType: 'meme_post' }))
    ];
    
    // Sort by likes_count
    allPosts.sort((a, b) => (b.likes_count || 0) - (a.likes_count || 0));
    
    // Apply pagination
    const paginatedPosts = allPosts.slice(offset, offset + limit);
    
    return { posts: paginatedPosts, count: allPosts.length, error: null };
  } catch (error) {
    console.error('Error fetching explore posts:', error);
    return { posts: [], count: 0, error };
  }
};

export const searchPosts = async (query: string, limit = 10, offset = 0) => {
  try {
    // Search in all post tables
    const [textPosts, imagePosts, reelPosts, memePosts] = await Promise.all([
      supabase
        .from('text_posts')
        .select('*, profiles:user_id(*)')
        .eq('visibility', 'public')
        .ilike('content', `%${query}%`)
        .order('created_at', { ascending: false })
        .limit(limit),
      supabase
        .from('image_posts')
        .select('*, profiles:user_id(*)')
        .eq('visibility', 'public')
        .ilike('caption', `%${query}%`)
        .order('created_at', { ascending: false })
        .limit(limit),
      supabase
        .from('reel_posts')
        .select('*, profiles:user_id(*)')
        .eq('visibility', 'public')
        .ilike('caption', `%${query}%`)
        .order('created_at', { ascending: false })
        .limit(limit),
      supabase
        .from('meme_posts')
        .select('*, profiles:user_id(*)')
        .eq('visibility', 'public')
        .ilike('caption', `%${query}%`)
        .order('created_at', { ascending: false })
        .limit(limit)
    ]);
    
    // Check for errors
    if (textPosts.error) throw textPosts.error;
    if (imagePosts.error) throw imagePosts.error;
    if (reelPosts.error) throw reelPosts.error;
    if (memePosts.error) throw memePosts.error;
    
    // Combine all posts and add a type field
    const allPosts = [
      ...(textPosts.data || []).map(post => ({ ...post, postType: 'text_post' })),
      ...(imagePosts.data || []).map(post => ({ ...post, postType: 'image_post' })),
      ...(reelPosts.data || []).map(post => ({ ...post, postType: 'reel_post' })),
      ...(memePosts.data || []).map(post => ({ ...post, postType: 'meme_post' }))
    ];
    
    // Sort by created_at
    allPosts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    
    // Apply pagination
    const paginatedPosts = allPosts.slice(offset, offset + limit);
    
    return { posts: paginatedPosts, count: allPosts.length, error: null };
  } catch (error) {
    console.error('Error searching posts:', error);
    return { posts: [], count: 0, error };
  }
};

export const safeConvertToPost = (post: any, postType: string): any => {
  if (!post) return null;
  
  switch (postType) {
    case 'text_post':
      return {
        id: post.id || '',
        user_id: post.user_id || '',
        created_at: post.created_at || new Date().toISOString(),
        content: post.content || '',
        title: post.title || '',
        // Include other properties as needed
        postType: 'text_post'
      };
      
    case 'image_post':
      return {
        id: post.id || '',
        user_id: post.user_id || '',
        created_at: post.created_at || new Date().toISOString(),
        image_urls: Array.isArray(post.image_urls) ? post.image_urls : [],
        // Include other properties as needed
        postType: 'image_post'
      };
      
    case 'reel_post':
      return {
        id: post.id || '',
        user_id: post.user_id || '',
        created_at: post.created_at || new Date().toISOString(),
        video_url: post.video_url || '',
        // Include other properties as needed
        postType: 'reel_post'
      };
      
    case 'meme_post':
      return {
        id: post.id || '',
        user_id: post.user_id || '',
        created_at: post.created_at || new Date().toISOString(),
        image_url: post.image_url || '',
        // Include other properties as needed
        postType: 'meme_post'
      };
      
    default:
      return { ...post, postType: 'unknown' };
  }
};
