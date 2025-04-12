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
