
import { supabase } from "@/integrations/supabase/client";
import { Post, createSafeProfile } from "../feed-utils";

// Update this function to use the correct table names and handle profiles properly
export async function fetchFollowingFeed(userId: string, limit: number = 10, offset: number = 0): Promise<Post[]> {
  // If userId is not provided, return empty array
  if (!userId) {
    return [];
  }
  
  try {
    // Get list of users that the current user follows
    const { data: followedUsers, error: followingError } = await supabase
      .from('user_follows')
      .select('following_id')
      .eq('follower_id', userId);
    
    if (followingError) {
      console.error('Error fetching followed users:', followingError);
      return [];
    }
    
    // If not following anyone, return empty array
    if (!followedUsers || followedUsers.length === 0) {
      return [];
    }
    
    // Extract the user IDs
    const followingIds = followedUsers.map(follow => follow.following_id);
    
    // Fetch posts from users the current user follows from our new tables
    const { data: imagePosts, error: imageError } = await supabase
      .from('image_posts')
      .select(`
        *,
        profiles:user_id (*)
      `)
      .in('user_id', followingIds)
      .eq('visibility', 'public')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (imageError) {
      console.error('Error fetching image posts:', imageError);
    }
    
    const { data: textPosts, error: textError } = await supabase
      .from('text_posts')
      .select(`
        *,
        profiles:user_id (*)
      `)
      .in('user_id', followingIds)
      .eq('visibility', 'public')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (textError) {
      console.error('Error fetching text posts:', textError);
    }
    
    const { data: reelPosts, error: reelError } = await supabase
      .from('reel_posts')
      .select(`
        *,
        profiles:user_id (*)
      `)
      .in('user_id', followingIds)
      .eq('visibility', 'public')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (reelError) {
      console.error('Error fetching reel posts:', reelError);
    }
    
    // Transform all posts to the common Post format
    const result: Post[] = [];
    
    // Add image posts
    if (imagePosts) {
      result.push(...imagePosts.map(post => {
        // Create a safe profile with default values if profile data is missing or invalid
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
        // Create a safe profile with default values if profile data is missing or invalid
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
        // Create a safe profile with default values if profile data is missing or invalid
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
    );
  } catch (error) {
    console.error('Error fetching following feed:', error);
    return [];
  }
}
