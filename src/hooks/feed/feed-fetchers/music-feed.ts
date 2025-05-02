
import { supabase } from "@/integrations/supabase/client";
import { Post, createSafeProfile } from "../feed-utils";
import { FeedPost } from "@/services/post-service";

export async function fetchMusicPosts(limit: number = 10, offset: number = 0): Promise<Post[]> {
  try {
    const { data: reelPosts, error } = await supabase
      .from('reel_posts')
      .select(`
        *,
        profiles:user_id (*)
      `)
      .not('audio_url', 'is', null)
      .eq('visibility', 'public')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (error) {
      console.error('Error fetching music reels:', error);
      return [];
    }
    
    if (!reelPosts || reelPosts.length === 0) {
      return [];
    }
    
    // Transform reels to the common Post format
    return reelPosts.map(post => {
      // Create a safe profile with default values for missing or invalid profile data
      const safeProfile = createSafeProfile(post.profiles);
          
      return {
        id: post.id,
        userId: post.user_id,
        user_id: post.user_id,
        type: 'reel' as const,
        videoUrl: post.video_url,
        caption: post.caption,
        thumbnailUrl: post.thumbnail_url,
        audioUrl: post.audio_url,
        audioType: post.audio_type,
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
      } as Post;
    });
  } catch (error) {
    console.error('Error fetching music posts:', error);
    return [];
  }
}

export async function fetchMusicFeedPosts(limit: number = 10, offset: number = 0): Promise<FeedPost[]> {
  try {
    const { data: reelPosts, error } = await supabase
      .from('reel_posts')
      .select(`
        *,
        profiles:user_id (*)
      `)
      .not('audio_url', 'is', null)
      .eq('visibility', 'public')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (error) {
      console.error('Error fetching music reels:', error);
      return [];
    }
    
    if (!reelPosts || reelPosts.length === 0) {
      return [];
    }
    
    // Transform to FeedPost format
    return reelPosts.map(post => {
      // Create a safe profile
      const safeProfile = createSafeProfile(post.profiles);
          
      return {
        id: post.id,
        user_id: post.user_id,
        content: null,
        title: null,
        image_urls: null,
        video_url: post.video_url,
        thumbnail_url: post.thumbnail_url,
        caption: post.caption,
        tags: post.tags,
        emoji_mood: null,
        post_type: 'reel',
        created_at: post.created_at,
        visibility: post.visibility,
        likes_count: 0,
        comments_count: 0,
        profiles: safeProfile
      } as FeedPost;
    });
  } catch (error) {
    console.error('Error fetching music feed posts:', error);
    return [];
  }
}
