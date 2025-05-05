
import { PostType } from "@/services/content-service";

export interface FeedPost {
  id: string;
  user_id: string;
  type: PostType;  // This should be the PostType enum
  post_type?: string;  // Changed to string to avoid conflicts
  content?: any;
  title?: string;
  image_urls?: string[];
  video_url?: string;
  caption?: string;
  thumbnail_url?: string;
  emoji_mood?: string;
  created_at: string;
  visibility: string;
  likes_count?: number;
  comments_count?: number;
  profiles: {
    id: string;
    username: string | null;
    avatar: string | null;
    full_name: string | null;
  };
  tags: string[];
}
