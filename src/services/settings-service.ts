
import { supabase } from "@/integrations/supabase/client";

// Define interfaces for better type safety
interface UserSettings {
  user_id: string;
  settings: Record<string, any>;
}

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

export const getUserSettings = async (userId: string): Promise<UserSettings> => {
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
    
    // If no data is found, return a default object
    return data || { user_id: userId, settings: {} };
  } catch (error) {
    console.error("Error getting user settings:", error);
    // Return a default object on error
    return { user_id: userId, settings: {} };
  }
};

// Add the missing functions for the Settings component
export const updateUserProfile = async (userId: string, profileData: any) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({
        username: profileData.username,
        full_name: profileData.full_name,
        bio: profileData.bio,
        website: profileData.website,
        location: profileData.location
      })
      .eq('id', userId)
      .select();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};

export const updateUserSettings = async (userId: string, settingsData: any, type: string = 'general') => {
  try {
    // First get current settings
    const currentSettings = await getUserSettings(userId);
    // Now we can safely access settings because getUserSettings always returns an object with settings
    
    // Update the specific settings section
    const updatedSettings = {
      ...currentSettings.settings,
      [type]: settingsData
    };
    
    // Save updated settings
    return await saveUserSettings(userId, updatedSettings);
  } catch (error) {
    console.error("Error updating user settings:", error);
    throw error;
  }
};
