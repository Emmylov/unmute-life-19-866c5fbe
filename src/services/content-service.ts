
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
} from './post-service';

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

// Export types using 'export type' syntax for compatibility with isolatedModules
export type { Post, FeedPost, PostType } from './post-service';
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
