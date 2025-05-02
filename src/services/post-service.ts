import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';
import { PostgrestResponse } from "@supabase/supabase-js";

// Helper function to ensure we return one of the valid types
function getPostTypeString(type: string): string {
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
  post_type: string;
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
  videoUrl: string;
  storagePath: string;
}

export interface MemePost extends DatabasePost {
  image_urls: string[];
  top_text: string;
  bottom_text: string;
}

export const getTableName = (postType: string): string => {
  switch (postType) {
    case "text":
      return "text_posts";
    case "image":
      return "image_posts";
    case "reel":
      return "reel_posts";
    case "meme":
      return "meme_posts";
    default:
      return "text_posts";
  }
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
          body: postData.body,
          tags: postData.tags || [],
          emoji_mood: postData.emoji_mood || null,
        };
        break;
      case "image":
        insertData = {
          ...insertData,
          image_urls: postData.image_urls || [],
          content: postData.content,
          tags: postData.tags || [],
          emoji_mood: postData.emoji_mood || null,
        };
        break;
      case "reel":
        insertData = {
          ...insertData,
          videoUrl: postData.videoUrl,
          storagePath: postData.storagePath,
        };
        break;
      case "meme":
        insertData = {
          ...insertData,
          image_urls: postData.image_urls || [],
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

    return data as Post;
  } catch (error) {
    console.error("Error creating post:", error);
    return null;
  }
};

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
    let tableName = '';
    switch (postType) {
      case 'text':
        tableName = 'text_posts';
        break;
      case 'image':
        tableName = 'image_posts';
        break;
      case 'meme':
        tableName = 'meme_posts';
        break;
      case 'reel':
        tableName = 'reel_posts';
        break;
      default:
        tableName = 'text_posts';
    }
    
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

    // Type assertion to ensure the result is properly casted
    const { data, error } = await supabase
      .from(tableName)
      .select("*")
      .eq("id", postId)
      .single();

    if (error) {
      console.error("Error fetching post:", error);
      return null;
    }

    return data as unknown as Post;
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

    return data as Post;
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

    const textPosts = textPostsResult.data as TextPost[];
    const imagePosts = imagePostsResult.data as ImagePost[];
    const reelPosts = reelPostsResult.data as ReelPost[];
    const memePosts = memePostsResult.data as MemePost[];

    const allPosts: Post[] = [
      ...textPosts.map((post) => ({
        ...post,
        type: "text" as const,
      })),
      ...imagePosts.map((post) => ({
        ...post,
        type: "image" as const,
      })),
      ...reelPosts.map((post) => ({
        ...post,
        type: "reel" as const,
      })),
      ...memePosts.map((post) => ({
        ...post,
        type: "meme" as const,
      })),
    ];

    return allPosts;
  } catch (error) {
    console.error("Error getting all posts:", error);
    return [];
  }
};

export const getPosts = async (
  userId: string,
  postType?: string
): Promise<Post[]> => {
  try {
    let query = supabase.from(
      postType === 'text' ? 'text_posts' :
      postType === 'image' ? 'image_posts' :
      postType === 'reel' ? 'reel_posts' :
      postType === 'meme' ? 'meme_posts' : 'text_posts'
    ).select("*").eq("user_id", userId);

    const { data, error } = await query;

    if (error) {
      console.error(`Error fetching ${postType} posts:`, error);
      return [];
    }

    // Type assertion based on postType
    let typedData: Post[];
    switch (postType) {
      case "text":
        typedData = (data as TextPost[]).map((post) => ({
          ...post,
          type: "text" as const,
        }));
        break;
      case "image":
        typedData = (data as ImagePost[]).map((post) => ({
          ...post,
          type: "image" as const,
        }));
        break;
      case "reel":
        typedData = (data as ReelPost[]).map((post) => ({
          ...post,
          type: "reel" as const,
        }));
        break;
      case "meme":
        typedData = (data as MemePost[]).map((post) => ({
          ...post,
          type: "meme" as const,
        }));
        break;
      default:
        typedData = data as Post[];
        break;
    }

    return typedData;
  } catch (error) {
    console.error(`Error getting ${postType} posts:`, error);
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

    // Fetch posts from users in the combined list
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

    // Combine and sort posts
    let combinedPosts: any[] = [];

    if (textPosts) combinedPosts = [...combinedPosts, ...textPosts];
    if (imagePosts) combinedPosts = [...combinedPosts, ...imagePosts];
    if (reelPosts) combinedPosts = [...combinedPosts, ...reelPosts];
    if (memePosts) combinedPosts = [...combinedPosts, ...memePosts];

    combinedPosts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    // Transform posts to FeedPost format
    const feedPosts: FeedPost[] = combinedPosts.map(post => {
      return {
        id: post.id,
        user_id: post.user_id,
        content: post.body || post.content || null,
        title: post.title || null,
        image_urls: post.image_urls || null,
        video_url: post.video_url || null,
        thumbnail_url: post.thumbnail_url || null,
        caption: post.caption || null,
        tags: post.tags || null,
        emoji_mood: post.emoji_mood || null,
        post_type: getPostTypeString(post.post_type) as "image" | "text" | "reel" | "meme",
        created_at: post.created_at,
        visibility: post.visibility,
        likes_count: 0, // Replace with actual likes count if available
        comments_count: 0, // Replace with actual comments count if available
        profiles: post.profiles || {
          id: post.user_id,
          username: 'Anonymous',
          avatar: '',
          full_name: 'Unknown User'
        }
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
