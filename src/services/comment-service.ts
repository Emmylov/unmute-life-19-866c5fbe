
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Check if a post exists in any table
export const checkPostExists = async (postId: string, postTypeParam: string): Promise<boolean> => {
  try {
    const postType = postTypeParam || 'text'; // Default to text if no type provided
    
    switch (postType) {
      case 'text':
        const { data: textPost, error: textPostError } = await supabase
          .from('text_posts')
          .select('id')
          .eq('id', postId)
          .maybeSingle();
        
        if (!textPostError && textPost) {
          return true;
        }
        break;
      
      case 'image':
        const { data: imagePost, error: imagePostError } = await supabase
          .from('image_posts')
          .select('id')
          .eq('id', postId)
          .maybeSingle();
        
        if (!imagePostError && imagePost) {
          return true;
        }
        break;
      
      case 'meme':
        const { data: memePost, error: memePostError } = await supabase
          .from('meme_posts')
          .select('id')
          .eq('id', postId)
          .maybeSingle();
        
        if (!memePostError && memePost) {
          return true;
        }
        break;
      
      case 'reel':
        const { data: reelPost, error: reelPostError } = await supabase
          .from('reel_posts')
          .select('id')
          .eq('id', postId)
          .maybeSingle();
        
        if (!reelPostError && reelPost) {
          return true;
        }
        break;
    }
    
    return false;
  } catch (error) {
    console.error('Error checking post existence:', error);
    return false;
  }
};

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
    console.log("Fetching comments for reel:", reelId);
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
    
    if (error) {
      console.error("Error getting reel comments:", error);
      throw error;
    }
    
    console.log("Retrieved reel comments:", data);
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
    console.log("Adding comment to reel:", reelId, userId, content);
    
    // First verify if the reel exists in reel_posts table
    const { data: reelExists } = await supabase
      .from("reel_posts")
      .select("id")
      .eq("id", reelId)
      .maybeSingle();
      
    if (!reelExists) {
      console.error("Reel not found:", reelId);
      toast.error("Could not find this reel");
      throw new Error("Reel not found");
    }
    
    // Try direct insertion first - this is more reliable
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
    
    if (directError) {
      console.error("Direct insertion error:", directError);
      
      // Try using the edge function if direct insertion fails
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
        throw new Error("Failed to add comment");
      }
      
      // If function succeeds, fetch the comment data
      const { data: commentData, error: fetchError } = await supabase
        .from("reel_comments")
        .select(`
          *,
          profiles:user_id (
            id, username, avatar, full_name
          )
        `)
        .eq("id", response.data.id)
        .single();
        
      if (fetchError) {
        console.error("Error fetching comment after function insertion:", fetchError);
        // Return basic data
        return { 
          id: response.data.id, 
          user_id: userId, 
          content, 
          created_at: new Date().toISOString() 
        };
      }
      
      return commentData as CommentWithProfile;
    }
    
    // If direct insertion succeeds, fetch profile data
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("id, username, avatar, full_name")
      .eq("id", userId)
      .single();
      
    if (profileError) {
      console.error("Error fetching profile for comment:", profileError);
      // Return without profile data
      return directInsert;
    }
    
    // Return complete data with profile
    return {
      ...directInsert,
      profiles: profileData
    } as CommentWithProfile;
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

// Generic comment types for all post types
export interface PostComment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  post_type: string;
  profiles?: {
    id: string;
    username: string | null;
    avatar: string | null;
    full_name: string | null;
  };
}

// Generic comment functions for backward compatibility
export const addComment = async (postId: string, userId: string, content: string, postTypeParam?: string) => {
  try {
    console.log(`Adding comment to post ${postId} by user ${userId}: "${content}"`);
    
    // Use provided postType or default to 'text'
    const postType = postTypeParam || 'text';
    
    // First verify the post exists
    const postExists = await checkPostExists(postId, postType);
    
    if (!postExists) {
      toast.error("This post is no longer available");
      throw new Error("Post not found");
    }
    
    // If post exists, add the comment using a direct approach without foreign key constraint
    const { data, error } = await supabase
      .from("post_comments")
      .insert({
        post_id: postId,
        user_id: userId,
        content: content,
        post_type: postType
      })
      .select(`
        *,
        profiles:user_id (
          id, username, avatar, full_name
        )
      `)
      .single();
    
    if (error) {
      console.error("Error inserting comment:", error);
      throw error;
    }
    
    console.log("Comment added successfully:", data);
    return data;
  } catch (error) {
    console.error("Error adding comment:", error);
    throw error;
  }
};

export const getComments = async (postId: string, postTypeParam?: string) => {
  try {
    console.log("Fetching comments for post:", postId);
    
    // Use provided postType or default to 'text'
    const postType = postTypeParam || 'text';
    
    // First check if the post exists
    const postExists = await checkPostExists(postId, postType);
    
    if (!postExists) {
      console.log("Post not found when getting comments:", postId);
      return [];
    }
    
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
    
    if (error) {
      console.error("Error fetching comments:", error);
      throw error;
    }
    
    console.log("Retrieved comments:", data?.length || 0);
    return data || [];
  } catch (error) {
    console.error("Error getting comments:", error);
    return [];
  }
};
