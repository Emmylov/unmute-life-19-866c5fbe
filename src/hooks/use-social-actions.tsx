import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { toggleFollowUser, checkIsFollowing } from "@/integrations/supabase/profile-functions";
import { createFollowNotification } from "@/services/notification-service";

export const useSocialActions = () => {
  const { user, refreshProfile } = useAuth();
  const [isFollowing, setIsFollowing] = useState<Record<string, boolean>>({});
  const [loadingFollowState, setLoadingFollowState] = useState<Record<string, boolean>>({});
  const [isLiking, setIsLiking] = useState<Record<string, boolean>>({});
  
  // Check if the current user is following another user
  const checkFollowStatus = async (targetUserId: string) => {
    if (!user) return false;
    
    setLoadingFollowState(prev => ({ ...prev, [targetUserId]: true }));
    
    try {
      const following = await checkIsFollowing(user.id, targetUserId);
      setIsFollowing(prev => ({ ...prev, [targetUserId]: following }));
      return following;
    } catch (error) {
      console.error("Error checking follow status:", error);
      return false;
    } finally {
      setLoadingFollowState(prev => ({ ...prev, [targetUserId]: false }));
    }
  };
  
  // Follow or unfollow a user
  const toggleFollow = async (targetUserId: string) => {
    if (!user) {
      toast.error("You must be logged in to follow users");
      return false;
    }
    
    if (user.id === targetUserId) {
      toast.error("You cannot follow yourself");
      return false;
    }
    
    setLoadingFollowState(prev => ({ ...prev, [targetUserId]: true }));
    
    try {
      const result = await toggleFollowUser(user.id, targetUserId);
      
      // Update local state
      setIsFollowing(prev => ({ ...prev, [targetUserId]: result }));
      
      // If the user is now following, create a notification
      if (result) {
        try {
          await createFollowNotification(targetUserId, user.id);
        } catch (notifError) {
          console.error("Error creating follow notification:", notifError);
        }
      }
      
      // Refresh the user profile to get updated counts
      await refreshProfile();
      
      toast.success(result ? "Started following user" : "Unfollowed user");
      
      return result;
    } catch (error) {
      console.error("Error toggling follow:", error);
      toast.error("Failed to update follow status");
      return isFollowing[targetUserId] || false;
    } finally {
      setLoadingFollowState(prev => ({ ...prev, [targetUserId]: false }));
    }
  };
  
  // Like a post
  const toggleLikePost = async (postId: string) => {
    if (!user) {
      toast.error("You must be logged in to like posts");
      return false;
    }
    
    setIsLiking(prev => ({ ...prev, [postId]: true }));
    
    try {
      // Check if already liked
      const { data: existingLike } = await supabase
        .from("post_likes")
        .select("*")
        .eq("post_id", postId)
        .eq("user_id", user.id)
        .single();
      
      if (existingLike) {
        // Unlike
        await supabase
          .from("post_likes")
          .delete()
          .eq("post_id", postId)
          .eq("user_id", user.id);
        
        toast.success("Post unliked");
        return false;
      } else {
        // Like
        await supabase
          .from("post_likes")
          .insert({ post_id: postId, user_id: user.id });
        
        toast.success("Post liked");
        return true;
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      toast.error("Failed to update like status");
      return false;
    } finally {
      setIsLiking(prev => ({ ...prev, [postId]: false }));
    }
  };
  
  return {
    isFollowing,
    loadingFollowState,
    checkFollowStatus,
    toggleFollow,
    toggleLikePost,
    isLiking
  };
};
