
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface UserReward {
  id: string;
  user_id: string;
  reward_id: string;
  claimed_at: string | null;
  created_at: string;
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  points_required: number;
  image_url?: string;
  reward_type: string;
  created_at: string;
}

/**
 * Fetches all rewards available in the system
 */
export const fetchAllRewards = async (): Promise<Reward[]> => {
  try {
    const { data, error } = await supabase
      .from('rewards')
      .select('*')
      .order('points_required', { ascending: true });
      
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error("Error fetching rewards:", error);
    toast.error("Failed to load rewards");
    return [];
  }
};

/**
 * Fetches all rewards claimed by a user
 */
export const fetchUserRewards = async (userId: string): Promise<UserReward[]> => {
  try {
    // Direct table query since the RPC function doesn't exist
    const { data, error } = await supabase
      .from('user_rewards')
      .select('*')
      .eq('user_id', userId);
      
    if (error) throw error;
    
    return data as UserReward[] || [];
  } catch (error) {
    console.error("Error fetching user rewards:", error);
    toast.error("Failed to load your rewards");
    return [];
  }
};

/**
 * Claims a reward for a user
 */
export const claimReward = async (userId: string, rewardId: string): Promise<boolean> => {
  try {
    // Direct insert since the RPC function doesn't exist
    const { error } = await supabase
      .from('user_rewards')
      .insert({
        user_id: userId,
        reward_id: rewardId,
        claimed_at: new Date().toISOString()
      });
      
    if (error) throw error;
    
    toast.success("Reward claimed successfully!");
    return true;
  } catch (error) {
    console.error("Error claiming reward:", error);
    toast.error("Failed to claim reward");
    return false;
  }
};
