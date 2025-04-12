
import { supabase } from "@/integrations/supabase/client";

// Get the number of comments for a reel
export const getCommentCount = async (reelId: string): Promise<number> => {
  try {
    const { count, error } = await supabase
      .from("reel_comments")
      .select("*", { count: "exact", head: true })
      .eq("reel_id", reelId);
    
    if (error) throw error;
    return count || 0;
  } catch (error) {
    console.error("Error getting comment count:", error);
    return 0;
  }
};

// Get all comments for a reel
export const getReelComments = async (reelId: string) => {
  try {
    const { data, error } = await supabase
      .from("reel_comments")
      .select(`
        *,
        profiles:user_id (
          id, username, avatar, full_name
        )
      `)
      .eq("reel_id", reelId)
      .order("created_at", { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error getting reel comments:", error);
    throw error;
  }
};

// Add a comment to a reel
export const addReelComment = async (reelId: string, userId: string, content: string) => {
  try {
    const { data, error } = await supabase
      .from("reel_comments")
      .insert({
        reel_id: reelId,
        user_id: userId,
        content: content
      })
      .select();
    
    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error("Error adding reel comment:", error);
    throw error;
  }
};

// Delete a comment
export const deleteReelComment = async (commentId: string, userId: string) => {
  try {
    // Ensure the user deleting is the creator of the comment
    const { error } = await supabase
      .from("reel_comments")
      .delete()
      .eq("id", commentId)
      .eq("user_id", userId);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error deleting reel comment:", error);
    throw error;
  }
};
