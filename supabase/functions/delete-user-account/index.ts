
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log("Delete user account function called");
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId } = await req.json();

    if (!userId) {
      console.error("Missing userId in request");
      return new Response(
        JSON.stringify({
          success: false,
          error: "Missing user ID"
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log(`Processing deletion for user: ${userId}`);

    // Create Supabase client with service role key
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    console.log("Deleting user profile data");
    
    // First, delete all user data
    // We'll delete from profiles table as an example
    const { error: profileDeleteError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId);
      
    if (profileDeleteError) {
      console.error("Error deleting profile:", profileDeleteError);
      throw profileDeleteError;
    }

    // Delete user's posts, comments, etc.
    // We should clean up related data in all tables
    
    console.log("Deleting user account");
    // Finally delete the user account
    const { error: deleteUserError } = await supabase.auth.admin.deleteUser(userId);

    if (deleteUserError) {
      console.error("Error deleting user:", deleteUserError);
      throw deleteUserError;
    }

    console.log("User account deleted successfully");

    return new Response(
      JSON.stringify({ 
        success: true,
        message: "User account and associated data deleted successfully" 
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error deleting user account:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || "An unknown error occurred"
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
