
import { supabase, STORAGE_BUCKETS } from "./client";
import { v4 as uuidv4 } from "uuid";

// Type definitions for profile reactions
export interface ProfileReaction {
  id: string;
  from_user_id: string;
  to_user_id: string;
  emoji: string;
  created_at: string;
}

// Function to update user profile
export const updateUserProfile = async (
  userId: string,
  profileData: {
    full_name?: string;
    username?: string;
    bio?: string;
    avatar?: string;
    location?: string;
    website?: string;
    theme_color?: string;
    interests?: string[];
  }
) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(profileData)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};

// Function to fetch profile data
export const fetchUserProfile = async (usernameOrId: string) => {
  try {
    // Try to fetch by username first
    let query = supabase
      .from('profiles')
      .select(`
        *,
        posts:posts(count),
        reels:reels(count),
        communities:user_interests(count)
      `)
      .eq('username', usernameOrId)
      .single();
    
    let { data, error } = await query;
    
    // If not found by username, try by ID
    if (error && error.code === 'PGRST116') {
      query = supabase
        .from('profiles')
        .select(`
          *,
          posts:posts(count),
          reels:reels(count),
          communities:user_interests(count)
        `)
        .eq('id', usernameOrId)
        .single();
      
      const result = await query;
      data = result.data;
      error = result.error;
    }
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw error;
  }
};

// Function to add a reaction to a profile
export const addProfileReaction = async (
  fromUserId: string,
  toUserId: string,
  emoji: string
) => {
  try {
    // First check if the table exists
    const { data: tableExists } = await supabase
      .rpc('check_table_exists', { table_name: 'profile_reactions' });
      
    // If the table doesn't exist yet, we'll just log it
    if (!tableExists) {
      console.log("profile_reactions table doesn't exist yet");
      return null;
    }
    
    // Using raw REST API to bypass type checking
    // This avoids TypeScript errors since the table might not be in the generated types yet
    const { data, error } = await (supabase as any)
      .from('profile_reactions')
      .insert({
        from_user_id: fromUserId,
        to_user_id: toUserId,
        emoji: emoji
      })
      .select();
    
    if (error) throw error;
    
    // Increment notification count for recipient
    await supabase
      .from('profiles')
      .update({ 
        notification_count: supabase.rpc('increment', { inc_amount: 1 }) as any
      })
      .eq('id', toUserId);
    
    return data?.[0] || null;
  } catch (error) {
    console.error("Error adding profile reaction:", error);
    throw error;
  }
};

// Function to get recent reactions for a profile
export const getProfileReactions = async (userId: string) => {
  try {
    // First check if the table exists
    const { data: tableExists } = await supabase
      .rpc('check_table_exists', { table_name: 'profile_reactions' });
      
    // If the table doesn't exist yet, return empty array
    if (!tableExists) {
      return [];
    }
    
    // Using raw REST API to query the profile_reactions table
    const { data, error } = await (supabase as any)
      .from('profile_reactions')
      .select(`
        *,
        sender:profiles!from_user_id(username, avatar)
      `)
      .eq('to_user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20);
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error("Error getting profile reactions:", error);
    return [];
  }
};

// Upload profile avatar
export const uploadProfileAvatar = async (userId: string, file: File) => {
  try {
    // Create avatars bucket if it doesn't exist yet
    const { data: buckets } = await supabase.storage.listBuckets();
    if (!buckets?.find(bucket => bucket.name === STORAGE_BUCKETS.AVATARS)) {
      await supabase.storage.createBucket(STORAGE_BUCKETS.AVATARS, {
        public: true,
      });
    }
    
    // Upload the file
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;
    
    const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKETS.AVATARS)
      .upload(filePath, file);
      
    if (uploadError) throw uploadError;
    
    // Get the URL
    const avatarUrl = getPublicUrl(STORAGE_BUCKETS.AVATARS, filePath);
    
    // Update the profile
    const { data, error } = await supabase
      .from('profiles')
      .update({ avatar: avatarUrl })
      .eq('id', userId)
      .select('avatar')
      .single();
    
    if (error) throw error;
    
    return data.avatar;
  } catch (error) {
    console.error("Error uploading avatar:", error);
    throw error;
  }
};

// Function to follow/unfollow a user
export const toggleFollowUser = async (followerId: string, targetId: string) => {
  try {
    // First check if the table exists
    const { data: tableExists } = await supabase
      .rpc('check_table_exists', { table_name: 'user_follows' });
      
    // If the table doesn't exist yet, we'll just log it
    if (!tableExists) {
      console.log("user_follows table doesn't exist yet");
      return false;
    }
    
    // Check if already following using raw API
    const { data: existingFollows } = await (supabase as any)
      .from('user_follows')
      .select('follower_id')
      .eq('follower_id', followerId)
      .eq('following_id', targetId);
    
    const isFollowing = existingFollows && existingFollows.length > 0;
    
    if (isFollowing) {
      // Unfollow
      await (supabase as any)
        .from('user_follows')
        .delete()
        .eq('follower_id', followerId)
        .eq('following_id', targetId);
      
      // Decrement follower/following counts
      await supabase
        .from('profiles')
        .update({ 
          followers: supabase.rpc('decrement', { dec_amount: 1 }) as any
        })
        .eq('id', targetId);
      
      await supabase
        .from('profiles')
        .update({ 
          following: supabase.rpc('decrement', { dec_amount: 1 }) as any
        })
        .eq('id', followerId);
      
      return false; // Not following anymore
    } else {
      // Follow
      await (supabase as any)
        .from('user_follows')
        .insert({
          follower_id: followerId,
          following_id: targetId
        });
      
      // Increment follower/following counts
      await supabase
        .from('profiles')
        .update({ 
          followers: supabase.rpc('increment', { inc_amount: 1 }) as any
        })
        .eq('id', targetId);
      
      await supabase
        .from('profiles')
        .update({ 
          following: supabase.rpc('increment', { inc_amount: 1 }) as any
        })
        .eq('id', followerId);
      
      // Create notification for the target user
      await supabase
        .from('profiles')
        .update({ 
          notification_count: supabase.rpc('increment', { inc_amount: 1 }) as any
        })
        .eq('id', targetId);
      
      return true; // Now following
    }
  } catch (error) {
    console.error("Error toggling follow:", error);
    throw error;
  }
};

// Helper function to get public URL from storage path (moved from client.ts for convenience)
const getPublicUrl = (bucket: string, path: string): string => {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
};

// Helper function to check if table exists (needed for our code)
export const checkIfTableExists = async (tableName: string): Promise<boolean> => {
  try {
    const { data } = await supabase.rpc('check_table_exists', { table_name: tableName });
    return !!data;
  } catch (error) {
    console.warn(`Could not check if table ${tableName} exists:`, error);
    return false;
  }
};
