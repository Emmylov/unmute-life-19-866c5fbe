
import { Tables } from "@/integrations/supabase/types";

// Define explicit types for reels to prevent TypeScript from infinite type instantiation
export interface ReelContent {
  id: string;
  user_id: string;
  created_at: string;
  video_url: string;
  thumbnail_url?: string | null;
  caption?: string | null;
  audio?: string | null;
  audio_type?: string | null;
  audio_url?: string | null; 
  duration?: number | null;
  original_audio_volume?: number | null;
  overlay_audio_volume?: number | null;
  tags?: string[] | null;
  allow_comments?: boolean | null;
  allow_duets?: boolean | null;
  vibe_tag?: string | null;
  mood_vibe?: string | null;
}

export interface ProfileSummary {
  id: string;
  username?: string | null;
  avatar?: string | null;
  full_name?: string | null;
}

export interface ReelWithUser {
  reel: ReelContent;
  user: ProfileSummary;
}

// Use a simple type for database records to avoid complexity
export type DatabaseReel = Record<string, any>;
