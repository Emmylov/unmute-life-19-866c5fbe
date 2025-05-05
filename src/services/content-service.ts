
// This file is now a barrel export for all the content-related services
// This maintains backward compatibility with existing code that imports from this file

// Upload services
export { uploadImage, uploadReelVideo } from './upload-service';

// Export necessary functions from post-service
export {
  hasLikedPost,
  getPostLikesCount,
  checkPostExists,
  createTextPost,
  createImagePost,
  createReelPost,
  createMemePost,
  getUserPosts,
  getFeedPosts,
  likePost,
  unlikePost,
  getLikeCount,
} from './post-service';

// Add createPost function for backward compatibility
export const createPost = async (userId: string, type: string, data: any) => {
  const { createTextPost, createImagePost, createMemePost, createReelPost } = await import('./post-service');
  
  switch(type) {
    case 'text':
      return createTextPost(userId, data.content, data.title, data.tags, data.visibility || true, data.anonymous || false, data.emoji_mood);
    case 'image':
      return createImagePost(userId, data.image_urls, data.caption, data.tags, data.visibility || true, data.anonymous || false, data.emoji_mood);
    case 'meme':
      return createMemePost(userId, data.image_url, data.caption, data.tags, data.visibility || true, data.anonymous || false, data.emoji_mood);
    case 'reel':
      return createReelPost(
        userId, 
        data.video_url, 
        data.thumbnail_url, 
        data.caption, 
        data.audio, 
        data.audio_type,
        data.audio_url,
        data.duration,
        data.original_audio_volume,
        data.overlay_audio_volume,
        data.tags,
        data.visibility || true,
        data.public || true,
        data.vibe_tag,
        data.emoji_mood
      );
    default:
      throw new Error(`Unsupported post type: ${type}`);
  }
};

// Comment services
export {
  addComment,
  getComments,
  deleteComment,
  // Add reel-specific comment functions
  addComment as addReelComment,
  getComments as getReelComments,
  deleteComment as deleteReelComment
} from './comment-service';

// Export utility functions
export { createSafeProfile } from '@/utils/safe-data-utils';

// Define and export the PostType enum
export enum PostType {
  TEXT = "text",
  IMAGE = "image",
  REEL = "reel",
  MEME = "meme"
}

// Export types using 'export type' syntax for compatibility with isolatedModules
export type { Post, FeedPost } from './post-service';
export type { PostComment } from './comment-service';

// Message services
export {
  sendMessage,
  markMessageAsRead,
  getChatMessages,
  getChatList
} from './message-service';

// Search services
export {
  searchUsers,
  searchContent,
  searchCommunities
} from './search-service';

// Wellness services
export {
  saveWellnessGoal,
  getWellnessGoals,
  saveWellnessActivity,
  getWellnessActivities
} from './wellness-service';

// Settings services
export {
  saveUserSettings,
  getUserSettings
} from './settings-service';

// Analytics services
export {
  trackAnalyticEvent,
  getUserAnalytics
} from './analytics-service';
