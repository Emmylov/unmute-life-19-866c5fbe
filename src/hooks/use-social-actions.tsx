
import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { 
  likePost, 
  hasLikedPost, 
  getPostLikesCount, 
  checkPostExists 
} from '@/services/post-service';
import { supabase } from '@/integrations/supabase/client';

export const useSocialActions = () => {
  const { user } = useAuth();
  const [loadingFollowState, setLoadingFollowState] = useState<Record<string, boolean>>({});
  const [isLiking, setIsLiking] = useState<Record<string, boolean>>({});
  const { t } = useTranslation();
  
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

  // Toggle like on a post
  const toggleLikePost = useCallback(async (postId: string, postType: string): Promise<boolean> => {
    if (!user) {
      toast.error(t('auth.signInRequired', 'Please sign in to like posts'));
      return false;
    }
    
    try {
      setIsLiking(prev => ({ ...prev, [postId]: true }));
      
      // First check if post exists
      const postExists = await checkPostExists(postId, postType);
      
      if (!postExists) {
        console.log(`Post ${postId} of type ${postType} does not exist`);
        toast.error(t('common.error.postDeleted', 'This post is no longer available'));
        return false;
      }
      
      // Use our new post service to toggle like
      const liked = await likePost(postId, user.id, postType);
      return liked;
    } catch (error: any) {
      // Provide specific error message
      toast.error(t('common.error.likePost', 'Failed to update like status'));
      console.error('Error toggling like:', error);
      return false;
    } finally {
      setIsLiking(prev => ({ ...prev, [postId]: false }));
    }
  }, [user, t]);
  
  // Toggle following a user
  const toggleFollow = useCallback(async (userId: string): Promise<boolean> => {
    if (!user) {
      toast.error(t('auth.signInRequired', 'Please sign in to follow users'));
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
        
        // Update follower counts in profiles
        await supabase.rpc('update_follower_counts', {
          p_follower_id: user.id,
          p_following_id: userId,
          p_is_follow: false
        }).single();
        
        toast.success(t('common.success.unfollowed', 'Unfollowed user'));
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
        
        // Update follower counts in profiles
        await supabase.rpc('update_follower_counts', {
          p_follower_id: user.id,
          p_following_id: userId,
          p_is_follow: true
        }).single();
        
        toast.success(t('common.success.following', 'Following user'));
        return true;
      }
    } catch (error: any) {
      toast.error(t('common.error.followStatus', 'Error updating follow status'));
      console.error('Error toggling follow:', error);
      return false;
    } finally {
      setLoadingFollowState(prev => ({ ...prev, [userId]: false }));
    }
  }, [user, t]);

  return {
    toggleFollow,
    checkFollowStatus,
    toggleLikePost,
    hasLikedPost,
    getPostLikesCount,
    loadingFollowState,
    isLiking,
    checkPostExists
  };
};
