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
        .select("*, profiles:profiles(*)")
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
      .select("*, profiles:profiles(*)")
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

// Chat Functions
export const sendMessage = async (senderId: string, receiverId: string, content: string) => {
  try {
    // Create the message
    const { data, error } = await supabase
      .from('chat_messages')
      .insert({
        sender_id: senderId,
        receiver_id: receiverId,
        content: content,
        read: false
      })
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};

export const markMessageAsRead = async (messageId: string) => {
  try {
    const { data, error } = await supabase
      .from('chat_messages')
      .update({ read: true })
      .eq("id", messageId)
      .select();
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error("Error marking message as read:", error);
    throw error;
  }
};

export const getChatMessages = async (userId: string, partnerId: string) => {
  try {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .or(`and(sender_id.eq.${userId},receiver_id.eq.${partnerId}),and(sender_id.eq.${partnerId},receiver_id.eq.${userId})`)
      .order('created_at', { ascending: true });
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error("Error getting chat messages:", error);
    throw error;
  }
};

export const getChatList = async (userId: string) => {
  try {
    // This is a more complex query that needs to get all users the current user has chatted with
    const { data: sentMessages, error: sentError } = await supabase
      .from('chat_messages')
      .select('receiver_id')
      .eq('sender_id', userId)
      .distinct();
    
    if (sentError) throw sentError;
    
    const { data: receivedMessages, error: receivedError } = await supabase
      .from('chat_messages')
      .select('sender_id')
      .eq('receiver_id', userId)
      .distinct();
    
    if (receivedError) throw receivedError;
    
    // Combine unique user IDs
    const chatPartnerIds = [
      ...new Set([
        ...sentMessages.map(msg => msg.receiver_id),
        ...receivedMessages.map(msg => msg.sender_id)
      ])
    ];
    
    if (chatPartnerIds.length === 0) {
      return [];
    }
    
    // Get profile information for all chat partners
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .in('id', chatPartnerIds);
    
    if (profilesError) throw profilesError;
    
    // Get the latest message for each chat
    const chatPreviews = await Promise.all(
      chatPartnerIds.map(async (partnerId) => {
        const { data, error } = await supabase
          .from('chat_messages')
          .select('*')
          .or(`and(sender_id.eq.${userId},receiver_id.eq.${partnerId}),and(sender_id.eq.${partnerId},receiver_id.eq.${userId})`)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
        
        if (error) {
          console.error(`Error getting latest message with ${partnerId}:`, error);
          return null;
        }
        
        const profile = profiles?.find(p => p.id === partnerId);
        
        return {
          partnerId,
          profile,
          latestMessage: data,
          unreadCount: 0 // We'll calculate this separately
        };
      })
    );
    
    // Filter out null results
    const validChatPreviews = chatPreviews.filter(preview => preview !== null);
    
    // Calculate unread messages for each chat
    await Promise.all(
      validChatPreviews.map(async (preview) => {
        if (!preview) return;
        
        const { data, error } = await supabase
          .from('chat_messages')
          .select('id', { count: 'exact' })
          .eq('sender_id', preview.partnerId)
          .eq('receiver_id', userId)
          .eq('read', false);
        
        if (!error) {
          preview.unreadCount = data?.length || 0;
        }
      })
    );
    
    // Sort by latest message timestamp
    return validChatPreviews.sort((a, b) => {
      if (!a || !b || !a.latestMessage || !b.latestMessage) return 0;
      return new Date(b.latestMessage.created_at).getTime() - new Date(a.latestMessage.created_at).getTime();
    });
  } catch (error) {
    console.error("Error getting chat list:", error);
    throw error;
  }
};

// Search functionality
export const searchUsers = async (query: string, limit: number = 20) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .or(`username.ilike.%${query}%,full_name.ilike.%${query}%`)
      .limit(limit);
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error("Error searching users:", error);
    throw error;
  }
};

export const searchContent = async (query: string, contentType?: 'images' | 'text' | 'reels', limit: number = 20) => {
  try {
    // Determine which table to query based on type
    let table = '';
    switch (contentType) {
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
        // If no type is specified, search text posts
        table = 'posts_text';
    }
    
    // For text posts, search in title and body
    if (table === 'posts_text') {
      const { data, error } = await supabase
        .from(table)
        .select('*, profiles:profiles(*)')
        .or(`title.ilike.%${query}%,body.ilike.%${query}%`)
        .limit(limit);
      
      if (error) throw error;
      return data;
    }
    
    // For images and reels, search in caption and tags
    const { data, error } = await supabase
      .from(table)
      .select('*, profiles:profiles(*)')
      .or(`caption.ilike.%${query}%`)
      .limit(limit);
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error searching ${contentType || 'content'}:`, error);
    throw error;
  }
};

// Wellness tracking
export const saveWellnessGoal = async (userId: string, goalData: any) => {
  try {
    const { data, error } = await supabase
      .from('wellness_goals')
      .insert({
        user_id: userId,
        ...goalData
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error saving wellness goal:", error);
    throw error;
  }
};

export const getWellnessGoals = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('wellness_goals')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error getting wellness goals:", error);
    throw error;
  }
};

export const saveWellnessActivity = async (userId: string, activityData: any) => {
  try {
    const { data, error } = await supabase
      .from('wellness_activities')
      .insert({
        user_id: userId,
        ...activityData
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error saving wellness activity:", error);
    throw error;
  }
};

export const getWellnessActivities = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('wellness_activities')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error getting wellness activities:", error);
    throw error;
  }
};

// User settings
export const saveUserSettings = async (userId: string, settings: any) => {
  try {
    const { data, error } = await supabase
      .from('user_settings')
      .upsert({
        user_id: userId,
        settings
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error saving user settings:", error);
    throw error;
  }
};

export const getUserSettings = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
      throw error;
    }
    
    return data || { user_id: userId, settings: {} };
  } catch (error) {
    console.error("Error getting user settings:", error);
    throw error;
  }
};

// Analytics
export const trackAnalyticEvent = async (userId: string, eventType: string, eventData: any = {}) => {
  try {
    const { data, error } = await supabase
      .from('user_analytics')
      .insert({
        user_id: userId,
        event_type: eventType,
        event_data: eventData
      });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error tracking analytic event:", error);
    // Don't throw here so it doesn't interrupt user experience
    return null;
  }
};

export const getUserAnalytics = async (userId: string, eventType?: string, startDate?: string, endDate?: string) => {
  try {
    let query = supabase
      .from('user_analytics')
      .select('*')
      .eq('user_id', userId);
    
    if (eventType) {
      query = query.eq('event_type', eventType);
    }
    
    if (startDate) {
      query = query.gte('created_at', startDate);
    }
    
    if (endDate) {
      query = query.lte('created_at', endDate);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error getting user analytics:", error);
    throw error;
  }
};
