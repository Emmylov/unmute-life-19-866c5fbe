
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
    if (error instanceof Error && error.message.includes('Failed to fetch')) {
      console.warn('Network connectivity issue detected during session check');
    }
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
    // Don't show toast for network errors as they can be transient
    if (!(error instanceof Error && error.message.includes('Failed to fetch'))) {
      toast.error("Session refresh failed, please try again");
    }
    return false;
  }
};

/**
 * Handle automatic session refresh when needed
 * @param expiresIn Time in seconds until session expiry
 */
export const setupSessionRefresh = (expiresIn?: number): (() => void) => {
  if (!expiresIn) return () => {};
  
  // Calculate refresh time (1 minute before expiry, but not less than 30 seconds from now)
  const refreshTime = Math.max((expiresIn - 60), 30) * 1000;
  
  // Setup refresh timer
  const timerId = setTimeout(async () => {
    try {
      await refreshSession();
    } catch (error) {
      console.error("Error during scheduled session refresh:", error);
      // Schedule another attempt in 30 seconds if it fails
      setTimeout(() => refreshSession(), 30000);
    }
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
      .maybeSingle();
      
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

/**
 * Helper function to check if user is authenticated
 * Includes offline detection and retry
 */
export const isUserAuthenticated = async (retries = 1): Promise<{authenticated: boolean, userId?: string}> => {
  try {
    const { data } = await supabase.auth.getSession();
    return {
      authenticated: !!data.session,
      userId: data.session?.user?.id
    };
  } catch (error) {
    console.error("Error checking authentication:", error);
    
    // If it's a network error and we have retries left, try again after a delay
    if (error instanceof Error && 
        error.message.includes('Failed to fetch') && 
        retries > 0) {
      console.log(`Retrying auth check, ${retries} attempts left`);
      
      // Wait 2 seconds before retry
      await new Promise(resolve => setTimeout(resolve, 2000));
      return isUserAuthenticated(retries - 1);
    }
    
    return { authenticated: false };
  }
};

/**
 * Get the current user directly from supabase
 * Added retry capability for intermittent network issues
 */
export const getCurrentUser = async (retries = 1) => {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      console.error("Error getting current user:", error);
      return null;
    }
    return data.user;
  } catch (error) {
    console.error("Unexpected error getting current user:", error);
    
    // If it's a network error and we have retries left, try again after a delay
    if (error instanceof Error && 
        error.message.includes('Failed to fetch') && 
        retries > 0) {
      console.log(`Retrying getCurrentUser, ${retries} attempts left`);
      
      // Wait 2 seconds before retry
      await new Promise(resolve => setTimeout(resolve, 2000));
      return getCurrentUser(retries - 1);
    }
    
    return null;
  }
};
