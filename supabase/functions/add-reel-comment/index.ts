
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Received request to add-reel-comment function");
    const { reelId, userId, content, createdAt } = await req.json();

    console.log("Request data:", { reelId, userId, content, createdAt });

    if (!reelId || !userId || !content) {
      console.error("Missing required parameters");
      return new Response(
        JSON.stringify({
          success: false,
          error: "Missing required parameters"
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    // First check if the reel exists in posts_reels table
    const { data: reelExists, error: reelCheckError } = await supabaseClient
      .from("posts_reels")
      .select("id")
      .eq("id", reelId)
      .maybeSingle();

    if (reelCheckError) {
      console.error("Error checking reel:", reelCheckError);
      throw reelCheckError;
    }

    if (!reelExists) {
      console.error("Reel not found:", reelId);
      return new Response(
        JSON.stringify({
          success: false,
          error: "Reel not found"
        }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Insert the comment directly
    const { data: insertedComment, error: insertError } = await supabaseClient
      .from("reel_comments")
      .insert({
        reel_id: reelId,
        user_id: userId,
        content: content,
        created_at: createdAt || new Date().toISOString()
      })
      .select('id')
      .single();
      
    if (insertError) {
      console.error("Direct insert error:", insertError);
      throw insertError;
    }
    
    console.log("Comment added successfully:", insertedComment);
    
    return new Response(
      JSON.stringify({ 
        success: true,
        id: insertedComment.id
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message 
      }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
