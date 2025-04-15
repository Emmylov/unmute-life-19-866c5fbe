
import { supabase } from "@/integrations/supabase/client";
import { PhysicalWellnessPreference } from "@/components/wellness-plus/physical-wellness/types";

// Interface for wellness goals
interface WellnessGoal {
  id?: string;
  user_id: string;
  title: string;
  description?: string;
  target_date?: string;
  category?: string;
  status?: 'not_started' | 'in_progress' | 'completed';
  created_at?: string;
}

// Interface for wellness activities
interface WellnessActivity {
  id?: string;
  user_id: string;
  activity_type: string;
  duration_minutes?: number;
  notes?: string;
  mood_before?: string;
  mood_after?: string;
  created_at?: string;
}

// Interface for journal entries
interface JournalEntry {
  id?: string;
  user_id: string;
  activity_date?: string;
  sleep_hours?: number;
  water_intake?: number;
  exercise_minutes?: number;
  mood?: string;
  nutrition_rating?: number;
  notes?: string;
  created_at?: string;
}

// Wellness tracking - moved to dedicated service
export const saveWellnessGoal = async (userId: string, goalData: Partial<WellnessGoal>): Promise<WellnessGoal | null> => {
  try {
    const { data, error } = await supabase
      .from('wellness_goals')
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

export const getWellnessGoals = async (userId: string): Promise<WellnessGoal[]> => {
  try {
    const { data, error } = await supabase
      .from('wellness_goals')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error getting wellness goals:", error);
    throw error;
  }
};

export const saveWellnessActivity = async (userId: string, activityData: Partial<WellnessActivity>): Promise<WellnessActivity | null> => {
  try {
    const { data, error } = await supabase
      .from('wellness_activities')
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

export const getWellnessActivities = async (userId: string): Promise<WellnessActivity[]> => {
  try {
    const { data, error } = await supabase
      .from('wellness_activities')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error getting wellness activities:", error);
    throw error;
  }
};

// Physical wellness functions
export const savePhysicalWellnessPreferences = async (userId: string, preferences: PhysicalWellnessPreference) => {
  try {
    const { data, error } = await supabase
      .from('user_physical_wellness')
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
      .from('user_physical_wellness')
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
    
    // If we successfully get data, safely access and return the preferences
    if (data && 'preferences' in data) {
      return data.preferences as PhysicalWellnessPreference;
    }
    
    // Return null if we don't have preferences
    return null;
  } catch (error) {
    console.error("Error getting physical wellness preferences:", error);
    throw error;
  }
};

export const saveJournalEntry = async (userId: string, entry: Partial<JournalEntry>) => {
  try {
    const { data, error } = await supabase
      .from('physical_wellness_journal')
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

export const getJournalEntries = async (userId: string): Promise<JournalEntry[]> => {
  try {
    const { data, error } = await supabase
      .from('physical_wellness_journal')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error getting journal entries:", error);
    throw error;
  }
};
