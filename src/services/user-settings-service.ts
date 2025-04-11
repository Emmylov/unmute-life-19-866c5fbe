
import { supabase } from "@/integrations/supabase/client";

// Save user settings
export const saveUserSettings = async (userId: string, settings: any) => {
  try {
    // Check if settings already exist for this user
    const { data: existingSettings, error: fetchError } = await supabase
      .from("user_settings")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();
    
    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 means no rows found
      throw fetchError;
    }
    
    // If settings exist, update them; otherwise create new settings
    if (existingSettings) {
      const { data, error } = await supabase
        .from("user_settings")
        .update({
          settings: settings,
          updated_at: new Date().toISOString()
        })
        .eq("user_id", userId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } else {
      const { data, error } = await supabase
        .from("user_settings")
        .insert({
          user_id: userId,
          settings: settings,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    }
  } catch (error) {
    console.error("Error saving user settings:", error);
    throw error;
  }
};

// Get user settings
export const getUserSettings = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from("user_settings")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();
    
    if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
      throw error;
    }
    
    // Return default settings if none found
    return data || {
      user_id: userId,
      settings: {
        notifications: {
          push: true,
          email: true,
          chat: true,
          mentions: true,
          follows: true
        },
        privacy: {
          profile_visibility: "public",
          message_requests: "followers",
          activity_status: true
        },
        theme: {
          mode: "system",
          color: "default"
        },
        content_preferences: {
          language: "english",
          safe_mode: false,
          content_sensitivity: "medium"
        }
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  } catch (error) {
    console.error("Error fetching user settings:", error);
    throw error;
  }
};

// Update specific setting
export const updateSetting = async (userId: string, settingPath: string[], value: any) => {
  try {
    // Get current settings
    const currentSettings = await getUserSettings(userId);
    
    // Make a deep copy of current settings
    const newSettings = JSON.parse(JSON.stringify(currentSettings.settings || {}));
    
    // Navigate to the nested property and update it
    let current = newSettings;
    for (let i = 0; i < settingPath.length - 1; i++) {
      const key = settingPath[i];
      if (!current[key]) {
        current[key] = {};
      }
      current = current[key];
    }
    
    // Set the value
    const lastKey = settingPath[settingPath.length - 1];
    current[lastKey] = value;
    
    // Save updated settings
    return await saveUserSettings(userId, newSettings);
  } catch (error) {
    console.error("Error updating setting:", error);
    throw error;
  }
};

// Get specific setting by path
export const getSetting = async (userId: string, settingPath: string[]): Promise<any> => {
  try {
    const settings = await getUserSettings(userId);
    
    // Navigate to the nested property
    let value = settings.settings;
    for (const key of settingPath) {
      if (!value || typeof value !== 'object') {
        return undefined;
      }
      value = value[key];
    }
    
    return value;
  } catch (error) {
    console.error("Error getting specific setting:", error);
    throw error;
  }
};

// Save onboarding information
export const saveOnboardingData = async (userId: string, onboardingData: any) => {
  try {
    // Update the user's profile with onboarding information
    const { data, error } = await supabase
      .from("profiles")
      .update({
        ...onboardingData,
        is_onboarded: true,
        updated_at: new Date().toISOString()
      })
      .eq("id", userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error saving onboarding data:", error);
    throw error;
  }
};

// Get onboarding status
export const getOnboardingStatus = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("is_onboarded, onboarding_step")
      .eq("id", userId)
      .single();
    
    if (error) throw error;
    
    return {
      isOnboarded: data?.is_onboarded || false,
      currentStep: data?.onboarding_step || 'activist-choice'
    };
  } catch (error) {
    console.error("Error getting onboarding status:", error);
    throw error;
  }
};

// Update onboarding step
export const updateOnboardingStep = async (userId: string, step: string) => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .update({
        onboarding_step: step,
        updated_at: new Date().toISOString()
      })
      .eq("id", userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error updating onboarding step:", error);
    throw error;
  }
};
