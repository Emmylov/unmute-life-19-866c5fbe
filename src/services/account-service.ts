
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { withTimeout } from "@/utils/error-handler";

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
      console.error("Password verification failed:", authError);
      throw new Error("Password verification failed");
    }
    
    // Call edge function with timeout to handle potential network issues
    const response = await withTimeout(
      fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/delete-user-account`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        },
        body: JSON.stringify({ userId })
      }), 
      10000 // 10 second timeout
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Delete account API error:", errorText);
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || "Failed to delete account");
    }
    
    // Sign out after successful deletion
    await supabase.auth.signOut();
    return true;
  } catch (error: any) {
    console.error("Error deleting account:", error);
    throw error;
  }
};
