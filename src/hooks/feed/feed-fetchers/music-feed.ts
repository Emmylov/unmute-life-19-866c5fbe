
import { supabase } from "@/integrations/supabase/client";
import { Post } from "../feed-utils";

export async function fetchMusicFeed(limit: number, offset: number): Promise<Post[]> {
  try {
    const { data: reels, error } = await supabase
      .from("posts_reels")
      .select("*, profiles:profiles(*)")
      .not("audio_url", "is", null)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (error) throw error;
    
    return (reels || []).map((reel: any) => ({ ...reel, type: 'reel' }));
  } catch (error) {
    console.error("Error fetching music feed:", error);
    return [];
  }
}
