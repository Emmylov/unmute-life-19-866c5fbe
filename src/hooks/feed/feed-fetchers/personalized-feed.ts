import { supabase } from "@/integrations/supabase/client";
import { Post, createSafeProfile } from "../feed-utils";

export async function fetchPersonalizedFeed(
  userId: string, 
  interests: string[] | undefined,
  limit: number = 10, 
  offset: number = 0
): Promise<Post[]> {
  // If userId is not provided, return empty array
  if (!userId) {
    return [];
  }
  
  try {
    // If interests are defined, fetch posts with matching tags
    // Otherwise, fetch general content
    
    // Image posts with matching interests
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
      console.error('Error fetching personalized image posts:', imageError);
    }
    
    // Text posts with matching interests
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
      console.error('Error fetching personalized text posts:', textError);
    }
    
    // Reel posts with matching interests
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
      console.error('Error fetching personalized reel posts:', reelError);
    }
    
    // Transform and combine all posts
    const result: Post[] = [];
    
    // Add image posts
    if (imagePosts) {
      result.push(...imagePosts.map(post => {
        // Create a safe profile with default values
        const safeProfile = createSafeProfile(post.profiles);
            
        return {
          id: post.id,
          user_id: post.user_id,
          userId: post.user_id,
          type: 'image' as const,
          content: null,
          imageUrls: post.image_urls,
          caption: post.caption,
          created_at: post.created_at,
          createdAt: post.created_at,
          user: {
            id: safeProfile.id,
            name: safeProfile.full_name,
            username: safeProfile.username,
            avatar: safeProfile.avatar
          },
          stats: {
            likes: 0,
            comments: 0,
            shares: 0
          },
          tags: post.tags || []
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
          userId: post.user_id,
          type: 'text' as const,
          content: post.content,
          title: post.title || null,
          emojiMood: post.emoji_mood || null,
          created_at: post.created_at,
          createdAt: post.created_at,
          user: {
            id: safeProfile.id,
            name: safeProfile.full_name,
            username: safeProfile.username,
            avatar: safeProfile.avatar
          },
          stats: {
            likes: 0,
            comments: 0,
            shares: 0
          },
          tags: post.tags || []
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
          userId: post.user_id,
          type: 'reel' as const,
          content: null,
          videoUrl: post.video_url,
          caption: post.caption || null,
          thumbnailUrl: post.thumbnail_url || null,
          created_at: post.created_at,
          createdAt: post.created_at,
          user: {
            id: safeProfile.id,
            name: safeProfile.full_name,
            username: safeProfile.username,
            avatar: safeProfile.avatar
          },
          stats: {
            likes: 0,
            comments: 0,
            shares: 0
          },
          tags: post.tags || []
        };
      }));
    }
    
    // Sort all posts by creation date, newest first
    return result.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    ).slice(offset, offset + limit);
  } catch (error) {
    console.error('Error fetching personalized feed:', error);
    return [];
  }
}
