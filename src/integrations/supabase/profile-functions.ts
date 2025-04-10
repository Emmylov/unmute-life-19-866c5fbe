
import { supabase, STORAGE_BUCKETS, SUPABASE_URL, SUPABASE_KEY } from "./client";
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
    const tableExists = await checkIfTableExists("profile_reactions");
      
    // If the table doesn't exist yet, we'll just log it
    if (!tableExists) {
      console.log("profile_reactions table doesn't exist yet");
      return null;
    }
    
    // Using raw API approach bypassing TypeScript checking
    const response = await fetch(`${SUPABASE_URL}/rest/v1/profile_reactions`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        from_user_id: fromUserId,
        to_user_id: toUserId,
        emoji: emoji
      })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error("Error response from API:", data);
      throw new Error("Failed to add profile reaction");
    }
    
    // Increment notification count for recipient
    try {
      // Execute the update separately to avoid type errors
      const { error } = await supabase
        .from('profiles')
        .update({ notification_count: supabase.rpc('increment', { inc_amount: 1 }) as any })
        .eq('id', toUserId);
        
      if (error) {
        console.error("Error incrementing notification count:", error);
      }
    } catch (incrementError) {
      console.error("Error incrementing notification count:", incrementError);
    }
    
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
    const tableExists = await checkIfTableExists("profile_reactions");
      
    // If the table doesn't exist yet, return empty array
    if (!tableExists) {
      return [];
    }
    
    // Using raw API approach to query the profile_reactions table
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/profile_reactions?select=*,sender:profiles!from_user_id(username,avatar)&to_user_id=eq.${userId}&order=created_at.desc&limit=20`, 
      {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`
        }
      }
    );
    
    if (!response.ok) {
      console.error("Error fetching profile reactions");
      return [];
    }
    
    const data = await response.json();
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
    const { data } = supabase.storage
      .from(STORAGE_BUCKETS.AVATARS)
      .getPublicUrl(filePath);
      
    const avatarUrl = data.publicUrl;
    
    // Update the profile
    const { data: profileData, error } = await supabase
      .from('profiles')
      .update({ avatar: avatarUrl })
      .eq('id', userId)
      .select('avatar')
      .single();
    
    if (error) throw error;
    
    return profileData.avatar;
  } catch (error) {
    console.error("Error uploading avatar:", error);
    throw error;
  }
};

// Function to follow/unfollow a user
export const toggleFollowUser = async (followerId: string, targetId: string) => {
  try {
    // First check if the table exists
    const tableExists = await checkIfTableExists("user_follows");
      
    // If the table doesn't exist yet, we'll just log it
    if (!tableExists) {
      console.log("user_follows table doesn't exist yet");
      return false;
    }
    
    // Check if already following using raw fetch API
    const checkResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/user_follows?follower_id=eq.${followerId}&following_id=eq.${targetId}`,
      {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`
        }
      }
    );
    
    const existingFollows = await checkResponse.json();
    const isFollowing = existingFollows && existingFollows.length > 0;
    
    if (isFollowing) {
      // Unfollow using raw fetch API
      const deleteResponse = await fetch(
        `${SUPABASE_URL}/rest/v1/user_follows?follower_id=eq.${followerId}&following_id=eq.${targetId}`,
        {
          method: 'DELETE',
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`
          }
        }
      );
      
      if (!deleteResponse.ok) {
        console.error("Failed to unfollow");
        throw new Error("Failed to unfollow user");
      }
      
      // Decrement follower/following counts - execute separately
      try {
        const { error: followerError } = await supabase
          .from('profiles')
          .update({ followers: supabase.rpc('decrement', { dec_amount: 1 }) as any })
          .eq('id', targetId);
          
        if (followerError) {
          console.error("Error decrementing followers count:", followerError);
        }
      } catch (decrementError) {
        console.error("Error decrementing followers count:", decrementError);
      }
      
      try {
        const { error: followingError } = await supabase
          .from('profiles')
          .update({ following: supabase.rpc('decrement', { dec_amount: 1 }) as any })
          .eq('id', followerId);
          
        if (followingError) {
          console.error("Error decrementing following count:", followingError);
        }
      } catch (decrementError) {
        console.error("Error decrementing following count:", decrementError);
      }
      
      return false; // Not following anymore
    } else {
      // Follow using raw fetch API
      const insertResponse = await fetch(
        `${SUPABASE_URL}/rest/v1/user_follows`,
        {
          method: 'POST',
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify({
            follower_id: followerId,
            following_id: targetId
          })
        }
      );
      
      if (!insertResponse.ok) {
        console.error("Failed to follow");
        throw new Error("Failed to follow user");
      }
      
      // Increment follower/following counts - execute separately
      try {
        const { error: followerError } = await supabase
          .from('profiles')
          .update({ followers: supabase.rpc('increment', { inc_amount: 1 }) as any })
          .eq('id', targetId);
          
        if (followerError) {
          console.error("Error incrementing followers count:", followerError);
        }
      } catch (incrementError) {
        console.error("Error incrementing followers count:", incrementError);
      }
      
      try {
        const { error: followingError } = await supabase
          .from('profiles')
          .update({ following: supabase.rpc('increment', { inc_amount: 1 }) as any })
          .eq('id', followerId);
          
        if (followingError) {
          console.error("Error incrementing following count:", followingError);
        }
      } catch (incrementError) {
        console.error("Error incrementing following count:", incrementError);
      }
      
      // Create notification for the target user
      try {
        const { error: notificationError } = await supabase
          .from('profiles')
          .update({ notification_count: supabase.rpc('increment', { inc_amount: 1 }) as any })
          .eq('id', targetId);
          
        if (notificationError) {
          console.error("Error incrementing notification count:", notificationError);
        }
      } catch (incrementError) {
        console.error("Error incrementing notification count:", incrementError);
      }
      
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
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/rpc/check_table_exists`,
      {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ table_name: tableName })
      }
    );
    
    if (!response.ok) {
      console.warn(`Could not check if table ${tableName} exists:`, await response.text());
      return false;
    }
    
    const data = await response.json();
    return !!data;
  } catch (error) {
    console.warn(`Could not check if table ${tableName} exists:`, error);
    return false;
  }
};
