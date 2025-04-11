
import { supabase } from "@/integrations/supabase/client";

// User settings
export const saveUserSettings = async (userId: string, settings: any) => {
  try {
    // For TypeScript safety, using type assertion
    const { data, error } = await supabase
      .from('user_settings' as any)
      .upsert({
        user_id: userId,
        settings
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error saving user settings:", error);
    throw error;
  }
};

export const getUserSettings = async (userId: string) => {
  try {
    // For TypeScript safety, using type assertion
    const { data, error } = await supabase
      .from('user_settings' as any)
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
      throw error;
    }
    
    return data || { user_id: userId, settings: {} };
  } catch (error) {
    console.error("Error getting user settings:", error);
    throw error;
  }
};
