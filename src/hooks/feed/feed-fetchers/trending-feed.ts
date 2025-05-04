
import { supabase } from "@/integrations/supabase/client";
import { createSafeProfile } from "@/utils/safe-data-utils";
import { FeedPost, PostType } from "@/services/post-service";

export async function fetchTrendingFeed(limit: number = 10, offset: number = 0): Promise<FeedPost[]> {
  try {
    // Fetch posts from different tables
    // For our implementation, we'll just get the most recent posts across all types
    
    // Image posts
    const { data: imagePosts, error: imageError } = await supabase
      .from('image_posts')
      .select(`
        *,
        profiles:user_id (*)
      `)
      .eq('visibility', 'public')
      .order('created_at', { ascending: false })
      .limit(limit / 3);
    
    if (imageError) {
      console.error('Error fetching image posts:', imageError);
    }
    
    // Text posts
    const { data: textPosts, error: textError } = await supabase
      .from('text_posts')
      .select(`
        *,
        profiles:user_id (*)
      `)
      .eq('visibility', 'public')
      .order('created_at', { ascending: false })
      .limit(limit / 3);
    
    if (textError) {
      console.error('Error fetching text posts:', textError);
    }
    
    // Reel posts
    const { data: reelPosts, error: reelError } = await supabase
      .from('reel_posts')
      .select(`
        *,
        profiles:user_id (*)
      `)
      .eq('visibility', 'public')
      .order('created_at', { ascending: false })
      .limit(limit / 3);
    
    if (reelError) {
      console.error('Error fetching reel posts:', reelError);
    }
    
    // Transform and combine all posts
    const result: FeedPost[] = [];
    
    // Add image posts
    if (imagePosts) {
      result.push(...imagePosts.map(post => {
        // Create a safe profile with default values
        const safeProfile = createSafeProfile(post.profiles);
            
        return {
          id: post.id,
          user_id: post.user_id,
          post_type: 'image' as PostType,
          content: null,
          image_urls: post.image_urls,
          caption: post.caption,
          created_at: post.created_at,
          visibility: post.visibility || 'public',
          profiles: safeProfile,
          tags: post.tags || null
        };
      }));
    }
    
    // Add text posts
    if (textPosts) {
      result.push(...textPosts.map(post => {
        // Create a safe profile with default values
        const safeProfile = createSafeProfile(post.profiles);
            
        return {
          id: post.id,
          user_id: post.user_id,
          post_type: 'text' as PostType,
          content: post.content,
          title: post.title || null,
          emoji_mood: post.emoji_mood || null,
          created_at: post.created_at,
          visibility: post.visibility || 'public',
          profiles: safeProfile,
          tags: post.tags || null
        };
      }));
    }
    
    // Add reel posts
    if (reelPosts) {
      result.push(...reelPosts.map(post => {
        // Create a safe profile with default values
        const safeProfile = createSafeProfile(post.profiles);
            
        return {
          id: post.id,
          user_id: post.user_id,
          post_type: 'reel' as PostType,
          content: null,
          video_url: post.video_url,
          caption: post.caption || null,
          thumbnail_url: post.thumbnail_url || null,
          created_at: post.created_at,
          visibility: post.visibility || 'public',
          profiles: safeProfile,
          tags: post.tags || null
        };
      }));
    }
    
    // Sort all posts by creation date, newest first
    return result.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  } catch (error) {
    console.error('Error fetching trending feed:', error);
    return [];
  }
}
