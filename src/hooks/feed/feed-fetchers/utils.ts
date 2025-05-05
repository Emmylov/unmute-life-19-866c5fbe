
import { FeedPost } from '@/types/feed-post';
import { PostType } from '@/services/content-service';

export function adaptToFeedPost(post: any): FeedPost {
  // Ensure both type and post_type are set correctly
  const postType = post.post_type || PostType.TEXT;
  
  return {
    ...post,
    type: postType, // Set the required 'type' property
    post_type: postType, // Keep the post_type property for backward compatibility
    likes_count: post.likes_count || 0,
    comments_count: post.comments_count || 0
  };
}
