
import { supabase, STORAGE_BUCKETS } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";

// Upload an image to storage and return the URL
export const uploadImage = async (file: File, bucket: string = STORAGE_BUCKETS.POSTS): Promise<string> => {
  try {
    if (!file) {
      throw new Error("No file provided");
    }
    
    // Generate a unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = fileName;
    
    // Upload the file to the specified bucket
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);
    
    if (uploadError) {
      throw uploadError;
    }
    
    // Get the public URL
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);
    
    return data.publicUrl;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

// Create a new image post
export const createImagePost = async (userId: string, imageFiles: File[], caption?: string, tags?: string[]) => {
  try {
    // Upload all images and get their URLs
    const uploadPromises = imageFiles.map(file => uploadImage(file));
    const imageUrls = await Promise.all(uploadPromises);
    
    // Insert the post into the database
    const { data, error } = await supabase
      .from("posts_images")
      .insert({
        user_id: userId,
        image_urls: imageUrls,
        caption,
        tags
      })
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error("Error creating image post:", error);
    throw error;
  }
};

// Create a new text post
export const createTextPost = async (userId: string, body: string, title?: string, tags?: string[], emojiMood?: string) => {
  try {
    // Insert the post into the database
    const { data, error } = await supabase
      .from("posts_text")
      .insert({
        user_id: userId,
        title,
        body,
        tags,
        emoji_mood: emojiMood
      })
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error("Error creating text post:", error);
    throw error;
  }
};

// Upload a video for a reel
export const uploadReelVideo = async (file: File): Promise<{ videoUrl: string, storagePath: string }> => {
  try {
    if (!file) {
      throw new Error("No video file provided");
    }
    
    // Generate a unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = fileName;
    
    // Upload the video to the reels bucket
    const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKETS.REELS)
      .upload(filePath, file);
    
    if (uploadError) {
      throw uploadError;
    }
    
    // Get the public URL
    const { data } = supabase.storage
      .from(STORAGE_BUCKETS.REELS)
      .getPublicUrl(filePath);
    
    return {
      videoUrl: data.publicUrl,
      storagePath: filePath
    };
  } catch (error) {
    console.error("Error uploading reel video:", error);
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
) => {
  try {
    // Upload the video
    const { videoUrl, storagePath } = await uploadReelVideo(videoFile);
    
    // Insert the reel into the database
    const { data, error } = await supabase
      .from("posts_reels")
      .insert({
        user_id: userId,
        video_url: videoUrl,
        caption,
        tags,
        audio_url: audioUrl,
        audio_type: audioType
      })
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error("Error creating reel post:", error);
    throw error;
  }
};

// Fetch posts from a user
export const getUserPosts = async (userId: string, limit: number = 10, type?: 'images' | 'text' | 'reels') => {
  try {
    // Determine which table to query based on type
    let table = '';
    switch (type) {
      case 'images':
        table = 'posts_images';
        break;
      case 'text':
        table = 'posts_text';
        break;
      case 'reels':
        table = 'posts_reels';
        break;
      default:
        // If no type is specified, return images by default
        table = 'posts_images';
    }
    
    // Fetch the posts
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error(`Error fetching ${type || 'user'} posts:`, error);
    throw error;
  }
};

// Fetch a feed of posts from users the current user follows
export const getFeedPosts = async (userId: string, limit: number = 20) => {
  try {
    // Get the list of users the current user follows
    const { data: followingData, error: followingError } = await supabase
      .from("user_follows")
      .select("following_id")
      .eq("follower_id", userId);
    
    if (followingError) {
      throw followingError;
    }
    
    // Extract the user IDs
    const followingIds = followingData.map(item => item.following_id);
    
    // Add the current user's ID to see their own posts too
    const userIds = [...followingIds, userId];
    
    // If the user doesn't follow anyone yet, just return some recent posts
    if (userIds.length === 1) {
      const { data, error } = await supabase
        .from("posts_images")
        .select('*, profiles!inner(*)')
        .order("created_at", { ascending: false })
        .limit(limit);
      
      if (error) {
        throw error;
      }
      
      return data;
    }
    
    // Fetch posts from followed users (including the user's own posts)
    const { data, error } = await supabase
      .from("posts_images")
      .select('*, profiles!inner(*)')
      .in("user_id", userIds)
      .order("created_at", { ascending: false })
      .limit(limit);
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error("Error fetching feed posts:", error);
    throw error;
  }
};

// Add a comment to a post
export const addComment = async (userId: string, postId: string, content: string) => {
  try {
    // Using string literal for table name to avoid TypeScript issues with the new schema
    const { data, error } = await supabase
      .from('post_comments')
      .insert({
        user_id: userId,
        post_id: postId,
        content
      })
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error("Error adding comment:", error);
    throw error;
  }
};

// Get comments for a post
export const getComments = async (postId: string) => {
  try {
    const { data, error } = await supabase
      .from("post_comments")
      .select('*, profiles(*)')
      .eq("post_id", postId)
      .order("created_at", { ascending: true });
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw error;
  }
};
