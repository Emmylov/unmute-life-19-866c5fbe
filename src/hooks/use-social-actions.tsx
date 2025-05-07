
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { 
  hasLikedPost as checkHasLikedPost, 
  getPostLikesCount as fetchPostLikesCount, 
  checkPostExists,
  likePost,
  unlikePost
} from '@/services/content-service';

export const useSocialActions = (postId?: string, postType?: string) => {
  const { user } = useAuth();
  const [liked, setLiked] = useState<boolean>(false);
  const [likesCount, setLikesCount] = useState<number>(0);
  const [exists, setExists] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);
  const [isLiking, setIsLiking] = useState<Record<string, boolean>>({});
  const [loadingFollowState, setLoadingFollowState] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!postId || !user || !postType) return;

    const checkLikeStatus = async () => {
      try {
        setLoading(true);
        
        // Check if post exists
        const postExists = await checkPostExists(postId, postType);
        setExists(!!postExists);
        
        if (!postExists) {
          setLoading(false);
          return;
        }
        
        // Check if user has liked post
        // Fix: Pass parameters in correct order - postId, userId, postType
        const hasLiked = await checkHasLikedPost(postId, user.id, postType);
        setLiked(!!hasLiked);
        
        // Get likes count
        const count = await fetchPostLikesCount(postId, postType);
        setLikesCount(count || 0);
      } catch (error) {
        console.error('Error checking like status:', error);
      } finally {
        setLoading(false);
      }
    };

    checkLikeStatus();
  }, [postId, postType, user]);

  const toggleLike = async () => {
    if (!user || !postId || !postType || !exists) return;
    
    try {
      // Optimistically update UI
      const newLikeState = !liked;
      setLiked(newLikeState);
      setLikesCount(prevCount => newLikeState ? prevCount + 1 : Math.max(0, prevCount - 1));
      
      // Check if post exists
      const postExists = await checkPostExists(postId, postType);
      
      if (!postExists) {
        setExists(false);
        toast.error("This post no longer exists.");
        return;
      }
      
      // Update like in database
      if (newLikeState) {
        // Like the post
        await likePost(user.id, postId, postType);
      } else {
        // Unlike the post
        await unlikePost(user.id, postId, postType);
      }
      
      // Refresh count
      const count = await fetchPostLikesCount(postId, postType);
      setLikesCount(count || 0);
      
      return newLikeState;
    } catch (error) {
      console.error('Error toggling like:', error);
      
      // Revert optimistic update
      setLiked(!liked);
      setLikesCount(prevCount => liked ? prevCount + 1 : Math.max(0, prevCount - 1));
      
      toast.error("Couldn't update your reaction. Please try again.");
      return liked;
    }
  };

  // Add toggle follow functionality
  const toggleFollow = async (userId: string) => {
    if (!user) {
      toast.error("Please sign in to follow users");
      return false;
    }
    
    setLoadingFollowState(prev => ({ ...prev, [userId]: true }));
    
    try {
      // Check if already following
      const isFollowing = await checkFollowStatus(userId);
      
      if (isFollowing) {
        // Unfollow
        await supabase
          .from('user_follows')
          .delete()
          .match({
            follower_id: user.id,
            following_id: userId
          });
      } else {
        // Follow
        await supabase
          .from('user_follows')
          .insert({
            follower_id: user.id,
            following_id: userId
          });
      }
      
      return !isFollowing;
    } catch (error) {
      console.error('Error toggling follow:', error);
      toast.error("Couldn't update follow status. Please try again.");
      return false;
    } finally {
      setLoadingFollowState(prev => ({ ...prev, [userId]: false }));
    }
  };
  
  // Add check follow status functionality
  const checkFollowStatus = async (userId: string) => {
    if (!user) return false;
    
    try {
      const { data } = await supabase
        .from('user_follows')
        .select('*')
        .eq('follower_id', user.id)
        .eq('following_id', userId)
        .single();
        
      return !!data;
    } catch (error) {
      return false;
    }
  };
  
  // Fix: Make sure parameters are in correct order - postId, userId, postType
  const toggleLikePost = async (postId: string, userId: string, postType: string) => {
    if (!userId) {
      toast.error("Please sign in to like posts");
      return false;
    }
    
    setIsLiking(prev => ({ ...prev, [postId]: true }));
    
    try {
      // Fix: Pass parameters in correct order - postId, userId, postType
      const hasLiked = await checkHasLikedPost(postId, userId, postType);
      
      if (hasLiked) {
        await unlikePost(userId, postId, postType);
      } else {
        await likePost(userId, postId, postType);
      }
      
      return !hasLiked;
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error("Couldn't update like status. Please try again.");
      return false;
    } finally {
      setIsLiking(prev => ({ ...prev, [postId]: false }));
    }
  };

  // Fix: Export these renamed functions with parameters in correct order
  const hasLikedPost = async (postId: string, userId: string, postType: string) => {
    return checkHasLikedPost(postId, userId, postType);
  };

  const getPostLikesCount = async (postId: string, postType: string) => {
    return fetchPostLikesCount(postId, postType);
  };

  return {
    liked,
    likesCount,
    exists,
    loading,
    toggleLike,
    toggleFollow,
    checkFollowStatus,
    loadingFollowState,
    toggleLikePost,
    hasLikedPost,
    getPostLikesCount,
    isLiking
  };
};
