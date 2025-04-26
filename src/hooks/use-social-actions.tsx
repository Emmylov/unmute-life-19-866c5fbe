
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export const useSocialActions = () => {
  const { user } = useAuth();
  const [loadingFollowState, setLoadingFollowState] = useState<Record<string, boolean>>({});
  const [isLiking, setIsLiking] = useState<Record<string, boolean>>({});
  
  // Toggle following a user
  const toggleFollow = useCallback(async (userId: string): Promise<boolean> => {
    if (!user) {
      toast.error('Please sign in to follow users');
      return false;
    }
    
    try {
      setLoadingFollowState(prev => ({ ...prev, [userId]: true }));
      
      // Check if already following
      const { data, error: checkError } = await supabase
        .from('user_follows')
        .select('*')
        .eq('follower_id', user.id)
        .eq('following_id', userId)
        .maybeSingle();
        
      if (checkError) throw checkError;
      
      if (data) {
        // Unfollow
        const { error: unfollowError } = await supabase
          .from('user_follows')
          .delete()
          .eq('follower_id', user.id)
          .eq('following_id', userId);
          
        if (unfollowError) throw unfollowError;
        
        toast.success('Unfollowed user');
        return false;
      } else {
        // Follow
        const { error: followError } = await supabase
          .from('user_follows')
          .insert({
            follower_id: user.id,
            following_id: userId
          });
          
        if (followError) throw followError;
        
        toast.success('Following user');
        return true;
      }
    } catch (error: any) {
      toast.error('Error updating follow status');
      console.error('Error toggling follow:', error);
      return false;
    } finally {
      setLoadingFollowState(prev => ({ ...prev, [userId]: false }));
    }
  }, [user]);
  
  // Check if following a user
  const checkFollowStatus = useCallback(async (userId: string): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const { data, error } = await supabase
        .from('user_follows')
        .select('*')
        .eq('follower_id', user.id)
        .eq('following_id', userId)
        .maybeSingle();
        
      if (error) throw error;
      return !!data;
    } catch (error) {
      console.error('Error checking follow status:', error);
      return false;
    }
  }, [user]);

  // Check if a post exists in any post table
  const checkPostExists = useCallback(async (postId: string): Promise<boolean> => {
    try {
      // Check in main posts table
      const { data: mainPost, error: mainPostError } = await supabase
        .from('posts')
        .select('id')
        .eq('id', postId)
        .maybeSingle();
          
      if (!mainPostError && mainPost) {
        return true;
      }
      
      // Check in posts_text table
      const { data: textPost, error: textPostError } = await supabase
        .from('posts_text')
        .select('id')
        .eq('id', postId)
        .maybeSingle();
          
      if (!textPostError && textPost) {
        return true;
      }
      
      // Check in posts_images table
      const { data: imagePost, error: imagePostError } = await supabase
        .from('posts_images')
        .select('id')
        .eq('id', postId)
        .maybeSingle();
          
      if (!imagePostError && imagePost) {
        return true;
      }
      
      // Check in posts_memes table
      const { data: memePost, error: memePostError } = await supabase
        .from('posts_memes')
        .select('id')
        .eq('id', postId)
        .maybeSingle();
          
      if (!memePostError && memePost) {
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error checking post existence:', error);
      return false;
    }
  }, []);

  // Toggle like on a post
  const toggleLikePost = useCallback(async (postId: string): Promise<boolean> => {
    if (!user) {
      toast.error('Please sign in to like posts');
      return false;
    }
    
    try {
      setIsLiking(prev => ({ ...prev, [postId]: true }));
      
      // First check if post exists
      const postExists = await checkPostExists(postId);
      
      if (!postExists) {
        console.log('Post does not exist:', postId);
        toast.error('This post is no longer available');
        return false;
      }
      
      // Check if already liked
      const { data, error: checkError } = await supabase
        .from('post_likes')
        .select('*')
        .eq('user_id', user.id)
        .eq('post_id', postId)
        .maybeSingle();
        
      if (checkError) throw checkError;
      
      if (data) {
        // Unlike
        const { error: unlikeError } = await supabase
          .from('post_likes')
          .delete()
          .eq('user_id', user.id)
          .eq('post_id', postId);
          
        if (unlikeError) throw unlikeError;
        
        return false;
      } else {
        // Like
        const { error: likeError } = await supabase
          .from('post_likes')
          .insert({
            user_id: user.id,
            post_id: postId
          });
          
        if (likeError) {
          console.error('Like error details:', likeError);
          throw likeError;
        }
        
        return true;
      }
    } catch (error: any) {
      // Provide specific error message
      if (error.message && error.message.includes('foreign key constraint')) {
        toast.error('Cannot like this post - it may have been deleted');
      } else {
        toast.error('Failed to update like status');
      }
      console.error('Error toggling like:', error);
      return false;
    } finally {
      setIsLiking(prev => ({ ...prev, [postId]: false }));
    }
  }, [user, checkPostExists]);

  // Check if a post is liked
  const checkPostLikeStatus = useCallback(async (postId: string): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const { data, error } = await supabase
        .from('post_likes')
        .select('*')
        .eq('user_id', user.id)
        .eq('post_id', postId)
        .maybeSingle();
        
      if (error) throw error;
      return !!data;
    } catch (error) {
      console.error('Error checking like status:', error);
      return false;
    }
  }, [user]);

  return {
    toggleFollow,
    checkFollowStatus,
    toggleLikePost,
    checkPostLikeStatus,
    loadingFollowState,
    isLiking,
    checkPostExists
  };
};
