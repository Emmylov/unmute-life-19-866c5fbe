
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
    let userIds: string[] = [userId]; // Default with just the current user's ID
    
    try {
      const { data, error: followingError } = await supabase
        .from("user_follows")
        .select("following_id")
        .eq("follower_id", userId);
      
      if (followingError) {
        console.error("Error fetching following data:", followingError);
      } else if (data && data.length > 0) {
        // Extract the user IDs
        const followingIds = data.map(item => item.following_id);
        // Add the following IDs to the user IDs array
        userIds = [...followingIds, userId];
      }
    } catch (followErr) {
      console.error("Exception when fetching following data:", followErr);
      // Continue with just the user's own posts
    }
    
    // Use a more reliable approach: fetch posts first, then profiles separately
    
    // First fetch posts_images
    const { data: imagePostsData, error: imagePostsError } = await supabase
      .from("posts_images")
      .select(`
        id, 
        image_urls,
        caption,
        tags,
        created_at,
        user_id
      `)
      .in("user_id", userIds)
      .order("created_at", { ascending: false })
      .limit(Math.ceil(limit / 2));
    
    if (imagePostsError) {
      console.error("Error fetching image posts:", imagePostsError);
      // Continue to try text posts
    }
    
    // Then fetch posts_text
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
      .in("user_id", userIds)
      .order("created_at", { ascending: false })
      .limit(Math.ceil(limit / 2));
    
    if (textPostsError) {
      console.error("Error fetching text posts:", textPostsError);
    }
    
    // Combine posts from both sources
    let allPosts: any[] = [];
    
    // Add image posts if available
    if (imagePostsData && imagePostsData.length > 0) {
      // Add a post_type field to help identify the source later
      const formattedImagePosts = imagePostsData.map(post => ({
        ...post,
        post_type: 'image'
      }));
      allPosts.push(...formattedImagePosts);
    }
    
    // Add text posts if available
    if (textPostsData && textPostsData.length > 0) {
      // Normalize the data structure and add post_type
      const formattedTextPosts = textPostsData.map(post => ({
        ...post,
        content: post.body, // Ensure content field exists for compatibility
        post_type: 'text'
      }));
      allPosts.push(...formattedTextPosts);
    }
    
    // If we have posts, sort them by creation date and limit to the requested amount
    if (allPosts.length > 0) {
      allPosts.sort((a, b) => {
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        return dateB - dateA; // Sort descending (newest first)
      });
      
      // Limit to the requested number of posts
      if (allPosts.length > limit) {
        allPosts = allPosts.slice(0, limit);
      }
      
      // Now fetch profiles for all posts at once
      const uniqueUserIds = [...new Set(allPosts.map(post => post.user_id))];
      
      if (uniqueUserIds.length > 0) {
        try {
          const { data: profilesData, error: profilesError } = await supabase
            .from("profiles")
            .select("id, username, avatar, full_name")
            .in("id", uniqueUserIds);
          
          if (profilesError) {
            console.error("Error fetching profiles:", profilesError);
          } else if (profilesData && profilesData.length > 0) {
            // Create a map of profiles for easy lookup
            const profileMap = new Map();
            profilesData.forEach(profile => {
              profileMap.set(profile.id, profile);
            });
            
            // Merge post data with profile data
            allPosts = allPosts.map(post => {
              const userProfile = profileMap.get(post.user_id);
              return {
                ...post,
                profiles: userProfile || null
              };
            });
          }
        } catch (err) {
          console.error("Error fetching and mapping user profiles:", err);
        }
      }
    }
    
    return allPosts;
  } catch (error) {
    console.error("Error fetching feed posts:", error);
    throw error;
  }
};
