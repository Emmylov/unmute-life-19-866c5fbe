
import { supabase } from "@/integrations/supabase/client";
import { createSafeProfile } from "@/utils/safe-data-utils";

// Define PostComment interface for typescript 
export interface PostComment {
  id: string;
  post_id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  content: string;
  post_type: string;
  is_deleted?: boolean;
  profiles?: {
    id: string;
    username: string | null;
    avatar: string | null;
    full_name: string | null;
  };
}

// Add shared comment functions
export async function addComment(
  postId: string, 
  userId: string, 
  content: string, 
  postType: string
): Promise<PostComment | null> {
  try {
    // Fix: Normalize post type to handle variations
    let normalizedPostType = postType;
    if (postType.includes('_post')) {
      normalizedPostType = postType.replace('_post', '');
    }
    
    const { data, error } = await supabase
      .from('post_comments')
      .insert({
        post_id: postId,
        user_id: userId,
        content,
        post_type: normalizedPostType
      })
      .select('*, profiles:user_id(*)')
      .single();

    if (error) {
      console.error("Error adding comment:", error);
      return null;
    }

    // Transform to expected format with safe profile
    return {
      ...data,
      profiles: data.profiles ? createSafeProfile(data.profiles) : undefined
    };
  } catch (error) {
    console.error("Error adding comment:", error);
    return null;
  }
}

export async function getComments(postId: string, postType: string): Promise<PostComment[]> {
  try {
    // Fix: Normalize post type to handle variations
    let normalizedPostType = postType;
    if (postType.includes('_post')) {
      normalizedPostType = postType.replace('_post', '');
    }
    
    const { data, error } = await supabase
      .from('post_comments')
      .select('*, profiles:user_id(*)')
      .eq('post_id', postId)
      .eq('post_type', normalizedPostType)
      .eq('is_deleted', false)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching comments:", error);
      return [];
    }

    // Transform data to ensure profiles are handled safely
    return (data || []).map(comment => ({
      ...comment,
      profiles: comment.profiles ? createSafeProfile(comment.profiles) : undefined
    }));
  } catch (error) {
    console.error("Error fetching comments:", error);
    return [];
  }
}

export async function deleteComment(commentId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('post_comments')
      .update({ is_deleted: true })
      .eq('id', commentId);

    if (error) {
      console.error("Error deleting comment:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error deleting comment:", error);
    return false;
  }
}

// Add aliases for reel-specific functions for backwards compatibility
export const addReelComment = addComment;
export const getReelComments = getComments;
export const deleteReelComment = deleteComment;
