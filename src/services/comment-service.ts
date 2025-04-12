import { supabase } from "@/integrations/supabase/client";

// Add a comment to a post or reel
export const addComment = async (userId: string, contentId: string, content: string) => {
  try {
    // First check if the ID exists in posts_reels table
    const { data: reelCheck, error: reelCheckError } = await supabase
      .from('posts_reels')
      .select('id')
      .eq('id', contentId)
      .maybeSingle();
    
    if (reelCheckError) {
      console.error("Error checking reel existence:", reelCheckError);
      throw reelCheckError;
    }
    
    // If it's a reel, add comment to reel_comments table
    if (reelCheck) {
      const { data, error } = await supabase
        .from('reel_comments')
        .insert({
          user_id: userId,
          reel_id: contentId,
          content
        })
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      return data;
    } 
    // Otherwise it's a post, add to post_comments
    else {
      const { data, error } = await supabase
        .from('post_comments')
        .insert({
          user_id: userId,
          post_id: contentId,
          content
        })
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      return data;
    }
  } catch (error) {
    console.error("Error adding comment:", error);
    throw error;
  }
};

// Get comments for a post or reel
export const getComments = async (contentId: string) => {
  try {
    // First check if the ID exists in posts_reels table
    const { data: reelCheck, error: reelCheckError } = await supabase
      .from('posts_reels')
      .select('id')
      .eq('id', contentId)
      .maybeSingle();
    
    if (reelCheckError) {
      console.error("Error checking reel existence:", reelCheckError);
      throw reelCheckError;
    }
    
    // If it's a reel, get comments from reel_comments table
    if (reelCheck) {
      const { data, error } = await supabase
        .from("reel_comments")
        .select("*, profiles(*)")
        .eq("reel_id", contentId)
        .order("created_at", { ascending: true });
      
      if (error) {
        throw error;
      }
      
      return data;
    } 
    // Otherwise it's a post, get from post_comments
    else {
      const { data, error } = await supabase
        .from("post_comments")
        .select("*, profiles(*)")
        .eq("post_id", contentId)
        .order("created_at", { ascending: true });
      
      if (error) {
        throw error;
      }
      
      return data;
    }
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw error;
  }
};

// Delete a comment (works for both post and reel comments)
export const deleteComment = async (commentId: string, isReelComment: boolean) => {
  try {
    const table = isReelComment ? 'reel_comments' : 'post_comments';
    
    const { error } = await supabase
      .from(table)
      .delete()
      .eq('id', commentId);
    
    if (error) {
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error("Error deleting comment:", error);
    throw error;
  }
};

// Update a comment (works for both post and reel comments)
export const updateComment = async (commentId: string, content: string, isReelComment: boolean) => {
  try {
    const table = isReelComment ? 'reel_comments' : 'post_comments';
    
    const { data, error } = await supabase
      .from(table)
      .update({ content })
      .eq('id', commentId)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error("Error updating comment:", error);
    throw error;
  }
};

// Get comment count for a post or reel
export const getCommentCount = async (contentId: string) => {
  try {
    // First check if the ID exists in posts_reels table
    const { data: reelCheck, error: reelCheckError } = await supabase
      .from('posts_reels')
      .select('id')
      .eq('id', contentId)
      .maybeSingle();
    
    if (reelCheckError) {
      console.error("Error checking reel existence:", reelCheckError);
      throw reelCheckError;
    }
    
    // If it's a reel, count comments from reel_comments table
    if (reelCheck) {
      const { count, error } = await supabase
        .from('reel_comments')
        .select('id', { count: 'exact', head: true })
        .eq('reel_id', contentId);
      
      if (error) {
        throw error;
      }
      
      return count;
    } 
    // Otherwise it's a post, count from post_comments
    else {
      const { count, error } = await supabase
        .from('post_comments')
        .select('id', { count: 'exact', head: true })
        .eq('post_id', contentId);
      
      if (error) {
        throw error;
      }
      
      return count;
    }
  } catch (error) {
    console.error("Error getting comment count:", error);
    return 0;
  }
};
