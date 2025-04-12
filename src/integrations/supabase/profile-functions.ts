
import { supabase } from './client';
import { toast } from 'sonner';

// Toggle following a user
export const toggleFollowUser = async (followerId: string, followingId: string): Promise<boolean> => {
  try {
    // Check if already following
    const { data, error: checkError } = await supabase
      .from('user_follows')
      .select('*')
      .eq('follower_id', followerId)
      .eq('following_id', followingId)
      .maybeSingle();
      
    if (checkError) throw checkError;
    
    if (data) {
      // Unfollow
      const { error: unfollowError } = await supabase
        .from('user_follows')
        .delete()
        .eq('follower_id', followerId)
        .eq('following_id', followingId);
        
      if (unfollowError) throw unfollowError;
      
      // Update follower count
      await updateFollowerCount(followingId, -1);
      await updateFollowingCount(followerId, -1);
      
      return false;
    } else {
      // Follow
      const { error: followError } = await supabase
        .from('user_follows')
        .insert({
          follower_id: followerId,
          following_id: followingId
        });
        
      if (followError) throw followError;
      
      // Update follower count
      await updateFollowerCount(followingId, 1);
      await updateFollowingCount(followerId, 1);
      
      return true;
    }
  } catch (error) {
    console.error('Error toggling follow:', error);
    throw error;
  }
};

// Check if user is following target user
export const checkIsFollowing = async (followerId: string, followingId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('user_follows')
      .select('*')
      .eq('follower_id', followerId)
      .eq('following_id', followingId)
      .maybeSingle();
      
    if (error) throw error;
    return !!data;
  } catch (error) {
    console.error('Error checking follow status:', error);
    return false;
  }
};

// Helper function to update follower count
const updateFollowerCount = async (userId: string, increment: number): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('followers')
      .eq('id', userId)
      .single();
      
    if (error) throw error;
    
    const currentCount = data?.followers || 0;
    const newCount = Math.max(0, currentCount + increment); // Ensure count doesn't go below 0
    
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ followers: newCount })
      .eq('id', userId);
      
    if (updateError) throw updateError;
  } catch (error) {
    console.error('Error updating follower count:', error);
  }
};

// Helper function to update following count
const updateFollowingCount = async (userId: string, increment: number): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('following')
      .eq('id', userId)
      .single();
      
    if (error) throw error;
    
    const currentCount = data?.following || 0;
    const newCount = Math.max(0, currentCount + increment); // Ensure count doesn't go below 0
    
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ following: newCount })
      .eq('id', userId);
      
    if (updateError) throw updateError;
  } catch (error) {
    console.error('Error updating following count:', error);
  }
};

// Fetch user profile
export const fetchUserProfile = async (userId: string) => {
  try {
    // First try by username
    let { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', userId)
      .maybeSingle();
      
    if (!data && !error) {
      // If not found by username, try by ID
      const { data: idData, error: idError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (idError) throw idError;
      data = idData;
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};

// Add profile reaction
export const addProfileReaction = async (fromUserId: string, toUserId: string, emoji: string) => {
  try {
    const { data, error } = await supabase
      .from('profile_reactions')
      .insert({
        from_user_id: fromUserId,
        to_user_id: toUserId,
        emoji: emoji
      });
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error adding profile reaction:', error);
    throw error;
  }
};
