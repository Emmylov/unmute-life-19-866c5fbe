
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Check if the current session is valid
 * @returns Promise with boolean indicating if session is valid
 */
export const checkSessionValid = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error("Session check error:", error);
      return false;
    }
    
    return !!data.session;
  } catch (error) {
    console.error("Unexpected error checking session:", error);
    return false;
  }
};

/**
 * Refresh the current auth session
 * @returns Promise with boolean indicating success/failure
 */
export const refreshSession = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.auth.refreshSession();
    
    if (error) {
      console.error("Session refresh error:", error);
      toast.error("Your session has expired, please log in again");
      return false;
    }
    
    return !!data.session;
  } catch (error) {
    console.error("Unexpected error refreshing session:", error);
    return false;
  }
};

/**
 * Handle automatic session refresh when needed
 * @param expiresIn Time in seconds until session expiry
 */
export const setupSessionRefresh = (expiresIn?: number): (() => void) => {
  if (!expiresIn) return () => {};
  
  // Calculate refresh time (1 minute before expiry)
  const refreshTime = (expiresIn - 60) * 1000;
  
  // Setup refresh timer
  const timerId = setTimeout(() => {
    refreshSession();
  }, refreshTime);
  
  // Return cleanup function
  return () => clearTimeout(timerId);
};

/**
 * Get user profile data
 * @param userId The user ID to fetch profile for
 * @returns Promise with the profile data or null
 */
export const getUserProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
      
    if (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error("Unexpected error fetching profile:", error);
    return null;
  }
};
