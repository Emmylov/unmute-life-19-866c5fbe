
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

export const useSocialActions = () => {
  const { user } = useAuth();
  const [loadingFollowState, setLoadingFollowState] = useState<Record<string, boolean>>({});
  const [isLiking, setIsLiking] = useState<Record<string, boolean>>({});
  const { t } = useTranslation();
  
  // Check if a post exists in any post table
  const checkPostExists = useCallback(async (postId: string): Promise<boolean> => {
    try {
      // Check in posts_text table first (most common)
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
      
      // Check in posts_reels table
      const { data: reelPost, error: reelPostError } = await supabase
        .from('posts_reels')
        .select('id')
        .eq('id', postId)
        .maybeSingle();
          
      if (!reelPostError && reelPost) {
        return true;
      }
      
      // Finally check in the main posts table
      const { data: mainPost, error: mainPostError } = await supabase
        .from('posts')
        .select('id')
        .eq('id', postId)
        .maybeSingle();
          
      if (!mainPostError && mainPost) {
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error checking post existence:', error);
      return false;
    }
  }, []);

  // Check if a post is liked by the current user
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
  
  // Check if a reel is liked by the current user  
  const checkReelLikeStatus = useCallback(async (reelId: string): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const { data, error } = await supabase
        .from('reel_likes')
        .select('*')
        .eq('user_id', user.id)
        .eq('reel_id', reelId)
        .maybeSingle();
        
      if (error) throw error;
      return !!data;
    } catch (error) {
      console.error('Error checking reel like status:', error);
      return false;
    }
  }, [user]);
  
  // Get total number of likes for a post
  const getPostLikesCount = useCallback(async (postId: string): Promise<number> => {
    try {
      const { count, error } = await supabase
        .from('post_likes')
        .select('*', { count: 'exact', head: true })
        .eq('post_id', postId);
      
      if (error) throw error;
      return count || 0;
    } catch (error) {
      console.error('Error getting post likes count:', error);
      return 0;
    }
  }, []);
  
  // Get total number of likes for a reel
  const getReelLikesCount = useCallback(async (reelId: string): Promise<number> => {
    try {
      const { count, error } = await supabase
        .from('reel_likes')
        .select('*', { count: 'exact', head: true })
        .eq('reel_id', reelId);
      
      if (error) throw error;
      return count || 0;
    } catch (error) {
      console.error('Error getting reel likes count:', error);
      return 0;
    }
  }, []);
  
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
  const toggleLikePost = useCallback(async (postId: string): Promise<boolean> => {
    if (!user) {
      toast.error(t('auth.signInRequired', 'Please sign in to like posts'));
      return false;
    }
    
    try {
      setIsLiking(prev => ({ ...prev, [postId]: true }));
      
      // First check if post exists
      const postExists = await checkPostExists(postId);
      
      if (!postExists) {
        console.log('Post does not exist:', postId);
        toast.error(t('common.error.postDeleted', 'This post is no longer available'));
        return false;
      }
      
      // Check if already liked
      const isLiked = await checkPostLikeStatus(postId);
      
      if (isLiked) {
        // Unlike - delete from post_likes
        const { error: unlikeError } = await supabase
          .from('post_likes')
          .delete()
          .eq('user_id', user.id)
          .eq('post_id', postId);
          
        if (unlikeError) throw unlikeError;
        
        return false;
      } else {
        // Like - insert into post_likes
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
        toast.error(t('common.error.postDeleted', 'Cannot like this post - it may have been deleted'));
      } else {
        toast.error(t('common.error.likePost', 'Failed to update like status'));
      }
      console.error('Error toggling like:', error);
      return false;
    } finally {
      setIsLiking(prev => ({ ...prev, [postId]: false }));
    }
  }, [user, checkPostExists, checkPostLikeStatus, t]);
  
  // Toggle like on a reel
  const toggleLikeReel = useCallback(async (reelId: string): Promise<boolean> => {
    if (!user) {
      toast.error(t('auth.signInRequired', 'Please sign in to like reels'));
      return false;
    }
    
    try {
      setIsLiking(prev => ({ ...prev, [reelId]: true }));
      
      // Check if already liked
      const isLiked = await checkReelLikeStatus(reelId);
      
      if (isLiked) {
        // Unlike - delete from reel_likes
        const { error: unlikeError } = await supabase
          .from('reel_likes')
          .delete()
          .eq('user_id', user.id)
          .eq('reel_id', reelId);
          
        if (unlikeError) throw unlikeError;
        
        return false;
      } else {
        // Like - insert into reel_likes
        const { error: likeError } = await supabase
          .from('reel_likes')
          .insert({
            user_id: user.id,
            reel_id: reelId
          });
          
        if (likeError) {
          console.error('Like error details:', likeError);
          throw likeError;
        }
        
        return true;
      }
    } catch (error: any) {
      if (error.message && error.message.includes('foreign key constraint')) {
        toast.error(t('common.error.reelDeleted', 'Cannot like this reel - it may have been deleted'));
      } else {
        toast.error(t('common.error.likeReel', 'Failed to update like status'));
      }
      console.error('Error toggling reel like:', error);
      return false;
    } finally {
      setIsLiking(prev => ({ ...prev, [reelId]: false }));
    }
  }, [user, checkReelLikeStatus, t]);
  
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
    toggleLikeReel,
    checkPostLikeStatus,
    checkReelLikeStatus,
    getPostLikesCount,
    getReelLikesCount,
    loadingFollowState,
    isLiking,
    checkPostExists
  };
};
