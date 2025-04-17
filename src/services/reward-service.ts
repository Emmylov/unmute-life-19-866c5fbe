
import { supabase } from "@/integrations/supabase/client";

// Interface for UserReward objects
export interface UserReward {
  id: string;
  user_id: string;
  reward_id: string;
  claimed_at: string;
}

// Check if a user qualifies as an early adopter
export const checkEarlyAdopterStatus = async (userId: string): Promise<boolean> => {
  try {
    // Get user's join date from profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('created_at')
      .eq('id', userId)
      .single();
    
    if (!profile || !profile.created_at) {
      return false;
    }
    
    // Define launch period - first 7 days from launch date
    const launchDate = new Date("2025-04-18T00:00:00");
    const launchEndDate = new Date(launchDate);
    launchEndDate.setDate(launchEndDate.getDate() + 7);
    
    const userJoinDate = new Date(profile.created_at);
    
    // User is an early adopter if they joined within the launch period
    return userJoinDate >= launchDate && userJoinDate <= launchEndDate;
  } catch (error) {
    console.error("Error checking early adopter status:", error);
    return false;
  }
};

// Get all rewards claimed by a user
export const getUserRewards = async (userId: string): Promise<UserReward[]> => {
  try {
    // This assumes you have created a user_rewards table in your database
    const { data, error } = await supabase.rpc('get_user_rewards', { p_user_id: userId });
    
    if (error) {
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error("Error fetching user rewards:", error);
    return [];
  }
};

// Claim a reward for a user
export const claimReward = async (userId: string, rewardId: string): Promise<boolean> => {
  try {
    // Insert a new record into the user_rewards table
    const { data, error } = await supabase.rpc('claim_user_reward', {
      p_user_id: userId,
      p_reward_id: rewardId
    });
    
    if (error) {
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error("Error claiming reward:", error);
    return false;
  }
};
