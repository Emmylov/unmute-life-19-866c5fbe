
import { supabase } from "@/integrations/supabase/client";
import { uploadImage } from "./upload-service";
import { uploadReelVideo } from "./upload-service";
import { toast } from "sonner";
import { createSafeProfile } from "@/hooks/feed/feed-utils";

// Types for our different post structures
export type TextPost = {
  id: string;
  user_id: string;
  title?: string;
  content: string;
  tags?: string[];
  emoji_mood?: string;
  created_at: string;
  visibility?: string;
};

export type ImagePost = {
  id: string;
  user_id: string;
  image_urls: string[];
  caption?: string;
  tags?: string[];
  created_at: string;
  visibility?: string;
};

export type ReelPost = {
  id: string;
  user_id: string;
  video_url: string;
  caption?: string;
  thumbnail_url?: string;
  audio_url?: string;
  audio_type?: string;
  tags?: string[];
  created_at: string;
  visibility?: string;
};

export type MemePost = {
  id: string;
  user_id: string;
  image_url: string;
  top_text?: string;
  bottom_text?: string;
  category?: string;
  created_at: string;
  visibility?: string;
};

export type PostComment = {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  post_type: string;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
  profiles?: {
    id: string;
    username: string | null;
    avatar: string | null;
    full_name: string | null;
  };
};

export type PostLike = {
  id: string;
  post_id: string;
  user_id: string;
  post_type: string;
  created_at: string;
};

export type FeedPost = {
  id: string;
  user_id: string;
  content?: string | null;
  title?: string | null;
  image_urls?: string[] | null;
  video_url?: string | null;
  caption?: string | null;
  thumbnail_url?: string | null;
  tags?: string[] | null;
  emoji_mood?: string | null;
  post_type: 'text' | 'image' | 'reel' | 'meme';
  created_at: string;
  visibility?: string;
  likes_count: number;
  comments_count: number;
  profiles?: {
    id: string;
    username: string | null;
    avatar: string | null;
    full_name: string | null;
  };
};

// Create a new text post
export const createTextPost = async (params: {
  user_id: string;
  content: string;
  title?: string;
  tags?: string[];
  emoji_mood?: string;
  visibility?: string;
}): Promise<TextPost | null> => {
  try {
    const { data, error } = await supabase
      .from("text_posts")
      .insert({
        user_id: params.user_id,
        content: params.content,
        title: params.title,
        tags: params.tags,
        emoji_mood: params.emoji_mood,
        visibility: params.visibility || 'public'
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating text post:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Exception creating text post:", error);
    throw error;
  }
};

// Create a new image post
export const createImagePost = async (
  userId: string,
  imageFiles: File[],
  caption?: string,
  tags?: string[]
): Promise<ImagePost | null> => {
  try {
    // Upload all images and get their URLs
    const uploadPromises = imageFiles.map(file => uploadImage(file));
    const imageUrls = await Promise.all(uploadPromises);

    // Insert the post into the database
    const { data, error } = await supabase
      .from("image_posts")
      .insert({
        user_id: userId,
        image_urls: imageUrls,
        caption,
        tags
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating image post:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Exception creating image post:", error);
    throw error;
  }
};

// Create a new reel post
export const createReelPost = async (
  userId: string,
  videoFile: File,
  caption?: string,
  tags?: string[],
  audioUrl?: string,
  audioType: 'original' | 'library' = 'original'
): Promise<ReelPost | null> => {
  try {
    // Upload the video
    const videoData = await uploadReelVideo(videoFile);
    const videoUrl = videoData.videoUrl;
    // Ensure we're using the correct property name - thumbnail_url
    const thumbnailUrl = videoData.thumbnailUrl || null;

    // Insert the reel into the database
    const { data, error } = await supabase
      .from("reel_posts")
      .insert({
        user_id: userId,
        video_url: videoUrl,
        caption,
        tags,
        thumbnail_url: thumbnailUrl,
        audio_url: audioUrl,
        audio_type: audioType
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating reel post:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error creating reel post:", error);
    throw error;
  }
};

// Create a new meme post
export const createMemePost = async (
  userId: string,
  imageUrl: string,
  topText?: string,
  bottomText?: string,
  category?: string
): Promise<MemePost | null> => {
  try {
    const { data, error } = await supabase
      .from("meme_posts")
      .insert({
        user_id: userId,
        image_url: imageUrl,
        top_text: topText,
        bottom_text: bottomText,
        category
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating meme post:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error creating meme post:", error);
    throw error;
  }
};

// Get feed posts using the Supabase function
export const getFeedPosts = async (userId: string, limit: number = 20): Promise<FeedPost[]> => {
  try {
    // Use the new database function to get feed posts
    const { data, error } = await supabase
      .rpc('get_feed_posts', {
        user_uuid: userId,
        post_limit: limit
      });

    if (error) {
      console.error("Error fetching feed posts:", error);
      throw error;
    }

    if (!data) {
      return [];
    }

    // Get user profiles for all posts
    const userIds = [...new Set(data.map(post => post.user_id))];
    
    // Fetch all profiles in one query
    const { data: profilesData, error: profilesError } = await supabase
      .from("profiles")
      .select("id, username, avatar, full_name")
      .in("id", userIds);

    if (profilesError) {
      console.error("Error fetching profiles:", profilesError);
    }

    // Create a map for quick profile lookup
    const profileMap = new Map();
    if (profilesData) {
      profilesData.forEach(profile => {
        profileMap.set(profile.id, profile);
      });
    }

    // Combine posts with profiles and ensure proper typing
    const postsWithProfiles = data.map(post => {
      // Ensure post_type is one of the allowed values
      const safePostType = post.post_type === 'text' || 
                           post.post_type === 'image' || 
                           post.post_type === 'reel' || 
                           post.post_type === 'meme' 
                           ? post.post_type 
                           : 'text' as const; // Default to 'text' if unknown type
      
      return {
        ...post,
        post_type: safePostType,
        profiles: profileMap.get(post.user_id) || null
      };
    }) as FeedPost[];

    return postsWithProfiles;
  } catch (error) {
    console.error("Exception fetching feed posts:", error);
    throw error;
  }
};

// Get user's posts (can filter by type)
export const getUserPosts = async (
  userId: string, 
  limit: number = 10, 
  type?: 'text' | 'image' | 'reel' | 'meme'
): Promise<FeedPost[]> => {
  try {
    let posts: any[] = [];
    
    // If type is specified, query specific table
    if (type) {
      const tableName = `${type}_posts`;
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      
      if (data) {
        // Transform to FeedPost format
        posts = data.map(post => {
          if (type === 'text') {
            return {
              ...post,
              post_type: 'text' as const,
              likes_count: 0,
              comments_count: 0
            };
          } else if (type === 'image') {
            return {
              ...post,
              post_type: 'image' as const,
              likes_count: 0,
              comments_count: 0
            };
          } else if (type === 'reel') {
            return {
              ...post,
              post_type: 'reel' as const,
              likes_count: 0,
              comments_count: 0
            };
          } else if (type === 'meme') {
            return {
              ...post,
              post_type: 'meme' as const,
              // For memes, convert image_url to image_urls array for consistency
              image_urls: post.image_url ? [post.image_url] : [],
              likes_count: 0,
              comments_count: 0
            };
          }
          // This should never happen due to the type constraint, but TypeScript requires it
          return {
            ...post,
            post_type: 'text' as const,
            likes_count: 0,
            comments_count: 0
          };
        });
      }
    } else {
      // Use the feed posts function if no specific type
      const { data, error } = await supabase
        .rpc('get_feed_posts', {
          user_uuid: userId,
          post_limit: limit
        });
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        // Ensure post_type is cast to the correct type
        posts = data.map(post => ({
          ...post,
          post_type: (post.post_type === 'text' || 
                     post.post_type === 'image' || 
                     post.post_type === 'reel' || 
                     post.post_type === 'meme') 
                     ? post.post_type 
                     : 'text'
        })) as FeedPost[];
      }
    }
    
    // Get user profiles
    if (posts.length > 0) {
      const { data: profileData } = await supabase
        .from("profiles")
        .select("id, username, avatar, full_name")
        .eq("id", userId)
        .single();
        
      // Add profile data to all posts
      posts = posts.map(post => ({
        ...post,
        profiles: profileData || null
      }));
    }
    
    return posts as FeedPost[];
  } catch (error) {
    console.error(`Error fetching ${type || 'user'} posts:`, error);
    return [];
  }
};

// Check if a post exists
export const checkPostExists = async (postId: string, postType: string): Promise<boolean> => {
  try {
    const tableName = `${postType}_posts`;
    const { data, error } = await supabase
      .from(tableName)
      .select('id')
      .eq('id', postId)
      .maybeSingle();
      
    if (error) {
      console.error(`Error checking if ${postType} post exists:`, error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error('Error checking post existence:', error);
    return false;
  }
};

// Like a post
export const likePost = async (postId: string, userId: string, postType: string): Promise<boolean> => {
  try {
    // Use the database function to toggle the like
    const { data, error } = await supabase
      .rpc('toggle_post_like', {
        p_post_id: postId,
        p_user_id: userId,
        p_post_type: postType
      });
    
    if (error) {
      console.error("Error toggling post like:", error);
      throw error;
    }
    
    return data || false;
  } catch (error) {
    console.error("Exception toggling post like:", error);
    throw error;
  }
};

// Check if user has liked a post
export const hasLikedPost = async (postId: string, userId: string, postType: string): Promise<boolean> => {
  try {
    // Use the database function to check if post is liked
    const { data, error } = await supabase
      .rpc('user_has_liked_post', {
        p_post_id: postId,
        p_user_id: userId,
        p_post_type: postType
      });
    
    if (error) {
      console.error("Error checking if post is liked:", error);
      return false;
    }
    
    return data || false;
  } catch (error) {
    console.error("Exception checking if post is liked:", error);
    return false;
  }
};

// Get post likes count
export const getPostLikesCount = async (postId: string, postType: string): Promise<number> => {
  try {
    const { count, error } = await supabase
      .from('post_likes')
      .select('*', { count: 'exact', head: true })
      .eq('post_id', postId)
      .eq('post_type', postType);
    
    if (error) {
      console.error("Error getting post likes count:", error);
      return 0;
    }
    
    return count || 0;
  } catch (error) {
    console.error("Exception getting post likes count:", error);
    return 0;
  }
};

// Add a comment to a post
export const addComment = async (postId: string, userId: string, content: string, postType: string): Promise<PostComment | null> => {
  try {
    // Use the database function to add a comment with profile data
    const { data, error } = await supabase
      .rpc('add_post_comment', {
        p_post_id: postId,
        p_user_id: userId,
        p_content: content,
        p_post_type: postType
      });
    
    if (error) {
      console.error("Error adding comment:", error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error("Exception adding comment:", error);
    throw error;
  }
};

// Get comments for a post
export const getComments = async (postId: string, postType: string): Promise<PostComment[]> => {
  try {
    const { data, error } = await supabase
      .from('post_comments')
      .select(`
        *,
        profiles:user_id (
          id, username, avatar, full_name
        )
      `)
      .eq('post_id', postId)
      .eq('post_type', postType)
      .eq('is_deleted', false)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error getting comments:", error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error("Exception getting comments:", error);
    return [];
  }
};

// Get comments count for a post
export const getCommentsCount = async (postId: string, postType: string): Promise<number> => {
  try {
    const { count, error } = await supabase
      .from('post_comments')
      .select('*', { count: 'exact', head: true })
      .eq('post_id', postId)
      .eq('post_type', postType)
      .eq('is_deleted', false);
    
    if (error) {
      console.error("Error getting comments count:", error);
      return 0;
    }
    
    return count || 0;
  } catch (error) {
    console.error("Exception getting comments count:", error);
    return 0;
  }
};
