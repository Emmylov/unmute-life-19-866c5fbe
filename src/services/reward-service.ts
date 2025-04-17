
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Database } from "@/integrations/supabase/types-patch";

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
    // Use type casting to bypass type checking for tables not in the main types.ts
    const { data, error } = await supabase
      .from('rewards')
      .select('*')
      .order('points_required', { ascending: true }) as { 
        data: Database['public']['Tables']['rewards']['Row'][]; 
        error: any 
      };
      
    if (error) throw error;
    
    return data as Reward[] || [];
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
    // Use type casting to bypass type checking
    const { data, error } = await supabase
      .from('user_rewards')
      .select('*')
      .eq('user_id', userId) as {
        data: Database['public']['Tables']['user_rewards']['Row'][];
        error: any
      };
      
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
    // Use type casting to bypass type checking
    const { error } = await supabase
      .from('user_rewards')
      .insert({
        user_id: userId,
        reward_id: rewardId,
        claimed_at: new Date().toISOString()
      }) as {
        data: any;
        error: any
      };
      
    if (error) throw error;
    
    toast.success("Reward claimed successfully!");
    return true;
  } catch (error) {
    console.error("Error claiming reward:", error);
    toast.error("Failed to claim reward");
    return false;
  }
};
