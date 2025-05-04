import { supabase } from "@/integrations/supabase/client";

// Fetch reels from reel_posts table
export async function fetchReels() {
  try {
    const { data, error } = await supabase
      .from('reel_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }
  catch (error) {
    console.error('Error fetching reels:', error);
    return [];
  }
}

export async function fetchReelById(id: string) {
  try {
    const { data, error } = await supabase
      .from('reel_posts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }
  catch (error) {
    console.error(`Error fetching reel with id ${id}:`, error);
    return null;
  }
}

export async function fetchReelsByUserId(userId: string) {
  try {
    const { data, error } = await supabase
      .from('reel_posts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }
  catch (error) {
    console.error(`Error fetching reels for user ${userId}:`, error);
    return [];
  }
}

export async function createReel(reelData: {
  user_id: string;
  video_url: string;
  caption?: string;
  thumbnail_url?: string;
  tags?: string[];
  audio_type?: string;
  audio_url?: string;
}) {
  try {
    const { data, error } = await supabase
      .from('reel_posts')
      .insert([reelData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }
  catch (error) {
    console.error('Error creating reel:', error);
    return null;
  }
}

export async function updateReel(
  id: string,
  updates: {
    caption?: string;
    tags?: string[];
    thumbnail_url?: string;
    audio_type?: string;
    audio_url?: string;
  }
) {
  try {
    const { data, error } = await supabase
      .from('reel_posts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
  catch (error) {
    console.error(`Error updating reel ${id}:`, error);
    return null;
  }
}

export async function deleteReel(id: string) {
  try {
    const { error } = await supabase
      .from('reel_posts')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }
  catch (error) {
    console.error(`Error deleting reel ${id}:`, error);
    return false;
  }
}

export async function likeReel(reelId: string, userId: string) {
  try {
    // First check if the like already exists
    const { data: existingLike, error: checkError } = await supabase
      .from('post_likes')
      .select('*')
      .eq('post_id', reelId)
      .eq('user_id', userId)
      .eq('post_type', 'reel')
      .maybeSingle();

    if (checkError) throw checkError;

    // If like already exists, return early
    if (existingLike) return true;

    // Otherwise, insert the new like
    const { error } = await supabase
      .from('post_likes')
      .insert([
        {
          post_id: reelId,
          user_id: userId,
          post_type: 'reel'
        }
      ]);

    if (error) throw error;
    return true;
  }
  catch (error) {
    console.error(`Error liking reel ${reelId}:`, error);
    return false;
  }
}

export async function unlikeReel(reelId: string, userId: string) {
  try {
    const { error } = await supabase
      .from('post_likes')
      .delete()
      .eq('post_id', reelId)
      .eq('user_id', userId)
      .eq('post_type', 'reel');

    if (error) throw error;
    return true;
  }
  catch (error) {
    console.error(`Error unliking reel ${reelId}:`, error);
    return false;
  }
}

export async function hasLikedReel(reelId: string, userId: string) {
  try {
    const { data, error } = await supabase
      .from('post_likes')
      .select('*')
      .eq('post_id', reelId)
      .eq('user_id', userId)
      .eq('post_type', 'reel')
      .maybeSingle();

    if (error) throw error;
    return !!data;
  }
  catch (error) {
    console.error(`Error checking if user ${userId} liked reel ${reelId}:`, error);
    return false;
  }
}

export async function getReelLikesCount(reelId: string) {
  try {
    const { count, error } = await supabase
      .from('post_likes')
      .select('*', { count: 'exact', head: true })
      .eq('post_id', reelId)
      .eq('post_type', 'reel');

    if (error) throw error;
    return count || 0;
  }
  catch (error) {
    console.error(`Error getting likes count for reel ${reelId}:`, error);
    return 0;
  }
}

export async function getReelCommentsCount(reelId: string) {
  try {
    const { count, error } = await supabase
      .from('post_comments')
      .select('*', { count: 'exact', head: true })
      .eq('post_id', reelId)
      .eq('post_type', 'reel')
      .eq('is_deleted', false);

    if (error) throw error;
    return count || 0;
  }
  catch (error) {
    console.error(`Error getting comments count for reel ${reelId}:`, error);
    return 0;
  }
}

export async function getTrendingReels(limit = 10) {
  try {
    // Replaced the incorrect table name 'posts_reels' with 'reel_posts' in the select statement
    const { data, error } = await supabase
      .from('reel_posts')
      .select(`
        *,
        profiles:user_id (*)
      `)
      .eq('visibility', 'public')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }
  catch (error) {
    console.error('Error fetching trending reels:', error);
    return [];
  }
}
