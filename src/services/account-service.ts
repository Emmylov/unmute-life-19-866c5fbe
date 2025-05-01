
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Deletes a user account and all associated data
 * @param userId The ID of the user to delete
 * @param password The user's password for verification
 * @returns Promise indicating success/failure
 */
export const deleteUserAccount = async (userId: string, password: string): Promise<boolean> => {
  try {
    // First verify the user's credentials
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: (await supabase.auth.getUser()).data.user?.email || "",
      password
    });
    
    if (authError || !authData.user) {
      toast.error("Password verification failed");
      return false;
    }
    
    // Call edge function to delete the user's account
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/delete-user-account`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
      },
      body: JSON.stringify({ userId })
    });
    
    const result = await response.json();
    
    if (!response.ok || !result.success) {
      throw new Error(result.error || "Failed to delete account");
    }
    
    // Sign out after successful deletion
    await supabase.auth.signOut();
    
    toast.success("Your account has been successfully deleted");
    return true;
  } catch (error) {
    console.error("Error deleting account:", error);
    toast.error("Failed to delete account: " + (error.message || "Unknown error"));
    return false;
  }
};
