
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';

// Helper function to ensure we return one of the valid types
function getPostTypeString(type: string): "image" | "text" | "reel" | "meme" {
  switch(type) {
    case 'image': return 'image';
    case 'text': return 'text';
    case 'reel': return 'reel';
    case 'meme': return 'meme';
    default: return 'text'; // Default fallback
  }
}

export type PostType = 'text' | 'image' | 'reel' | 'meme';

// Define the FeedPost interface that is used across the application
export interface FeedPost {
  id: string;
  user_id: string;
  post_type: PostType;
  content?: string | null;
  title?: string | null;
  caption?: string | null;
  image_urls?: string[] | null;
  video_url?: string | null;
  thumbnail_url?: string | null;
  tags?: string[] | null;
  emoji_mood?: string | null;
  created_at: string;
  visibility: string;
  likes_count?: number;
  comments_count?: number;
  profiles?: {
    id: string;
    username: string | null;
    avatar: string | null;
    full_name: string | null;
  };
}

// Define the Post interface
export interface Post {
  id: string;
  userId: string;
  type: PostType;
  title?: string | null;
  body?: string | null;
  imageUrl?: string | null;
  videoUrl?: string | null;
  thumbnailUrl?: string | null;
  audioUrl?: string | null;
  audioType?: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    username: string | null;
    avatar: string | null;
  };
  stats: {
    likes: number;
    comments: number;
    shares: number;
  };
  tags?: string[];
}

// Define each post type interface for type safety
interface TextPostData {
  id: string;
  user_id: string;
  created_at: string;
  title?: string | null;
  content: string;
  tags?: string[] | null;
  visibility?: string;
}

interface ImagePostData {
  id: string;
  user_id: string;
  created_at: string;
  image_urls: string[];
  caption?: string | null;
  tags?: string[] | null;
  visibility?: string;
}

interface ReelPostData {
  id: string;
  user_id: string;
  created_at: string;
  video_url: string;
  caption?: string | null;
  thumbnail_url?: string | null;
  tags?: string[] | null;
  audio_url?: string | null;
  audio_type?: string | null;
  visibility?: string;
}

interface MemePostData {
  id: string;
  user_id: string;
  created_at: string;
  image_url: string;
  top_text?: string | null;
  bottom_text?: string | null;
  category?: string | null;
  visibility?: string;
}

// Type union for all post data types
type PostData = TextPostData | ImagePostData | ReelPostData | MemePostData;

// Define valid table names as literal types for TypeScript safety
type ValidTableName = 'text_posts' | 'image_posts' | 'reel_posts' | 'meme_posts';

// Define the mapping between post types and table names
const VALID_TABLE_NAMES: Record<string, ValidTableName> = {
  text: 'text_posts',
  image: 'image_posts',
  reel: 'reel_posts',
  meme: 'meme_posts'
};

// Update the getTableName function to use the valid table names with proper typing
export const getTableName = (postType: string): ValidTableName => {
  if (postType === 'text') return VALID_TABLE_NAMES.text;
  if (postType === 'image') return VALID_TABLE_NAMES.image;
  if (postType === 'reel') return VALID_TABLE_NAMES.reel;
  if (postType === 'meme') return VALID_TABLE_NAMES.meme;
  return VALID_TABLE_NAMES.text; // Default to text
};

// Type guards to check post types
function isTextPost(data: any): data is TextPostData {
  return data && typeof data.content === 'string';
}

function isImagePost(data: any): data is ImagePostData {
  return data && Array.isArray(data.image_urls);
}

function isReelPost(data: any): data is ReelPostData {
  return data && typeof data.video_url === 'string';
}

function isMemePost(data: any): data is MemePostData {
  return data && typeof data.image_url === 'string' && 
    ((data.top_text !== undefined) || (data.bottom_text !== undefined));
}

// Helper function to safely handle data conversion for different table types
const safeConvertToPost = (data: any, postType: PostType): Post => {
  if (!data) {
    // Return a minimal valid Post if data is missing
    return {
      id: '',
      userId: '',
      type: postType,
      createdAt: new Date().toISOString(),
      user: {
        id: '',
        name: null,
        username: null,
        avatar: null
      },
      stats: {
        likes: 0,
        comments: 0,
        shares: 0
      }
    };
  }

  // Create base post object
  const post: Post = {
    id: data.id || '',
    userId: data.user_id || '',
    type: postType,
    createdAt: data.created_at || new Date().toISOString(),
    user: {
      id: data.user_id || '',
      name: null,
      username: null,
      avatar: null
    },
    stats: {
      likes: 0,
      comments: 0,
      shares: 0
    }
  };

  // Add type-specific properties
  switch (postType) {
    case 'text':
      if ('title' in data) post.title = data.title;
      if ('content' in data) post.body = data.content;
      if ('body' in data) post.body = data.body;
      break;
    
    case 'image':
      if ('caption' in data) post.body = data.caption;
      if ('image_urls' in data && Array.isArray(data.image_urls) && data.image_urls.length > 0) {
        post.imageUrl = data.image_urls[0];
      }
      break;
    
    case 'reel':
      if ('caption' in data) post.body = data.caption;
      if ('video_url' in data) post.videoUrl = data.video_url;
      if ('thumbnail_url' in data) post.thumbnailUrl = data.thumbnail_url;
      if ('audio_url' in data) post.audioUrl = data.audio_url;
      if ('audio_type' in data) post.audioType = data.audio_type;
      break;
    
    case 'meme':
      if ('top_text' in data) post.title = data.top_text;
      if ('bottom_text' in data) post.body = data.bottom_text;
      if ('image_url' in data) post.imageUrl = data.image_url;
      break;
  }

  // Handle tags for all post types that might have them
  if ('tags' in data && Array.isArray(data.tags)) {
    post.tags = data.tags;
  }

  return post;
};

export const createPost = async (
  userId: string,
  postType: string,
  postData: any
): Promise<Post | null> => {
  try {
    // Use the typed getTableName function
    const tableName = getTableName(postType);

    // Centralized visibility handling
    const visibility = postData.visibility || "public";

    let insertData: any = {
      user_id: userId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      visibility: visibility,
    };

    switch (postType) {
      case "text":
        insertData = {
          ...insertData,
          title: postData.title,
          content: postData.body || postData.content,
          tags: postData.tags || [],
          emoji_mood: postData.emoji_mood || null,
        };
        break;
      case "image":
        insertData = {
          ...insertData,
          image_urls: postData.image_urls || [],
          caption: postData.content || postData.caption,
          tags: postData.tags || [],
          emoji_mood: postData.emoji_mood || null,
        };
        break;
      case "reel":
        insertData = {
          ...insertData,
          video_url: postData.video_url || postData.videoUrl,
          caption: postData.caption || '',
          thumbnail_url: postData.thumbnail_url || postData.thumbnailUrl || null,
          tags: postData.tags || [],
          audio_type: postData.audio_type || 'original',
          audio_url: postData.audio_url || null,
        };
        break;
      case "meme":
        insertData = {
          ...insertData,
          image_url: postData.image_url,
          top_text: postData.top_text,
          bottom_text: postData.bottom_text,
        };
        break;
      default:
        throw new Error("Invalid post type");
    }

    // Handle the table name explicitly for type safety
    const { data, error } = await supabase
      .from(tableName)
      .insert([insertData])
      .select("*")
      .single();

    if (error) {
      console.error("Error creating post:", error);
      throw error;
    }

    // We need to check if data exists before proceeding
    if (!data) {
      console.error("No data returned after post creation");
      return null;
    }

    // Create a post object based on the post type
    return safeConvertToPost(data, postType as PostType);
  } catch (error) {
    console.error("Error creating post:", error);
    return null;
  }
};

// Helper functions for creating different post types
export const createTextPost = async (postData: any): Promise<Post | null> => {
  try {
    return await createPost(postData.user_id, 'text', {
      title: postData.title || '',
      body: postData.content || postData.body || '',
      tags: postData.tags || [],
      emoji_mood: postData.emoji_mood || null,
      visibility: postData.visibility || 'public'
    });
  } catch (error) {
    console.error("Error creating text post:", error);
    return null;
  }
};

export const createImagePost = async (postData: any): Promise<Post | null> => {
  try {
    return await createPost(postData.user_id, 'image', {
      image_urls: postData.image_urls || [],
      content: postData.content || postData.caption || '',
      tags: postData.tags || [],
      emoji_mood: postData.emoji_mood || null,
      visibility: postData.visibility || 'public'
    });
  } catch (error) {
    console.error("Error creating image post:", error);
    return null;
  }
};

export const createReelPost = async (postData: any): Promise<Post | null> => {
  try {
    return await createPost(postData.user_id, 'reel', {
      video_url: postData.video_url || postData.videoUrl,
      caption: postData.caption || '',
      thumbnail_url: postData.thumbnail_url || postData.thumbnailUrl || null,
      tags: postData.tags || [],
      audio: postData.audio || null,
      audio_url: postData.audio_url || null,
      audio_type: postData.audio_type || 'original',
      visibility: postData.visibility || 'public'
    });
  } catch (error) {
    console.error("Error creating reel post:", error);
    return null;
  }
};

// Define getPosts function
export const getPosts = async (
  userId: string,
  postType?: string
): Promise<Post[]> => {
  try {
    const tableName = postType ? getTableName(postType) : VALID_TABLE_NAMES.text;
    
    // Use the explicit table name for type safety
    const { data, error } = await supabase
      .from(tableName)
      .select("*")
      .eq("user_id", userId);

    if (error) {
      console.error(`Error fetching ${postType} posts:`, error);
      return [];
    }

    if (!data) {
      return [];
    }

    // Convert to Post interface
    return data.map(item => 
      safeConvertToPost(item, (postType || 'text') as PostType)
    );
  } catch (error) {
    console.error(`Error getting ${postType} posts:`, error);
    return [];
  }
};

// Export getUserPosts as an alias of getPosts for backward compatibility
export const getUserPosts = getPosts;

export const hasLikedPost = async (postId: string, userId: string, postType: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from("post_likes")
      .select("*")
      .eq("post_id", postId)
      .eq("user_id", userId)
      .eq("post_type", postType)
      .maybeSingle();

    if (error) throw error;
    return !!data;
  } catch (error) {
    console.error("Error checking like status:", error);
    return false;
  }
};

export const getPostLikesCount = async (postId: string, postType: string): Promise<number> => {
  try {
    const { count, error } = await supabase
      .from("post_likes")
      .select("*", { count: "exact", head: true })
      .eq("post_id", postId)
      .eq("post_type", postType);

    if (error) throw error;
    return count || 0;
  } catch (error) {
    console.error("Error getting post likes count:", error);
    return 0;
  }
};

export const checkPostExists = async (postId: string, postType: string): Promise<boolean> => {
  try {
    const tableName = getTableName(postType);
    
    // Use explicit table name for type safety
    const { data, error } = await supabase
      .from(tableName)
      .select('id')
      .eq('id', postId)
      .maybeSingle();
    
    if (error) {
      console.error(`Error checking post existence in ${tableName}:`, error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error('Error checking post existence:', error);
    return false;
  }
};

export const getPost = async (
  postId: string,
  postType: string
): Promise<Post | null> => {
  try {
    const tableName = getTableName(postType);

    const { data, error } = await supabase
      .from(tableName)
      .select("*")
      .eq("id", postId)
      .single();

    if (error || !data) {
      console.error("Error fetching post:", error);
      return null;
    }

    return safeConvertToPost(data, postType as PostType);
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
};

export const updatePost = async (
  postId: string,
  postType: string,
  updates: any
): Promise<Post | null> => {
  try {
    const tableName = getTableName(postType);

    const { data, error } = await supabase
      .from(tableName)
      .update(updates)
      .eq("id", postId)
      .select("*")
      .single();

    if (error || !data) {
      console.error("Error updating post:", error);
      return null;
    }

    return safeConvertToPost(data, postType as PostType);
  } catch (error) {
    console.error("Error updating post:", error);
    return null;
  }
};

export const deletePost = async (
  postId: string,
  postType: string
): Promise<boolean> => {
  try {
    const tableName = getTableName(postType);

    const { error } = await supabase.from(tableName).delete().eq("id", postId);

    if (error) {
      console.error("Error deleting post:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error deleting post:", error);
    return false;
  }
};

// Get all posts for a user from different tables
export const getAllPosts = async (userId: string): Promise<Post[]> => {
  try {
    // Create separate queries for each post type
    const textPostsPromise = supabase
      .from(VALID_TABLE_NAMES.text)
      .select("*")
      .eq("user_id", userId);
      
    const imagePostsPromise = supabase
      .from(VALID_TABLE_NAMES.image)
      .select("*")
      .eq("user_id", userId);
      
    const reelPostsPromise = supabase
      .from(VALID_TABLE_NAMES.reel)
      .select("*")
      .eq("user_id", userId);
      
    const memePostsPromise = supabase
      .from("meme_posts")
      .select("*")
      .eq("user_id", userId);

    // Execute all queries in parallel
    const [textPostsResult, imagePostsResult, reelPostsResult, memePostsResult] =
      await Promise.all([
        textPostsPromise,
        imagePostsPromise,
        reelPostsPromise,
        memePostsPromise,
      ]);

    // Handle errors
    if (
      textPostsResult.error ||
      imagePostsResult.error ||
      reelPostsResult.error ||
      memePostsResult.error
    ) {
      console.error("Error fetching posts:", {
        text: textPostsResult.error,
        image: imagePostsResult.error,
        reel: reelPostsResult.error,
        meme: memePostsResult.error,
      });
      return [];
    }

    // Process each post type separately
    const textPosts = (textPostsResult.data || []).map(post => 
      safeConvertToPost(post, 'text')
    );

    const imagePosts = (imagePostsResult.data || []).map(post => 
      safeConvertToPost(post, 'image')
    );

    const reelPosts = (reelPostsResult.data || []).map(post => 
      safeConvertToPost(post, 'reel')
    );

    const memePosts = (memePostsResult.data || []).map(post => 
      safeConvertToPost(post, 'meme')
    );

    // Combine all posts
    return [...textPosts, ...imagePosts, ...reelPosts, ...memePosts];
  } catch (error) {
    console.error("Error getting all posts:", error);
    return [];
  }
};

// Function to fetch feed posts
export const getFeedPosts = async (
  userId: string,
  limit: number = 10
): Promise<FeedPost[]> => {
  try {
    // Fetch the user's follow list
    const { data: following, error: followError } = await supabase
      .from('profile_reactions')
      .select('to_user_id') 
      .eq('from_user_id', userId)
      .eq('type', 'follow');

    if (followError) {
      console.error("Error fetching follow list:", followError);
      // Continue with empty following list
    }

    // Extract user IDs of those being followed, providing a safe fallback
    const followedUserIds = following && Array.isArray(following) 
      ? following.map(f => f.to_user_id).filter(Boolean)
      : [];

    // Include the user's own ID in the list
    const allUserIds = [...followedUserIds, userId].filter(Boolean);

    // Fetch posts from each table with proper error handling
    const { data: textPosts, error: textError } = await supabase
      .from('text_posts')
      .select(`
        *,
        profiles:user_id (
          id, username, avatar, full_name
        )
      `)
      .in('user_id', allUserIds)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (textError) {
      console.error("Error fetching text posts:", textError);
    }

    const { data: imagePosts, error: imageError } = await supabase
      .from('image_posts')
      .select(`
        *,
        profiles:user_id (
          id, username, avatar, full_name
        )
      `)
      .in('user_id', allUserIds)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (imageError) {
      console.error("Error fetching image posts:", imageError);
    }

    const { data: reelPosts, error: reelError } = await supabase
      .from('reel_posts')
      .select(`
        *,
        profiles:user_id (
          id, username, avatar, full_name
        )
      `)
      .in('user_id', allUserIds)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (reelError) {
      console.error("Error fetching reel posts:", reelError);
    }

    const { data: memePosts, error: memeError } = await supabase
      .from('meme_posts')
      .select(`
        *,
        profiles:user_id (
          id, username, avatar, full_name
        )
      `)
      .in('user_id', allUserIds)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (memeError) {
      console.error("Error fetching meme posts:", memeError);
    }

    // Combine posts with their type information
    let combinedPosts: any[] = [];

    if (textPosts) {
      combinedPosts = [...combinedPosts, ...textPosts.map(post => ({ ...post, post_type: 'text' }))];
    }
    if (imagePosts) {
      combinedPosts = [...combinedPosts, ...imagePosts.map(post => ({ ...post, post_type: 'image' }))];
    }
    if (reelPosts) {
      combinedPosts = [...combinedPosts, ...reelPosts.map(post => ({ ...post, post_type: 'reel' }))];
    }
    if (memePosts) {
      combinedPosts = [...combinedPosts, ...memePosts.map(post => ({ ...post, post_type: 'meme' }))];
    }

    // Sort by creation date
    combinedPosts.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    // Transform to FeedPost format
    const feedPosts: FeedPost[] = combinedPosts.map(post => {
      // Create safe profile object
      const safeProfile = post.profiles ? {
        id: post.profiles.id || post.user_id,
        username: post.profiles.username || 'Anonymous',
        avatar: post.profiles.avatar || null,
        full_name: post.profiles.full_name || null
      } : null;

      // Create FeedPost with proper typing
      return {
        id: post.id,
        user_id: post.user_id,
        post_type: getPostTypeString(post.post_type),
        content: post.content || null,
        title: post.title || null,
        caption: post.caption || null,
        image_urls: post.image_urls || (post.image_url ? [post.image_url] : null),
        video_url: post.video_url || null,
        thumbnail_url: post.thumbnail_url || null,
        tags: post.tags || null,
        emoji_mood: post.emoji_mood || null,
        created_at: post.created_at,
        visibility: post.visibility || 'public',
        likes_count: 0,
        comments_count: 0,
        profiles: safeProfile
      };
    });

    return feedPosts;
  } catch (error) {
    console.error("Error getting feed posts:", error);
    return [];
  }
};

// Helper function for image upload
export const uploadImage = async (
  imageFile: File,
  userId: string
): Promise<{ publicUrl: string; storagePath: string } | null> => {
  try {
    const imageName = `${uuidv4()}-${imageFile.name}`;
    const storagePath = `images/${userId}/${imageName}`;

    const { data, error } = await supabase.storage
      .from("images")
      .upload(storagePath, imageFile, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Error uploading image:", error);
      return null;
    }

    // Access the path properties safely
    const bucketName = "images"; // Use hardcoded value instead of data.bucket
    const path = data?.path || storagePath;
    const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucketName}/${path}`;
    return { publicUrl, storagePath };
  } catch (error) {
    console.error("Error uploading image:", error);
    return null;
  }
};

// Post likes functions
export const getPostLikes = async (postId: string, postType: string): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from("post_likes")
      .select("*")
      .eq("post_id", postId)
      .eq("post_type", postType);

    if (error) {
      console.error("Error fetching post likes:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error getting post likes:", error);
    return [];
  }
};

export const likePost = async (
  postId: string,
  userId: string,
  postType: string
): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from("post_likes")
      .insert([{ post_id: postId, user_id: userId, post_type: postType }]);

    if (error) {
      console.error("Error liking post:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error liking post:", error);
    return false;
  }
};

export const unlikePost = async (
  postId: string,
  userId: string,
  postType: string
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("post_likes")
      .delete()
      .eq("post_id", postId)
      .eq("user_id", userId)
      .eq("post_type", postType);

    if (error) {
      console.error("Error unliking post:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error unliking post:", error);
    return false;
  }
};
