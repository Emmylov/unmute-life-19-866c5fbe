
export interface Reel {
  id: string;
  user_id: string;
  created_at: string;
  video_url: string;
  thumbnail_url: string | null;
  caption: string | null;
  audio: string | null;
  audio_type: string | null;
  audio_url: string | null;
  duration: number | null;
  original_audio_volume: number;
  overlay_audio_volume: number;
  tags: string[];
  allow_comments: boolean;
  allow_duets: boolean;
  vibe_tag: string | null;
  mood_vibe: string | null;
}

export interface User {
  id: string;
  username: string;
  avatar: string;
  full_name: string;
}

export interface ReelWithUser {
  reel: Reel;
  user: User;
}
