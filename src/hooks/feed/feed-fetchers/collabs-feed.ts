
import { supabase } from "@/integrations/supabase/client";
import { Post } from "../feed-utils";
import { rpcCall, toTypedPromise } from "./utils";

export async function fetchCollabsFeed(limit: number, offset: number): Promise<Post[]> {
  try {
    // Check if the collabs table exists using a safer approach
    const { data: hasCollabsData, error: hasCollabsError } = await rpcCall<boolean>('check_table_exists', { table_name: 'collabs' });
    
    if (hasCollabsError) {
      console.error("Error checking if collabs table exists:", hasCollabsError);
      return await searchCollabsInPosts(limit, offset);
    }
    
    if (hasCollabsData) {
      // Handle collabs table if it exists
      try {
        // Use a safer approach to query a dynamically named table
        const { data, error } = await supabase
          .from('collabs')
          .select("*, profiles:user_id(*)")
          .order("created_at", { ascending: false })
          .range(offset, offset + limit - 1);
        
        if (error) throw error;
        return (data || []).map((collab: any) => ({ ...collab, type: 'collab' }));
      } catch (e) {
        console.error("Error querying collabs table:", e);
        // Fall back to searching in other posts
        return await searchCollabsInPosts(limit, offset);
      }
    } else {
      // Search for collabs in other posts
      return await searchCollabsInPosts(limit, offset);
    }
  } catch (error) {
    console.error("Error fetching collabs feed:", error);
    return [];
  }
}

// Helper function to search for collabs in other post types
async function searchCollabsInPosts(limit: number, offset: number): Promise<Post[]> {
  const imagePostsPromise = toTypedPromise<any[]>(
    supabase
      .from("posts_images")
      .select("*, profiles:profiles(*)")
      .or('caption.ilike.%collab%,tags.cs.{collab}')
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)
  );
  
  const textPostsPromise = toTypedPromise<any[]>(
    supabase
      .from("posts_text")
      .select("*, profiles:profiles(*)")
      .or('title.ilike.%collab%,body.ilike.%collab%,tags.cs.{collab}')
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)
  );
  
  const reelsPostsPromise = toTypedPromise<any[]>(
    supabase
      .from("posts_reels")
      .select("*, profiles:profiles(*)")
      .or('caption.ilike.%collab%,tags.cs.{collab}')
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)
  );
  
  // Wait for all promises to resolve
  const [imagePostsRes, textPostsRes, reelsPostsRes] = await Promise.all([
    imagePostsPromise,
    textPostsPromise,
    reelsPostsPromise
  ]);
  
  // Process results
  const combinedPosts: Post[] = [
    ...(imagePostsRes.data || []).map((post: any) => ({ ...post, type: 'image' })),
    ...(textPostsRes.data || []).map((post: any) => ({ ...post, type: 'text' })),
    ...(reelsPostsRes.data || []).map((post: any) => ({ ...post, type: 'reel' }))
  ];
  
  return combinedPosts
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, limit);
}
