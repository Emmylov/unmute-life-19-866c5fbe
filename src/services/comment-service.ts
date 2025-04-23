
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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

// Interface for profile information
interface Profile {
  id: string;
  username: string | null;
  avatar: string | null;
  full_name: string | null;
}

// Interface for comment with profile
interface CommentWithProfile {
  id: string;
  reel_id: string;
  user_id: string;
  content: string;
  created_at: string;
  profiles: Profile;
}

// Interface for basic comment
interface BasicComment {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
}

// Return type for addReelComment
export type ReelCommentResponse = CommentWithProfile | BasicComment;

// Add a comment to a reel
export const addReelComment = async (reelId: string, userId: string, content: string): Promise<ReelCommentResponse> => {
  try {
    // First verify if the reel exists in posts_reels table
    const { data: reelExists } = await supabase
      .from("posts_reels")
      .select("id")
      .eq("id", reelId)
      .maybeSingle();
      
    if (!reelExists) {
      toast.error("Could not find this reel");
      throw new Error("Reel not found");
    }
    
    // Use the edge function to add the comment
    const response = await supabase.functions.invoke<{ id: string, success: boolean }>(
      'add-reel-comment',
      {
        body: { 
          reelId, 
          userId,
          content,
          createdAt: new Date().toISOString()
        }
      }
    );
    
    if (!response.data?.success) {
      console.error("Error adding reel comment via function:", response.error);
      
      // Fallback: Try direct insertion if function fails
      const { data: directInsert, error: directError } = await supabase
        .from("reel_comments")
        .insert({
          reel_id: reelId,
          user_id: userId,
          content: content,
          created_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (directError) throw directError;
      
      // Return basic comment data without profile
      return { 
        id: directInsert.id, 
        user_id: userId, 
        content, 
        created_at: directInsert.created_at 
      };
    }
    
    // Return comment data with additional user profile info
    const { data: commentWithProfile, error: profileError } = await supabase
      .from("reel_comments")
      .select(`
        *,
        profiles:user_id (
          id, username, avatar, full_name
        )
      `)
      .eq("id", response.data.id)
      .single();
    
    if (profileError) {
      console.error("Error fetching comment with profile:", profileError);
      // Return a basic comment object if we can't fetch the profile
      return { 
        id: response.data.id, 
        user_id: userId, 
        content, 
        created_at: new Date().toISOString() 
      };
    }
    
    return commentWithProfile as CommentWithProfile;
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

// Generic comment functions for backward compatibility
export const addComment = async (postId: string, userId: string, content: string) => {
  try {
    const { data, error } = await supabase
      .from("post_comments")
      .insert({
        post_id: postId,
        user_id: userId,
        content: content
      })
      .select();
    
    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error("Error adding comment:", error);
    throw error;
  }
};

export const getComments = async (postId: string) => {
  try {
    const { data, error } = await supabase
      .from("post_comments")
      .select(`
        *,
        profiles:user_id (
          id, username, avatar, full_name
        )
      `)
      .eq("post_id", postId)
      .order("created_at", { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error getting comments:", error);
    return [];
  }
};
