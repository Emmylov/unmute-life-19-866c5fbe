import { supabase } from "@/integrations/supabase/client";
import { createSafeProfile } from "@/utils/safe-data-utils";

export interface PostComment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  post_type: string;
  profiles: {
    id: string;
    username: string | null;
    avatar: string | null;
    full_name: string | null;
  };
}

export const addComment = async (
  postId: string, 
  userId: string, 
  content: string,
  postType: string = 'text'
): Promise<PostComment | null> => {
  try {
    const { data, error } = await supabase
      .from('post_comments')
      .insert({
        post_id: postId,
        user_id: userId,
        content: content,
        post_type: postType
      })
      .select('*, profiles:user_id(id, username, avatar, full_name)')
      .single();

    if (error) {
      console.error("Error adding comment:", error);
      return null;
    }

    // Create a properly typed comment object
    const comment: PostComment = {
      id: data.id,
      post_id: data.post_id,
      user_id: data.user_id,
      content: data.content,
      created_at: data.created_at,
      post_type: data.post_type,
      profiles: createSafeProfile(data.profiles)
    };

    return comment;
  } catch (error) {
    console.error("Error adding comment:", error);
    return null;
  }
};

export const getComments = async (
  postId: string,
  postType: string = 'text'
): Promise<PostComment[]> => {
  try {
    const { data, error } = await supabase
      .from('post_comments')
      .select('*, profiles:user_id(id, username, avatar, full_name)')
      .eq('post_id', postId)
      .eq('post_type', postType)
      .eq('is_deleted', false)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error getting comments:", error);
      return [];
    }

    // Map database results to properly typed comments
    return (data || []).map(item => {
      const profiles = createSafeProfile(item.profiles);
      
      return {
        id: item.id,
        post_id: item.post_id,
        user_id: item.user_id,
        content: item.content,
        created_at: item.created_at,
        post_type: item.post_type,
        profiles: profiles
      };
    });
  } catch (error) {
    console.error("Error getting comments:", error);
    return [];
  }
};

// Additional comment-related functions can be added here
