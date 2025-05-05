
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { 
  hasLikedPost, 
  getPostLikesCount, 
  checkPostExists 
} from '@/services/post-service';

export const useSocialActions = (postId: string, postType: string) => {
  const { user } = useAuth();
  const [liked, setLiked] = useState<boolean>(false);
  const [likesCount, setLikesCount] = useState<number>(0);
  const [exists, setExists] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!postId || !user) return;

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
        const hasLiked = await hasLikedPost(user.id, postId, postType);
        setLiked(!!hasLiked);
        
        // Get likes count
        const count = await getPostLikesCount(postId, postType);
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
    if (!user || !postId || !exists) return;
    
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
        const { error } = await supabase
          .from('post_likes')
          .insert({
            user_id: user.id,
            post_id: postId,
            post_type: postType
          });
          
        if (error) throw error;
      } else {
        // Unlike the post
        const { error } = await supabase
          .from('post_likes')
          .delete()
          .match({
            user_id: user.id,
            post_id: postId,
            post_type: postType
          });
          
        if (error) throw error;
      }
      
      // Refresh count
      const count = await getPostLikesCount(postId, postType);
      setLikesCount(count || 0);
      
    } catch (error) {
      console.error('Error toggling like:', error);
      
      // Revert optimistic update
      setLiked(!liked);
      setLikesCount(prevCount => liked ? prevCount + 1 : Math.max(0, prevCount - 1));
      
      toast.error("Couldn't update your reaction. Please try again.");
    }
  };

  return {
    liked,
    likesCount,
    exists,
    loading,
    toggleLike
  };
};
