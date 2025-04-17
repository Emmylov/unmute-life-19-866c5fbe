
import { supabase } from "@/integrations/supabase/client";

export interface Reward {
  id: string;
  name: string;
  description: string;
  image_url?: string;
  created_at: string;
}

export interface UserReward {
  id: string;
  user_id: string;
  reward_id: string;
  claimed_at: string;
  created_at: string;
}

// Check if user is eligible for early adopter rewards
export const checkEarlyAdopterStatus = async (userId: string): Promise<boolean> => {
  try {
    // Get user profile to check join date
    const { data: profile } = await supabase
      .from('profiles')
      .select('created_at')
      .eq('id', userId)
      .single();
    
    if (!profile) return false;
    
    const launchDate = new Date("2025-04-18T00:00:00");
    const launchEndDate = new Date(launchDate);
    launchEndDate.setDate(launchEndDate.getDate() + 7); // 7-day launch window
    
    const userJoinDate = new Date(profile.created_at);
    
    return userJoinDate >= launchDate && userJoinDate <= launchEndDate;
  } catch (error) {
    console.error("Error checking early adopter status:", error);
    return false;
  }
};

// Get all rewards available to a user
export const getUserRewards = async (userId: string): Promise<UserReward[]> => {
  try {
    const { data, error } = await supabase
      .from('user_rewards')
      .select('*')
      .eq('user_id', userId);
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching user rewards:", error);
    return [];
  }
};

// Claim a reward for a user
export const claimReward = async (userId: string, rewardId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('user_rewards')
      .insert({
        user_id: userId,
        reward_id: rewardId,
        claimed_at: new Date().toISOString()
      });
      
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error claiming reward:", error);
    return false;
  }
};

// Check if user has claimed a specific reward
export const hasClaimedReward = async (userId: string, rewardId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('user_rewards')
      .select('*')
      .eq('user_id', userId)
      .eq('reward_id', rewardId)
      .single();
      
    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "No rows returned" error
    return !!data;
  } catch (error) {
    console.error("Error checking reward claim:", error);
    return false;
  }
};
