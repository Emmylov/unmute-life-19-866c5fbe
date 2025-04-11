
import { supabase } from "@/integrations/supabase/client";

// Wellness tracking - moved to dedicated service
export const saveWellnessGoal = async (userId: string, goalData: any) => {
  try {
    // For TypeScript safety, we're using type assertion here
    // In a real-world scenario, you should define proper interfaces
    const { data, error } = await supabase
      .from('wellness_goals' as any)
      .insert({
        user_id: userId,
        ...goalData
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error saving wellness goal:", error);
    throw error;
  }
};

export const getWellnessGoals = async (userId: string) => {
  try {
    // For TypeScript safety, we're using type assertion here
    const { data, error } = await supabase
      .from('wellness_goals' as any)
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error getting wellness goals:", error);
    throw error;
  }
};

export const saveWellnessActivity = async (userId: string, activityData: any) => {
  try {
    // For TypeScript safety, we're using type assertion here
    const { data, error } = await supabase
      .from('wellness_activities' as any)
      .insert({
        user_id: userId,
        ...activityData
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error saving wellness activity:", error);
    throw error;
  }
};

export const getWellnessActivities = async (userId: string) => {
  try {
    // For TypeScript safety, we're using type assertion here
    const { data, error } = await supabase
      .from('wellness_activities' as any)
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error getting wellness activities:", error);
    throw error;
  }
};
