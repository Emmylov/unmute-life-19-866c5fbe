
import { supabase } from "@/integrations/supabase/client";

// Get user settings
export const getUserSettings = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from("user_settings" as any)
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error) {
      // If settings don't exist yet, return default settings
      if (error.code === "PGRST116") {
        return { 
          id: null,
          user_id: userId,
          settings: {
            notifications: {
              push: true,
              email: true,
              mentions: true,
              comments: true,
              likes: true,
              follows: true
            },
            privacy: {
              private_account: false,
              show_online_status: true,
              activity_status: true
            },
            theme: "system",
            language: "en"
          }
        };
      }
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error getting user settings:", error);
    throw error;
  }
};

// Create or update user settings
export const updateUserSettings = async (userId: string, settings: any) => {
  try {
    // Check if settings already exist
    const { data: existingSettings, error: checkError } = await supabase
      .from("user_settings" as any)
      .select("id")
      .eq("user_id", userId);

    if (checkError) throw checkError;

    if (existingSettings && existingSettings.length > 0) {
      // Update existing settings
      const { data, error } = await supabase
        .from("user_settings" as any)
        .update({ 
          settings: settings,
          updated_at: new Date().toISOString()
        })
        .eq("user_id", userId)
        .select();

      if (error) throw error;
      return data;
    } else {
      // Create new settings
      const { data, error } = await supabase
        .from("user_settings" as any)
        .insert({
          user_id: userId,
          settings: settings
        })
        .select();

      if (error) throw error;
      return data;
    }
  } catch (error) {
    console.error("Error updating user settings:", error);
    throw error;
  }
};

// Get specific setting by key
export const getUserSetting = async (userId: string, settingKey: string) => {
  try {
    const userSettings = await getUserSettings(userId);
    
    if (!userSettings) {
      return null;
    }
    
    // Handle nested keys like 'notifications.push'
    if (settingKey.includes('.')) {
      const keys = settingKey.split('.');
      let value = userSettings.settings;
      
      for (const key of keys) {
        if (value && typeof value === 'object' && key in value) {
          value = value[key];
        } else {
          return null;
        }
      }
      
      return value;
    }
    
    // Handle top-level keys
    return userSettings.settings && userSettings.settings[settingKey] !== undefined
      ? userSettings.settings[settingKey]
      : null;
  } catch (error) {
    console.error(`Error getting user setting ${settingKey}:`, error);
    return null;
  }
};

// Update specific setting by key
export const updateUserSetting = async (userId: string, settingKey: string, value: any) => {
  try {
    const userSettings = await getUserSettings(userId);
    
    if (!userSettings || !userSettings.settings) {
      throw new Error("User settings not found");
    }
    
    const updatedSettings = { ...userSettings.settings };
    
    // Handle nested keys like 'notifications.push'
    if (settingKey.includes('.')) {
      const keys = settingKey.split('.');
      let current = updatedSettings;
      
      // Navigate to the nested object that contains our target key
      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        if (!(key in current)) {
          current[key] = {};
        }
        current = current[key];
      }
      
      // Set the value for the final key
      current[keys[keys.length - 1]] = value;
    } else {
      // Handle top-level keys
      updatedSettings[settingKey] = value;
    }
    
    return await updateUserSettings(userId, updatedSettings);
  } catch (error) {
    console.error(`Error updating user setting ${settingKey}:`, error);
    throw error;
  }
};

// Functions for Onboarding
export const updateOnboardingStep = async (userId: string, step: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({ onboarding_step: step })
      .eq('id', userId)
      .select();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error updating onboarding step:", error);
    throw error;
  }
};

export const saveOnboardingData = async (userId: string, userData: any) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(userData)
      .eq('id', userId)
      .select();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error saving onboarding data:", error);
    throw error;
  }
};
