import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { DatabaseReel } from '@/types/reel';

// Define explicit types for posts to prevent TypeScript from infinite type instantiation
export interface TextPost {
  id: string;
  user_id: string;
  created_at: string;
  content: string;
  title?: string;
  tags?: string[];
  allow_comments?: boolean;
  is_anonymous?: boolean;
  mood_vibe?: string;
}

export interface ImagePost {
  id: string;
  user_id: string;
  created_at: string;
  image_urls: string[];
  caption?: string;
  tags?: string[];
  allow_comments?: boolean;
  is_anonymous?: boolean;
  mood_vibe?: string;
}

export interface MemePost {
  id: string;
  user_id: string;
  created_at: string;
  image_url: string;
  caption?: string;
  tags?: string[];
  allow_comments?: boolean;
  is_anonymous?: boolean;
  mood_vibe?: string;
}

export interface ReelPost {
  id: string;
  user_id: string;
  created_at: string;
  video_url: string;
  thumbnail_url?: string;
  caption?: string;
  audio?: string;
  audio_type?: string;
  audio_url?: string;
  duration?: number;
  original_audio_volume?: number;
  overlay_audio_volume?: number;
  tags?: string[];
  allow_comments?: boolean;
  allow_duets?: boolean;
  vibe_tag?: string;
  mood_vibe?: string;
}

export type Post = TextPost | ImagePost | MemePost | ReelPost;

// Add the missing FeedPost type
export interface FeedPost {
  id: string;
  user_id: string;
  content?: string;
  title?: string;
  image_urls?: string[];
  video_url?: string;
  caption?: string;
  tags?: string[];
  emoji_mood?: string;
  post_type: string;
  created_at: string;
  visibility?: string;
  likes_count?: number;
  comments_count?: number;
  profiles?: any;
}

// Add PostType enum for consistent post type naming
export enum PostType {
  TEXT = 'text_post',
  IMAGE = 'image_post',
  REEL = 'reel_post',
  MEME = 'meme_post',
}

export interface PostWithUser {
  post: Post;
  user: {
    id: string;
    username?: string;
    avatar?: string;
    full_name?: string;
  };
}

// Add missing exports for functions
export const createPost = async (userId: string, type: string, data: any) => {
  try {
    let result;
    
    switch(type) {
      case 'text':
        result = await createTextPost(userId, data.content, data.title, data.tags, data.allow_comments, data.is_anonymous, data.emoji_mood);
        break;
      case 'image':
        result = await createImagePost(userId, data.image_urls, data.caption, data.tags, data.allow_comments, data.is_anonymous, data.mood_vibe);
        break;
      case 'meme':
        result = await createMemePost(userId, data.image_url, data.caption, data.tags, data.allow_comments, data.is_anonymous, data.mood_vibe);
        break;
      case 'reel':
        result = await createReelPost(
          userId, 
          data.video_url, 
          data.thumbnail_url, 
          data.caption, 
          data.audio,
          data.audio_type,
          data.audio_url
        );
        break;
      default:
        throw new Error('Unknown post type');
    }
    
    return result;
  } catch (error) {
    console.error('Error creating post:', error);
    return { data: null, error };
  }
};

// Add missing getUserPosts function
export const getUserPosts = async (userId: string, limit = 10, offset = 0) => {
  try {
    const posts = await getAllPostsByUser(userId, limit, offset);
    return posts;
  } catch (error) {
    console.error('Error getting user posts:', error);
    return { data: [], error };
  }
};

// Add missing hasLikedPost function
export const hasLikedPost = async (userId: string, postId: string, postType: string) => {
  try {
    const result = await checkIfLiked(userId, postId, postType);
    return result.isLiked;
  } catch (error) {
    console.error('Error checking if post is liked:', error);
    return false;
  }
};

// Add missing getPostLikesCount function
export const getPostLikesCount = async (postId: string, postType: string) => {
  try {
    const result = await getLikeCount(postId, postType);
    return result.count || 0;
  } catch (error) {
    console.error('Error getting post likes count:', error);
    return 0;
  }
};

// Add missing checkPostExists function
export const checkPostExists = async (postId: string, postType: string) => {
  try {
    let data = null;
    
    switch (postType) {
      case 'text_post':
        data = await getTextPostById(postId);
        break;
      case 'image_post':
        data = await getImagePostById(postId);
        break;
      case 'reel_post':
        data = await getReelPostById(postId);
        break;
      case 'meme_post':
        data = await getMemePostById(postId);
        break;
      default:
        return false;
    }
    
    return data.data !== null;
  } catch (error) {
    console.error('Error checking if post exists:', error);
    return false;
  }
};

// Create a text post
export const createTextPost = async (
  userId: string,
  content: string,
  title?: string,
  tags?: string[],
  allowComments: boolean = true,
  isAnonymous: boolean = false,
  moodVibe?: string
) => {
  try {
    const { data, error } = await supabase.from('text_posts').insert([
      {
        user_id: userId,
        content,
        title,
        tags,
        allow_comments: allowComments,
        is_anonymous: isAnonymous,
        mood_vibe: moodVibe,
      },
    ]).select();

    if (error) throw error;
    return { data: data[0], error: null };
  } catch (error) {
    console.error('Error creating text post:', error);
    return { data: null, error };
  }
};

// Create an image post
export const createImagePost = async (
  userId: string,
  imageUrls: string[],
  caption?: string,
  tags?: string[],
  allowComments: boolean = true,
  isAnonymous: boolean = false,
  moodVibe?: string
) => {
  try {
    const { data, error } = await supabase.from('image_posts').insert([
      {
        user_id: userId,
        image_urls: imageUrls,
        caption,
        tags,
        allow_comments: allowComments,
        is_anonymous: isAnonymous,
        mood_vibe: moodVibe,
      },
    ]).select();

    if (error) throw error;
    return { data: data[0], error: null };
  } catch (error) {
    console.error('Error creating image post:', error);
    return { data: null, error };
  }
};

// Create a meme post
export const createMemePost = async (
  userId: string,
  imageUrl: string,
  caption?: string,
  tags?: string[],
  allowComments: boolean = true,
  isAnonymous: boolean = false,
  moodVibe?: string
) => {
  try {
    const { data, error } = await supabase.from('meme_posts').insert([
      {
        user_id: userId,
        image_url: imageUrl,
        caption,
        tags,
        allow_comments: allowComments,
        is_anonymous: isAnonymous,
        mood_vibe: moodVibe,
      },
    ]).select();

    if (error) throw error;
    return { data: data[0], error: null };
  } catch (error) {
    console.error('Error creating meme post:', error);
    return { data: null, error };
  }
};

// Create a reel post
export const createReelPost = async (
  userId: string,
  videoUrl: string,
  thumbnailUrl?: string,
  caption?: string,
  audio?: string,
  audioType?: string,
  audioUrl?: string,
  duration?: number,
  originalAudioVolume?: number,
  overlayAudioVolume?: number,
  tags?: string[],
  allowComments: boolean = true,
  allowDuets: boolean = true,
  vibeTag?: string,
  moodVibe?: string
) => {
  try {
    const { data, error } = await supabase.from('reel_posts').insert([
      {
        user_id: userId,
        video_url: videoUrl,
        thumbnail_url: thumbnailUrl,
        caption,
        audio,
        audio_type: audioType,
        audio_url: audioUrl,
        duration,
        original_audio_volume: originalAudioVolume,
        overlay_audio_volume: overlayAudioVolume,
        tags,
        allow_comments: allowComments,
        allow_duets: allowDuets,
        vibe_tag: vibeTag,
        mood_vibe: moodVibe,
      },
    ]).select();

    if (error) throw error;
    return { data: data[0], error: null };
  } catch (error) {
    console.error('Error creating reel post:', error);
    return { data: null, error };
  }
};

// Get a text post by ID
export const getTextPostById = async (postId: string) => {
  try {
    const { data, error } = await supabase
      .from('text_posts')
      .select(`
        *,
        profiles:user_id (
          id, username, avatar, full_name
        )
      `)
      .eq('id', postId)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error getting text post:', error);
    return { data: null, error };
  }
};

// Get an image post by ID
export const getImagePostById = async (postId: string) => {
  try {
    const { data, error } = await supabase
      .from('image_posts')
      .select(`
        *,
        profiles:user_id (
          id, username, avatar, full_name
        )
      `)
      .eq('id', postId)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error getting image post:', error);
    return { data: null, error };
  }
};

// Get a meme post by ID
export const getMemePostById = async (postId: string) => {
  try {
    const { data, error } = await supabase
      .from('meme_posts')
      .select(`
        *,
        profiles:user_id (
          id, username, avatar, full_name
        )
      `)
      .eq('id', postId)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error getting meme post:', error);
    return { data: null, error };
  }
};

// Get a reel post by ID
export const getReelPostById = async (postId: string) => {
  try {
    const { data, error } = await supabase
      .from('reel_posts')
      .select(`
        *,
        profiles:user_id (
          id, username, avatar, full_name
        )
      `)
      .eq('id', postId)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error getting reel post:', error);
    return { data: null, error };
  }
};

// Get all posts by a user
export const getPostsByUser = async (userId: string) => {
  try {
    // Get text posts
    const { data: textPosts, error: textError } = await supabase
      .from('text_posts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (textError) throw textError;

    // Get image posts
    const { data: imagePosts, error: imageError } = await supabase
      .from('image_posts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (imageError) throw imageError;

    // Get meme posts
    const { data: memePosts, error: memeError } = await supabase
      .from('meme_posts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (memeError) throw memeError;

    // Get reel posts
    const { data: reelPosts, error: reelError } = await supabase
      .from('reel_posts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (reelError) throw reelError;

    // Combine all posts and sort by created_at
    const allPosts = [
      ...(textPosts || []).map(post => ({ ...post, type: 'text' })),
      ...(imagePosts || []).map(post => ({ ...post, type: 'image' })),
      ...(memePosts || []).map(post => ({ ...post, type: 'meme' })),
      ...(reelPosts || []).map(post => ({ ...post, type: 'reel' })),
    ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return { data: allPosts, error: null };
  } catch (error) {
    console.error('Error getting posts by user:', error);
    return { data: null, error };
  }
};

// Update a text post
export const updateTextPost = async (
  postId: string,
  content?: string,
  title?: string,
  tags?: string[],
  allowComments?: boolean,
  isAnonymous?: boolean,
  moodVibe?: string
) => {
  try {
    const updates: any = {};
    if (content !== undefined) updates.content = content;
    if (title !== undefined) updates.title = title;
    if (tags !== undefined) updates.tags = tags;
    if (allowComments !== undefined) updates.allow_comments = allowComments;
    if (isAnonymous !== undefined) updates.is_anonymous = isAnonymous;
    if (moodVibe !== undefined) updates.mood_vibe = moodVibe;

    const { data, error } = await supabase
      .from('text_posts')
      .update(updates)
      .eq('id', postId)
      .select();

    if (error) throw error;
    return { data: data[0], error: null };
  } catch (error) {
    console.error('Error updating text post:', error);
    return { data: null, error };
  }
};

// Update an image post
export const updateImagePost = async (
  postId: string,
  imageUrls?: string[],
  caption?: string,
  tags?: string[],
  allowComments?: boolean,
  isAnonymous?: boolean,
  moodVibe?: string
) => {
  try {
    const updates: any = {};
    if (imageUrls !== undefined) updates.image_urls = imageUrls;
    if (caption !== undefined) updates.caption = caption;
    if (tags !== undefined) updates.tags = tags;
    if (allowComments !== undefined) updates.allow_comments = allowComments;
    if (isAnonymous !== undefined) updates.is_anonymous = isAnonymous;
    if (moodVibe !== undefined) updates.mood_vibe = moodVibe;

    const { data, error } = await supabase
      .from('image_posts')
      .update(updates)
      .eq('id', postId)
      .select();

    if (error) throw error;
    return { data: data[0], error: null };
  } catch (error) {
    console.error('Error updating image post:', error);
    return { data: null, error };
  }
};

// Update a meme post
export const updateMemePost = async (
  postId: string,
  imageUrl?: string,
  caption?: string,
  tags?: string[],
  allowComments?: boolean,
  isAnonymous?: boolean,
  moodVibe?: string
) => {
  try {
    const updates: any = {};
    if (imageUrl !== undefined) updates.image_url = imageUrl;
    if (caption !== undefined) updates.caption = caption;
    if (tags !== undefined) updates.tags = tags;
    if (allowComments !== undefined) updates.allow_comments = allowComments;
    if (isAnonymous !== undefined) updates.is_anonymous = isAnonymous;
    if (moodVibe !== undefined) updates.mood_vibe = moodVibe;

    const { data, error } = await supabase
      .from('meme_posts')
      .update(updates)
      .eq('id', postId)
      .select();

    if (error) throw error;
    return { data: data[0], error: null };
  } catch (error) {
    console.error('Error updating meme post:', error);
    return { data: null, error };
  }
};

// Update a reel post
export const updateReelPost = async (
  postId: string,
  videoUrl?: string,
  thumbnailUrl?: string,
  caption?: string,
  audio?: string,
  audioType?: string,
  audioUrl?: string,
  duration?: number,
  originalAudioVolume?: number,
  overlayAudioVolume?: number,
  tags?: string[],
  allowComments?: boolean,
  allowDuets?: boolean,
  vibeTag?: string,
  moodVibe?: string
) => {
  try {
    const updates: any = {};
    if (videoUrl !== undefined) updates.video_url = videoUrl;
    if (thumbnailUrl !== undefined) updates.thumbnail_url = thumbnailUrl;
    if (caption !== undefined) updates.caption = caption;
    if (audio !== undefined) updates.audio = audio;
    if (audioType !== undefined) updates.audio_type = audioType;
    if (audioUrl !== undefined) updates.audio_url = audioUrl;
    if (duration !== undefined) updates.duration = duration;
    if (originalAudioVolume !== undefined) updates.original_audio_volume = originalAudioVolume;
    if (overlayAudioVolume !== undefined) updates.overlay_audio_volume = overlayAudioVolume;
    if (tags !== undefined) updates.tags = tags;
    if (allowComments !== undefined) updates.allow_comments = allowComments;
    if (allowDuets !== undefined) updates.allow_duets = allowDuets;
    if (vibeTag !== undefined) updates.vibe_tag = vibeTag;
    if (moodVibe !== undefined) updates.mood_vibe = moodVibe;

    const { data, error } = await supabase
      .from('reel_posts')
      .update(updates)
      .eq('id', postId)
      .select();

    if (error) throw error;
    return { data: data[0], error: null };
  } catch (error) {
    console.error('Error updating reel post:', error);
    return { data: null, error };
  }
};

// Delete a text post
export const deleteTextPost = async (postId: string) => {
  try {
    const { data, error } = await supabase
      .from('text_posts')
      .delete()
      .eq('id', postId);

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error deleting text post:', error);
    return { data: null, error };
  }
};

// Delete an image post
export const deleteImagePost = async (postId: string) => {
  try {
    const { data, error } = await supabase
      .from('image_posts')
      .delete()
      .eq('id', postId);

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error deleting image post:', error);
    return { data: null, error };
  }
};

// Delete a meme post
export const deleteMemePost = async (postId: string) => {
  try {
    const { data, error } = await supabase
      .from('meme_posts')
      .delete()
      .eq('id', postId);

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error deleting meme post:', error);
    return { data: null, error };
  }
};

// Delete a reel post
export const deleteReelPost = async (postId: string) => {
  try {
    const { data, error } = await supabase
      .from('reel_posts')
      .delete()
      .eq('id', postId);

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error deleting reel post:', error);
    return { data: null, error };
  }
};

// Convert database objects to typed objects
export const safeConvertToPost = (post: any, postType: string): any => {
  if (!post) return null;
  
  // Use a switch statement to handle different post types with explicit return types
  switch (postType) {
    case 'text_post':
      return {
        id: post.id || '',
        user_id: post.user_id || '',
        created_at: post.created_at || new Date().toISOString(),
        content: post.content || '',
        title: post.title || '',
        tags: post.tags || [],
        allow_comments: post.allow_comments !== undefined ? post.allow_comments : true,
        is_anonymous: post.is_anonymous !== undefined ? post.is_anonymous : false,
        mood_vibe: post.mood_vibe || null,
        postType: 'text_post'
      };
      
    case 'image_post':
      return {
        id: post.id || '',
        user_id: post.user_id || '',
        created_at: post.created_at || new Date().toISOString(),
        image_urls: Array.isArray(post.image_urls) ? post.image_urls : [],
        caption: post.caption || null,
        tags: post.tags || [],
        allow_comments: post.allow_comments !== undefined ? post.allow_comments : true,
        is_anonymous: post.is_anonymous !== undefined ? post.is_anonymous : false,
        mood_vibe: post.mood_vibe || null,
        postType: 'image_post'
      };
      
    case 'reel_post':
      return {
        id: post.id || '',
        user_id: post.user_id || '',
        created_at: post.created_at || new Date().toISOString(),
        video_url: post.video_url || '',
        thumbnail_url: post.thumbnail_url || null,
        caption: post.caption || null,
        audio: post.audio || null,
        audio_type: post.audio_type || null,
        audio_url: post.audio_url || null,
        duration: post.duration !== undefined ? post.duration : null,
        original_audio_volume: post.original_audio_volume !== undefined ? post.original_audio_volume : null,
        overlay_audio_volume: post.overlay_audio_volume !== undefined ? post.overlay_audio_volume : null,
        tags: post.tags || [],
        allow_comments: post.allow_comments !== undefined ? post.allow_comments : true,
        allow_duets: post.allow_duets !== undefined ? post.allow_duets : true,
        vibe_tag: post.vibe_tag || null,
        mood_vibe: post.mood_vibe || null,
        postType: 'reel_post'
      };
      
    case 'meme_post':
      return {
        id: post.id || '',
        user_id: post.user_id || '',
        created_at: post.created_at || new Date().toISOString(),
        image_url: post.image_url || '',
        caption: post.caption || null,
        tags: post.tags || [],
        allow_comments: post.allow_comments !== undefined ? post.allow_comments : true,
        is_anonymous: post.is_anonymous !== undefined ? post.is_anonymous : false,
        mood_vibe: post.mood_vibe || null,
        postType: 'meme_post'
      };
      
    default:
      return { ...post, postType: 'unknown' };
  }
};

// Fix the getFeedPosts function that has table name issues
export const getFeedPosts = async (userId: string, limit: number = 10, offset: number = 0) => {
  try {
    // Get user's following list using user_follows table instead of follows
    const { data: followingData, error: followingError } = await supabase
      .from('user_follows')
      .select('following_id')
      .eq('follower_id', userId);

    if (followingError) throw followingError;

    // Extract following IDs
    const followingIds = followingData?.map(follow => follow.following_id) || [];
    
    // Include the user's own ID to see their posts in the feed
    const userIds = [...followingIds, userId];

    // Get text posts
    const { data: textPosts, error: textError } = await supabase
      .from('text_posts')
      .select(`
        *,
        profiles:user_id (
          id, username, avatar, full_name
        )
      `)
      .in('user_id', userIds)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (textError) throw textError;

    // Get image posts
    const { data: imagePosts, error: imageError } = await supabase
      .from('image_posts')
      .select(`
        *,
        profiles:user_id (
          id, username, avatar, full_name
        )
      `)
      .in('user_id', userIds)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (imageError) throw imageError;

    // Get meme posts
    const { data: memePosts, error: memeError } = await supabase
      .from('meme_posts')
      .select(`
        *,
        profiles:user_id (
          id, username, avatar, full_name
        )
      `)
      .in('user_id', userIds)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (memeError) throw memeError;

    // Get reel posts
    const { data: reelPosts, error: reelError } = await supabase
      .from('reel_posts')
      .select(`
        *,
        profiles:user_id (
          id, username, avatar, full_name
        )
      `)
      .in('user_id', userIds)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (reelError) throw reelError;

    // Process and combine all posts
    const processedTextPosts = textPosts?.map(post => ({
      post: { ...post, type: 'text' },
      user: post.profiles,
    })) || [];

    const processedImagePosts = imagePosts?.map(post => ({
      post: { ...post, type: 'image' },
      user: post.profiles,
    })) || [];

    const processedMemePosts = memePosts?.map(post => ({
      post: { ...post, type: 'meme' },
      user: post.profiles,
    })) || [];

    const processedReelPosts = reelPosts?.map(post => ({
      post: { ...post, type: 'reel' },
      user: post.profiles,
    })) || [];

    // Combine all posts and sort by created_at
    const allPosts = [
      ...processedTextPosts,
      ...processedImagePosts,
      ...processedMemePosts,
      ...processedReelPosts,
    ].sort((a, b) => new Date(b.post.created_at).getTime() - new Date(a.post.created_at).getTime());

    return { data: allPosts, error: null };
  } catch (error) {
    console.error('Error getting feed posts:', error);
    return { data: [], error };
  }
};

// Get explore posts (posts from users not followed)
export const getExplorePosts = async (userId: string, limit: number = 20, offset: number = 0) => {
  try {
    // Get user's following list
    const { data: followingData, error: followingError } = await supabase
      .from('user_follows')
      .select('following_id')
      .eq('follower_id', userId);

    if (followingError) throw followingError;

    // Extract following IDs
    const followingIds = followingData?.map(follow => follow.following_id) || [];
    
    // Include the user's own ID to exclude their posts from explore
    const excludeIds = [...followingIds, userId];

    // Get text posts from users not followed
    const { data: textPosts, error: textError } = await supabase
      .from('text_posts')
      .select(`
        *,
        profiles:user_id (
          id, username, avatar, full_name
        )
      `)
      .not('user_id', 'in', excludeIds)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (textError) throw textError;

    // Get image posts from users not followed
    const { data: imagePosts, error: imageError } = await supabase
      .from('image_posts')
      .select(`
        *,
        profiles:user_id (
          id, username, avatar, full_name
        )
      `)
      .not('user_id', 'in', excludeIds)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (imageError) throw imageError;

    // Get meme posts from users not followed
    const { data: memePosts, error: memeError } = await supabase
      .from('meme_posts')
      .select(`
        *,
        profiles:user_id (
          id, username, avatar, full_name
        )
      `)
      .not('user_id', 'in', excludeIds)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (memeError) throw memeError;

    // Get reel posts from users not followed
    const { data: reelPosts, error: reelError } = await supabase
      .from('reel_posts')
      .select(`
        *,
        profiles:user_id (
          id, username, avatar, full_name
        )
      `)
      .not('user_id', 'in', excludeIds)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (reelError) throw reelError;

    // Process and combine all posts
    const processedTextPosts = textPosts?.map(post => ({
      post: { ...post, type: 'text' },
      user: post.profiles,
    })) || [];

    const processedImagePosts = imagePosts?.map(post => ({
      post: { ...post, type: 'image' },
      user: post.profiles,
    })) || [];

    const processedMemePosts = memePosts?.map(post => ({
      post: { ...post, type: 'meme' },
      user: post.profiles,
    })) || [];

    const processedReelPosts = reelPosts?.map(post => ({
      post: { ...post, type: 'reel' },
      user: post.profiles,
    })) || [];

    // Combine all posts and sort by created_at
    const allPosts = [
      ...processedTextPosts,
      ...processedImagePosts,
      ...processedMemePosts,
      ...processedReelPosts,
    ].sort((a, b) => new Date(b.post.created_at).getTime() - new Date(a.post.created_at).getTime());

    return { data: allPosts, error: null };
  } catch (error) {
    console.error('Error getting explore posts:', error);
    return { data: null, error };
  }
};

// Like a post
export const likePost = async (userId: string, postId: string, postType: string) => {
  try {
    const { data, error } = await supabase
      .from('likes')
      .insert([
        {
          user_id: userId,
          post_id: postId,
          post_type: postType,
        },
      ]);

    if (error) throw error
