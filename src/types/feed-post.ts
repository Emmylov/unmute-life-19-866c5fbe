
import { PostType } from "@/services/content-service";

export interface FeedPost {
  id: string;
  user_id: string;
  type: PostType;  // For compatibility with existing code
  post_type?: PostType;  // Used in some places instead of type
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
