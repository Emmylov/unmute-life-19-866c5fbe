
import { supabase } from "@/integrations/supabase/client";
import { uploadImage } from "./upload-service";
import { uploadReelVideo } from "./upload-service";

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
      .from(table as any)
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

// Modified: Fetch a feed of posts with proper join handling
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
    
    // Modified: First try to fetch posts with a simple query without the problematic join
    const { data: postsData, error: postsError } = await supabase
      .from("posts_images")
      .select(`
        id, 
        image_urls,
        caption,
        tags,
        created_at,
        user_id
      `)
      .in("user_id", userIds.length > 0 ? userIds : [userId])
      .order("created_at", { ascending: false })
      .limit(limit);
    
    if (postsError) {
      throw postsError;
    }
    
    // If we have posts, now fetch the user profiles separately and merge the data
    if (postsData && postsData.length > 0) {
      // Get unique user IDs from the posts
      const uniqueUserIds = [...new Set(postsData.map(post => post.user_id))];
      
      // Fetch profiles for these users
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("id, username, avatar, full_name")
        .in("id", uniqueUserIds);
      
      if (profilesError) {
        console.error("Error fetching profiles:", profilesError);
        // Return posts without profile data if there's an error
        return postsData;
      }
      
      // Create a map of profiles for easy lookup
      const profileMap = new Map();
      profilesData?.forEach(profile => {
        profileMap.set(profile.id, profile);
      });
      
      // Merge post data with profile data
      const postsWithProfiles = postsData.map(post => {
        const userProfile = profileMap.get(post.user_id);
        return {
          ...post,
          profiles: userProfile || null
        };
      });
      
      return postsWithProfiles;
    }
    
    // If no posts found in posts_images, try getting data from other post tables
    console.log("No image posts found, checking text posts...");
    const { data: textPostsData, error: textPostsError } = await supabase
      .from("posts_text")
      .select(`
        id, 
        body,
        title,
        emoji_mood,
        tags,
        created_at,
        user_id
      `)
      .in("user_id", userIds.length > 0 ? userIds : [userId])
      .order("created_at", { ascending: false })
      .limit(limit);
    
    if (textPostsError) {
      console.error("Error fetching text posts:", textPostsError);
      return [];
    }
    
    // If we have text posts, fetch and merge profile data
    if (textPostsData && textPostsData.length > 0) {
      // Get unique user IDs from the posts
      const uniqueUserIds = [...new Set(textPostsData.map(post => post.user_id))];
      
      // Fetch profiles for these users
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("id, username, avatar, full_name")
        .in("id", uniqueUserIds);
      
      if (profilesError) {
        console.error("Error fetching profiles for text posts:", profilesError);
        // Return posts without profile data if there's an error
        return textPostsData;
      }
      
      // Create a map of profiles for easy lookup
      const profileMap = new Map();
      profilesData?.forEach(profile => {
        profileMap.set(profile.id, profile);
      });
      
      // Merge post data with profile data
      const postsWithProfiles = textPostsData.map(post => {
        const userProfile = profileMap.get(post.user_id);
        return {
          ...post,
          content: post.body,  // Ensure content field exists for compatibility
          profiles: userProfile || null
        };
      });
      
      return postsWithProfiles;
    }
    
    return [];
  } catch (error) {
    console.error("Error fetching feed posts:", error);
    throw error;
  }
};

