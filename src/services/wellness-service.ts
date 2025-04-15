
import { supabase } from "@/integrations/supabase/client";
import { PhysicalWellnessPreference } from "@/components/wellness-plus/physical-wellness/types";

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

// Physical wellness functions
export const savePhysicalWellnessPreferences = async (userId: string, preferences: PhysicalWellnessPreference) => {
  try {
    const { data, error } = await supabase
      .from('user_physical_wellness' as any)
      .upsert({
        user_id: userId,
        preferences,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      })
      .select();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error saving physical wellness preferences:", error);
    throw error;
  }
};

export const getPhysicalWellnessPreferences = async (userId: string): Promise<PhysicalWellnessPreference | null> => {
  try {
    const { data, error } = await supabase
      .from('user_physical_wellness' as any)
      .select('preferences')
      .eq('user_id', userId)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // No data found
        return null;
      }
      throw error;
    }
    
    // If we successfully get data, return the preferences
    if (data && data.preferences) {
      return data.preferences as PhysicalWellnessPreference;
    }
    
    // Return null if we don't have preferences
    return null;
  } catch (error) {
    console.error("Error getting physical wellness preferences:", error);
    throw error;
  }
};

export const saveJournalEntry = async (userId: string, entry: any) => {
  try {
    const { data, error } = await supabase
      .from('physical_wellness_journal' as any)
      .insert({
        user_id: userId,
        ...entry,
        created_at: new Date().toISOString()
      })
      .select();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error saving journal entry:", error);
    throw error;
  }
};

export const getJournalEntries = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('physical_wellness_journal' as any)
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error getting journal entries:", error);
    throw error;
  }
};
