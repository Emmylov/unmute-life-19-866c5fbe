
import { supabase } from '@/integrations/supabase/client';
import { createTextPost, createImagePost, createReelPost, createMemePost } from './post-service';

// Create a unified text post
export const createUnifiedTextPost = async (
  userId: string,
  content: string,
  title?: string,
  tags?: string[],
  allowComments: boolean = true,
  isAnonymous: boolean = false,
  moodVibe?: string
) => {
  return createTextPost(userId, content, title, tags, allowComments, isAnonymous, moodVibe);
};

// Create a unified image post
export const createUnifiedImagePost = async (
  userId: string,
  imageUrls: string[],
  caption?: string,
  tags?: string[],
  allowComments: boolean = true,
  isAnonymous: boolean = false,
  moodVibe?: string
) => {
  return createImagePost(userId, imageUrls, caption, tags, allowComments, isAnonymous, moodVibe);
};

// Create a unified reel post
export const createUnifiedReelPost = async (
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
  return createReelPost(
    userId,
    videoUrl,
    thumbnailUrl,
    caption,
    audio,
    audioType,
    audioUrl,
    duration,
    originalAudioVolume,
    overlayAudioVolume,
    tags,
    allowComments,
    allowDuets,
    vibeTag,
    moodVibe
  );
};

// Create a unified meme post
export const createUnifiedMemePost = async (
  userId: string,
  imageUrl: string,
  caption?: string,
  tags?: string[],
  allowComments: boolean = true,
  isAnonymous: boolean = false,
  moodVibe?: string
) => {
  return createMemePost(userId, imageUrl, caption, tags, allowComments, isAnonymous, moodVibe);
};

// Get posts by a user
export const getUnifiedPostsByUser = async (userId: string, limit = 10, offset = 0) => {
  try {
    const { data: textPosts, error: textError } = await supabase
      .from('text_posts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (textError) throw textError;

    const { data: imagePosts, error: imageError } = await supabase
      .from('image_posts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (imageError) throw imageError;

    const { data: memePosts, error: memeError } = await supabase
      .from('meme_posts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (memeError) throw memeError;

    const { data: reelPosts, error: reelError } = await supabase
      .from('reel_posts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (reelError) throw reelError;

    const allPosts = [
      ...(textPosts || []).map(post => ({ ...post, type: 'text_post' })),
      ...(imagePosts || []).map(post => ({ ...post, type: 'image_post' })),
      ...(memePosts || []).map(post => ({ ...post, type: 'meme_post' })),
      ...(reelPosts || []).map(post => ({ ...post, type: 'reel_post' })),
    ]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, limit);

    return { data: allPosts, error: null };
  } catch (error) {
    console.error('Error getting unified posts by user:', error);
    return { data: [], error };
  }
};

export default {
  createUnifiedTextPost,
  createUnifiedImagePost,
  createUnifiedReelPost,
  createUnifiedMemePost,
  getUnifiedPostsByUser
};
