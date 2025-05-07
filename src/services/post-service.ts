import { supabase } from '@/integrations/supabase/client';

// Define and export PostType enum
export enum PostType {
  TEXT = "text",
  IMAGE = "image",
  REEL = "reel",
  MEME = "meme"
}

// Define types for post interfaces
export interface Post {
  id: string;
  user_id: string;
  created_at: string;
  updated_at?: string | null;
  visibility?: string | null;
  tags?: string[] | null;
  emoji_mood?: string | null;
}

export interface TextPost extends Post {
  content: string;
  title?: string | null;
  allow_comments?: boolean;
  is_anonymous?: boolean;
}

export interface ImagePost extends Post {
  image_urls: string[];
  caption?: string | null;
  allow_comments?: boolean;
  is_anonymous?: boolean;
}

export interface MemePost extends Post {
  image_url: string;
  caption?: string | null;
  allow_comments?: boolean;
  is_anonymous?: boolean;
}

export interface ReelPost extends Post {
  video_url: string;
  thumbnail_url?: string | null;
  caption?: string | null;
  audio?: string | null;
  audio_type?: string | null;
  audio_url?: string | null;
  duration?: number | null;
  original_audio_volume?: number | null;
  overlay_audio_volume?: number | null;
  allow_comments?: boolean;
  allow_duets?: boolean;
  vibe_tag?: string | null;
}

export type PostTypeString = 'text_post' | 'image_post' | 'meme_post' | 'reel_post';

export interface FeedPost {
  id: string;
  type: PostType;  // Using PostType enum
  post_type?: string;  // For backward compatibility
  user_id: string;
  created_at: string;
  updated_at?: string | null;
  content?: string;
  title?: string | null;
  image_urls?: string[];
  image_url?: string;
  video_url?: string;
  caption?: string | null;
  thumbnail_url?: string | null;
  tags?: string[] | null;
  emoji_mood?: string | null;
  visibility?: string | null;
  likes_count?: number;
  comments_count?: number;
  profiles?: {
    id: string;
    username?: string | null;
    full_name?: string | null;
    avatar?: string | null;
  } | null;
  _count?: {
    likes: number;
    comments: number;
  }
}

// Text post functions
export const createTextPost = async (
  userId: string,
  content: string,
  title?: string,
  tags?: string[],
  allowComments: boolean = true,
  isAnonymous: boolean = false,
  moodVibe?: string
) => {
  try {
    const { data, error } = await supabase
      .from('text_posts')
      .insert({
        user_id: userId,
        content,
        title,
        tags,
        allow_comments: allowComments,
        is_anonymous: isAnonymous,
        emoji_mood: moodVibe
      })
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error creating text post:', error);
    return { data: null, error };
  }
};

// Image post functions
export const createImagePost = async (
  userId: string,
  imageUrls: string[],
  caption?: string,
  tags?: string[],
  allowComments: boolean = true,
  isAnonymous: boolean = false,
  moodVibe?: string
) => {
  try {
    const { data, error } = await supabase
      .from('image_posts')
      .insert({
        user_id: userId,
        image_urls: imageUrls,
        caption,
        tags,
        allow_comments: allowComments,
        is_anonymous: isAnonymous,
        emoji_mood: moodVibe
      })
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error creating image post:', error);
    return { data: null, error };
  }
};

// Meme post functions
export const createMemePost = async (
  userId: string,
  imageUrl: string,
  caption?: string,
  tags?: string[],
  allowComments: boolean = true,
  isAnonymous: boolean = false,
  moodVibe?: string
) => {
  try {
    const { data, error } = await supabase
      .from('meme_posts')
      .insert({
        user_id: userId,
        image_url: imageUrl,
        caption,
        tags,
        allow_comments: allowComments,
        is_anonymous: isAnonymous,
        emoji_mood: moodVibe
      })
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error creating meme post:', error);
    return { data: null, error };
  }
};

// Reel post functions
export const createReelPost = async (
  userId: string,
  videoUrl: string,
  thumbnailUrl?: string,
  caption?: string,
  audio?: string,
  audioType?: string,
  audioUrl?: string,
  duration?: number,
  originalAudioVolume?: number,
  overlayAudioVolume?: number,
  tags?: string[],
  allowComments: boolean = true,
  allowDuets: boolean = true,
  vibeTag?: string,
  moodVibe?: string
) => {
  try {
    const { data, error } = await supabase
      .from('reel_posts')
      .insert({
        user_id: userId,
        video_url: videoUrl,
        thumbnail_url: thumbnailUrl,
        caption,
        audio,
        audio_type: audioType,
        audio_url: audioUrl,
        duration,
        original_audio_volume: originalAudioVolume,
        overlay_audio_volume: overlayAudioVolume,
        tags,
        allow_comments: allowComments,
        allow_duets: allowDuets,
        vibe_tag: vibeTag,
        emoji_mood: moodVibe
      })
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error creating reel post:', error);
    return { data: null, error };
  }
};

// Get posts by a specific user
export const getUserPosts = async (userId: string, limit = 10, offset = 0) => {
  try {
    // Function to fetch posts of a specific type
    const fetchPosts = async (table: 'text_posts' | 'image_posts' | 'meme_posts' | 'reel_posts') => {
      const { data, error } = await supabase
        .from(table)
        .select(`
          *,
          profiles:user_id (
            id, username, full_name, avatar
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);
      
      if (error) throw error;
      return data?.map(post => ({ ...post, type: table.replace('_posts', '') })) || [];
    };

    // Fetch all post types
    const textPosts = await fetchPosts('text_posts');
    const imagePosts = await fetchPosts('image_posts');
    const memePosts = await fetchPosts('meme_posts');
    const reelPosts = await fetchPosts('reel_posts');

    // Combine, sort by creation date, and limit
    const allPosts = [...textPosts, ...imagePosts, ...memePosts, ...reelPosts]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, limit);
    
    return { data: allPosts, error: null };
  } catch (error) {
    console.error('Error fetching user posts:', error);
    return { data: [], error };
  }
};

// Get feed posts for the current user
export const getFeedPosts = async (limit = 10, offset = 0) => {
  try {
    // Get current user
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id;
    
    if (!userId) {
      throw new Error("User not authenticated");
    }
    
    // Fetch posts from each table individually and combine them
    const fetchTablePosts = async (table: 'text_posts' | 'image_posts' | 'reel_posts' | 'meme_posts', postType: PostType) => {
      const { data, error } = await supabase
        .from(table)
        .select(`
          *,
          profiles:user_id (
            id, username, full_name, avatar
          )
        `)
        .eq('visibility', 'public')
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) {
        console.error(`Error fetching ${table}:`, error);
        return [];
      }
      
      return data?.map(post => ({ 
        ...post, 
        type: postType
      })) || [];
    };
    
    // Fetch from all post tables
    const textPosts = await fetchTablePosts('text_posts', PostType.TEXT);
    const imagePosts = await fetchTablePosts('image_posts', PostType.IMAGE);
    const reelPosts = await fetchTablePosts('reel_posts', PostType.REEL);
    const memePosts = await fetchTablePosts('meme_posts', PostType.MEME);
    
    // Combine all posts
    const allPosts = [
      ...textPosts,
      ...imagePosts,
      ...reelPosts,
      ...memePosts
    ];
    
    // Sort by created_at and limit
    return { 
      data: allPosts
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(offset, offset + limit), 
      error: null 
    };
  } catch (error) {
    console.error('Error fetching feed posts:', error);
    return { data: [], error };
  }
};

// Check if a post exists
export const checkPostExists = async (postId: string, postType: string): Promise<boolean> => {
  try {
    // Determine the table name based on post type
    let tableName;
    
    switch (postType) {
      case 'text':
      case 'text_post':
        tableName = 'text_posts';
        break;
      case 'image':
      case 'image_post':
        tableName = 'image_posts';
        break;
      case 'meme':
      case 'meme_post':
        tableName = 'meme_posts';
        break;
      case 'reel':
      case 'reel_post':
        tableName = 'reel_posts';
        break;
      default:
        throw new Error(`Invalid post type: ${postType}`);
    }
    
    const { data, error } = await supabase
      .from(tableName)
      .select('id')
      .eq('id', postId)
      .single();
      
    if (error) {
      // If the error is "No rows found", the post doesn't exist
      if (error.code === 'PGRST116') {
        return false;
      }
      throw error;
    }
    
    return !!data;
  } catch (error) {
    console.error(`Error checking if post exists:`, error);
    return false;
  }
};

// Check if user has liked a post - fixed parameter order for consistency
export const hasLikedPost = async (
  postId: string,
  userId: string,
  postType: string
): Promise<boolean> => {
  try {
    // Fix: Normalize post type to handle variations
    let normalizedPostType = postType;
    if (postType.includes('_post')) {
      normalizedPostType = postType.replace('_post', '');
    }
    
    const { data, error } = await supabase
      .from('post_likes')
      .select('id')
      .eq('user_id', userId)
      .eq('post_id', postId)
      .eq('post_type', normalizedPostType)
      .single();
      
    if (error) {
      // If the error is "No rows found", the user hasn't liked the post
      if (error.code === 'PGRST116') {
        return false;
      }
      throw error;
    }
    
    return !!data;
  } catch (error) {
    console.error(`Error checking if user has liked post:`, error);
    return false;
  }
};

// Get the number of likes for a post
export const getPostLikesCount = async (
  postId: string,
  postType: string
): Promise<number> => {
  try {
    // Fix: Normalize post type to handle variations
    let normalizedPostType = postType;
    if (postType.includes('_post')) {
      normalizedPostType = postType.replace('_post', '');
    }
    
    const { count, error } = await supabase
      .from('post_likes')
      .select('id', { count: 'exact' })
      .eq('post_id', postId)
      .eq('post_type', normalizedPostType);
      
    if (error) throw error;
    
    return count || 0;
  } catch (error) {
    console.error(`Error getting post likes count:`, error);
    return 0;
  }
};

// Like a post
export const likePost = async (
  userId: string,
  postId: string,
  postType: string
) => {
  try {
    // Fix: Normalize post type to handle variations
    let normalizedPostType = postType;
    if (postType.includes('_post')) {
      normalizedPostType = postType.replace('_post', '');
    }
    
    // Check if the user has already liked this post
    const alreadyLiked = await hasLikedPost(postId, userId, normalizedPostType);
    
    if (alreadyLiked) {
      // If already liked, do nothing
      return { data: { already_liked: true }, error: null };
    }
    
    // Add a new like
    const { data, error } = await supabase
      .from('post_likes')
      .insert({
        user_id: userId,
        post_id: postId,
        post_type: normalizedPostType
      })
      .select();
      
    if (error) throw error;
    
    return { data: data[0], error: null };
  } catch (error) {
    console.error(`Error liking post:`, error);
    return { data: null, error };
  }
};

// Unlike a post
export const unlikePost = async (
  userId: string,
  postId: string,
  postType: string
) => {
  try {
    // Fix: Normalize post type to handle variations
    let normalizedPostType = postType;
    if (postType.includes('_post')) {
      normalizedPostType = postType.replace('_post', '');
    }
    
    const { data, error } = await supabase
      .from('post_likes')
      .delete()
      .match({
        user_id: userId,
        post_id: postId,
        post_type: normalizedPostType
      })
      .select();
      
    if (error) {
      // If the error is "No rows found", the user hadn't liked the post
      if (error.code === 'PGRST116') {
        return { data: { was_not_liked: true }, error: null };
      }
      throw error;
    }
    
    const result = data && data.length > 0 ? data[0] : { success: true };
    return { data: result, error: null };
  } catch (error) {
    console.error(`Error unliking post:`, error);
    return { data: null, error };
  }
};

// Get like count
export const getLikeCount = async (postId: string, postType: string) => {
  try {
    const { count, error } = await supabase
      .from('post_likes')
      .select('id', { count: 'exact' })
      .eq('post_id', postId)
      .eq('post_type', postType);
    
    if (error) throw error;
    
    return count || 0;
  } catch (error) {
    console.error('Error getting like count:', error);
    return 0;
  }
};

// Now let's create a new file for our interactive story application

</edits_to_apply>
