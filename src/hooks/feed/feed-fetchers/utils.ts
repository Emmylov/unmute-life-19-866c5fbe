
import { FeedPost } from '@/types/feed-post';
import { PostType } from '@/services/content-service';

export function adaptToFeedPost(post: any): FeedPost {
  // Map post_type string to PostType enum
  let postType: PostType;
  
  switch (post.post_type || post.type) {
    case 'text':
      postType = PostType.TEXT;
      break;
    case 'image':
      postType = PostType.IMAGE;
      break;
    case 'reel':
      postType = PostType.REEL;
      break;
    case 'meme':
      postType = PostType.MEME;
      break;
    default:
      postType = PostType.TEXT; // Default to TEXT if undefined
  }
  
  return {
    ...post,
    type: postType,
    post_type: post.post_type || post.type, // Keep string version for backward compatibility
    likes_count: post.likes_count || 0,
    comments_count: post.comments_count || 0,
    tags: post.tags || [],
    profiles: post.profiles || {
      id: post.user_id,
      username: null,
      avatar: null,
      full_name: null
    }
  };
}
