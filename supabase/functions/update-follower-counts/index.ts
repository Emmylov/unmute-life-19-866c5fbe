
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { follower_id, following_id, is_follow } = await req.json();
    
    if (!follower_id || !following_id) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { 
          status: 400, 
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders 
          } 
        }
      );
    }
    
    if (is_follow) {
      // Increment follower count for the user being followed
      await supabaseClient
        .from("profiles")
        .update({ followers: supabaseClient.rpc('increment', { 'row_id': following_id }) })
        .eq('id', following_id);
      
      // Increment following count for the user who followed
      await supabaseClient
        .from("profiles")
        .update({ following: supabaseClient.rpc('increment', { 'row_id': follower_id }) })
        .eq('id', follower_id);
    } else {
      // Decrement follower count for the user being unfollowed
      await supabaseClient
        .from("profiles")
        .update({ followers: supabaseClient.rpc('decrement', { 'row_id': following_id }) })
        .eq('id', following_id);
      
      // Decrement following count for the user who unfollowed
      await supabaseClient
        .from("profiles")
        .update({ following: supabaseClient.rpc('decrement', { 'row_id': follower_id }) })
        .eq('id', follower_id);
    }
    
    return new Response(
      JSON.stringify({ success: true }),
      { 
        status: 200, 
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders 
        } 
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders 
        } 
      }
    );
  }
});
