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

export interface FeedPost {
  id: string;
  user_id: string;
  content: string | null;
  title: string | null;
  image_urls: string[] | null;
  video_url: string | null;
  thumbnail_url: string | null;
  caption: string | null;
  tags: string[] | null;
  emoji_mood: string | null;
  post_type: "image" | "text" | "reel" | "meme";
  created_at: string;
  visibility: string;
  likes_count: number;
  comments_count: number;
  profiles: {
    id: string;
    username: string | null;
    avatar: string | null;
    full_name: string | null;
  };
}

export interface DatabasePost {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  visibility: string;
}

export interface TextPost extends DatabasePost {
  title: string;
  body: string;
  tags: string[];
  emoji_mood: string;
}

export interface ImagePost extends DatabasePost {
  image_urls: string[];
  content: string;
  tags: string[];
  emoji_mood: string;
}

export interface ReelPost extends DatabasePost {
  video_url: string;
  caption?: string;
  thumbnail_url?: string;
  tags?: string[];
}

export interface MemePost extends DatabasePost {
  image_urls: string[];
  top_text: string;
  bottom_text: string;
}

// Define valid table names for type safety
const VALID_TABLE_NAMES = {
  text: 'text_posts',
  image: 'image_posts',
  reel: 'reel_posts',
  meme: 'meme_posts'
} as const;

// Update the getTableName function to use the valid table names
export const getTableName = (postType: string): string => {
  switch (postType) {
    case "text":
      return VALID_TABLE_NAMES.text;
    case "image":
      return VALID_TABLE_NAMES.image;
    case "reel":
      return VALID_TABLE_NAMES.reel;
    case "meme":
      return VALID_TABLE_NAMES.meme;
    default:
      return VALID_TABLE_NAMES.text;
  }
};

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

  // Base post properties
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
      post.title = data.title || null;
      post.body = data.content || null;
      post.tags = data.tags || [];
      break;
    case 'image':
      post.body = data.caption || null;
      post.imageUrl = (data.image_urls && data.image_urls[0]) || null;
      post.tags = data.tags || [];
      break;
    case 'reel':
      post.body = data.caption || null;
      post.videoUrl = data.video_url || null;
      post.thumbnailUrl = data.thumbnail_url || null;
      post.tags = data.tags || [];
      post.audioUrl = data.audio_url || null;
      post.audioType = data.audio_type || null;
      break;
    case 'meme':
      post.title = data.top_text || null;
      post.body = data.bottom_text || null;
      post.imageUrl = (data.image_urls && data.image_urls[0]) || null;
      break;
  }

  return post;
};

export const createPost = async (
  userId: string,
  postType: string,
  postData: any
): Promise<Post | null> => {
  try {
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
          image_urls: postData.image_urls || [postData.image_url],
          top_text: postData.top_text,
          bottom_text: postData.bottom_text,
        };
        break;
      default:
        throw new Error("Invalid post type");
    }

    const { data, error } = await supabase
      .from(tableName)
      .insert([insertData])
      .select("*")
      .single();

    if (error) {
      console.error("Error creating post:", error);
      throw error;
    }

    // Convert to Post interface as needed by the app
    const result: Post = {
      id: data.id,
      userId: data.user_id,
      type: postType as PostType,
      title: data.title || null,
      body: data.content || data.body || null,
      createdAt: data.created_at,
      // Initialize user and stats with defaults
      user: {
        id: userId,
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

    return result;
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

// Define getPosts function early so it can be exported and referenced
export const getPosts = async (
  userId: string,
  postType?: string
): Promise<Post[]> => {
  try {
    const tableName = postType ? getTableName(postType) : VALID_TABLE_NAMES.text;
    
    const { data, error } = await supabase
      .from(tableName)
      .select("*")
      .eq("user_id", userId);

    if (error) {
      console.error(`Error fetching ${postType} posts:`, error);
      return [];
    }

    // Convert to Post interface
    return (data || []).map(item => safeConvertToPost(item, (postType || 'text') as PostType));
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

    if (error) {
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

    if (error) {
      console.error("Error updating post:", error);
      return null;
    }

    // Convert to consistent Post interface
    const post: Post = {
      id: data.id,
      userId: data.user_id,
      type: postType as PostType,
      title: data.title || null,
      body: data.content || data.body || null,
      imageUrl: data.image_url || (data.image_urls && data.image_urls[0]) || null,
      videoUrl: data.video_url || null,
      thumbnailUrl: data.thumbnail_url || null,
      createdAt: data.created_at,
      user: {
        id: data.user_id,
        name: null,
        username: null,
        avatar: null
      },
      stats: {
        likes: 0,
        comments: 0,
        shares: 0
      },
      tags: data.tags || []
    };

    return post;
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

export const getAllPosts = async (userId: string): Promise<Post[]> => {
  try {
    const textPostsPromise = supabase
      .from("text_posts")
      .select("*")
      .eq("user_id", userId);
    const imagePostsPromise = supabase
      .from("image_posts")
      .select("*")
      .eq("user_id", userId);
    const reelPostsPromise = supabase
      .from("reel_posts")
      .select("*")
      .eq("user_id", userId);
    const memePostsPromise = supabase
      .from("meme_posts")
      .select("*")
      .eq("user_id", userId);

    const [textPostsResult, imagePostsResult, reelPostsResult, memePostsResult] =
      await Promise.all([
        textPostsPromise,
        imagePostsPromise,
        reelPostsPromise,
        memePostsPromise,
      ]);

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

    // Convert all post types to the common Post interface
    const textPosts: Post[] = (textPostsResult.data || []).map(post => ({
      id: post.id,
      userId: post.user_id,
      type: 'text' as PostType,
      title: post.title || null,
      body: post.content || null,
      createdAt: post.created_at,
      user: {
        id: post.user_id,
        name: null,
        username: null,
        avatar: null
      },
      stats: {
        likes: 0,
        comments: 0,
        shares: 0
      },
      tags: post.tags || []
    }));

    const imagePosts: Post[] = (imagePostsResult.data || []).map(post => ({
      id: post.id,
      userId: post.user_id,
      type: 'image' as PostType,
      imageUrl: post.image_urls && post.image_urls[0] || null,
      body: post.caption || null,
      createdAt: post.created_at,
      user: {
        id: post.user_id,
        name: null,
        username: null,
        avatar: null
      },
      stats: {
        likes: 0,
        comments: 0,
        shares: 0
      },
      tags: post.tags || []
    }));

    const reelPosts: Post[] = (reelPostsResult.data || []).map(post => ({
      id: post.id,
      userId: post.user_id,
      type: 'reel' as PostType,
      videoUrl: post.video_url || null,
      thumbnailUrl: post.thumbnail_url || null,
      body: post.caption || null,
      createdAt: post.created_at,
      user: {
        id: post.user_id,
        name: null,
        username: null,
        avatar: null
      },
      stats: {
        likes: 0,
        comments: 0,
        shares: 0
      },
      tags: post.tags || []
    }));

    const memePosts: Post[] = (memePostsResult.data || []).map(post => ({
      id: post.id,
      userId: post.user_id,
      type: 'meme' as PostType,
      imageUrl: post.image_url || null,
      title: post.top_text || null,
      body: post.bottom_text || null,
      createdAt: post.created_at,
      user: {
        id: post.user_id,
        name: null,
        username: null,
        avatar: null
      },
      stats: {
        likes: 0,
        comments: 0,
        shares: 0
      }
    }));

    return [...textPosts, ...imagePosts, ...reelPosts, ...memePosts];
  } catch (error) {
    console.error("Error getting all posts:", error);
    return [];
  }
};

export const getFeedPosts = async (
  userId: string,
  limit: number = 10
): Promise<FeedPost[]> => {
  try {
    // Fetch the user's follow list
    const { data: following, error: followError } = await supabase
      .from('profile_reactions')
      .select('target_user_id')
      .eq('user_id', userId)
      .eq('type', 'follow');

    if (followError) {
      console.error("Error fetching follow list:", followError);
      return [];
    }

    // Extract user IDs of those being followed
    const followedUserIds = following ? following.map(f => f.target_user_id) : [];

    // Include the user's own ID in the list
    const allUserIds = [...followedUserIds, userId];

    // Use proper table names from getTableName
    const textTableName = getTableName('text');
    const imageTableName = getTableName('image');
    const reelTableName = getTableName('reel');
    const memeTableName = getTableName('meme');

    // Fetch posts from each table
    const { data: textPosts, error: textError } = await supabase
      .from(textTableName)
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
      .from(imageTableName)
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
      .from(reelTableName)
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
      .from(memeTableName)
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

    // Combine and sort posts
    let combinedPosts: any[] = [];

    if (textPosts) combinedPosts = [...combinedPosts, ...textPosts.map(post => ({ ...post, post_type: 'text' }))];
    if (imagePosts) combinedPosts = [...combinedPosts, ...imagePosts.map(post => ({ ...post, post_type: 'image' }))];
    if (reelPosts) combinedPosts = [...combinedPosts, ...reelPosts.map(post => ({ ...post, post_type: 'reel' }))];
    if (memePosts) combinedPosts = [...combinedPosts, ...memePosts.map(post => ({ ...post, post_type: 'meme' }))];

    combinedPosts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    // Transform posts to FeedPost format with safe type handling
    const feedPosts: FeedPost[] = combinedPosts.map(post => {
      // Create proper profile fallback
      const safeProfile = post.profiles ? {
        id: post.profiles.id || post.user_id,
        username: post.profiles.username || 'Anonymous',
        avatar: post.profiles.avatar || '',
        full_name: post.profiles.full_name || 'Unknown User'
      } : {
        id: post.user_id,
        username: 'Anonymous',
        avatar: '',
        full_name: 'Unknown User'
      };

      return {
        id: post.id,
        user_id: post.user_id,
        content: post.body || post.content || null,
        title: post.title || null,
        image_urls: post.image_urls || (post.image_url ? [post.image_url] : null),
        video_url: post.video_url || null,
        thumbnail_url: post.thumbnail_url || null,
        caption: post.caption || null,
        tags: post.tags || null,
        emoji_mood: post.emoji_mood || null,
        post_type: getPostTypeString(post.post_type),
        created_at: post.created_at,
        visibility: post.visibility || 'public',
        likes_count: 0, // Replace with actual likes count if available
        comments_count: 0, // Replace with actual comments count if available
        profiles: safeProfile
      };
    });

    return feedPosts;
  } catch (error) {
    console.error("Error getting feed posts:", error);
    return [];
  }
};

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

    const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${data.bucket}/${data.path}`;
    return { publicUrl, storagePath };
  } catch (error) {
    console.error("Error uploading image:", error);
    return null;
  }
};

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
