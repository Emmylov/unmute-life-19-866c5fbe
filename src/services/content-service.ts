
// This file is now a barrel export for all the content-related services
// This maintains backward compatibility with existing code that imports from this file

// Upload services
export { uploadImage, uploadReelVideo } from './upload-service';

// Post services
export {
  createImagePost,
  createTextPost,
  createReelPost,
  getUserPosts,
  getFeedPosts
} from './post-service';

// Comment services
export {
  addComment,
  getComments
} from './comment-service';

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
