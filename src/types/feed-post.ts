
import { PostType } from "@/services/content-service";

export interface FeedPost {
  id: string;
  user_id: string;
  type: PostType;  // Using the PostType enum from content-service
  post_type?: string;  // Keep string version for backward compatibility
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
