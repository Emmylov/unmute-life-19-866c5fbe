
import { Database as OriginalDatabase } from './types';

// Extended Database type that includes missing tables
export type ExtendedDatabase = OriginalDatabase & {
  public: {
    Tables: OriginalDatabase['public']['Tables'] & {
      posts_text: {
        Row: {
          id: string;
          user_id: string;
          created_at: string | null;
          title: string | null;
          body: string;
          tags: string[] | null;
          emoji_mood: string | null;
          visibility: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          created_at?: string | null;
          title?: string | null;
          body: string;
          tags?: string[] | null;
          emoji_mood?: string | null;
          visibility?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          created_at?: string | null;
          title?: string | null;
          body?: string;
          tags?: string[] | null;
          emoji_mood?: string | null;
          visibility?: string | null;
        };
        Relationships: [];
      };
      posts_images: {
        Row: {
          id: string;
          user_id: string;
          created_at: string | null;
          image_urls: string[];
          caption: string | null;
          tags: string[] | null;
          storage_path?: string;
          visibility?: string;
          layout?: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          created_at?: string | null;
          image_urls: string[];
          caption?: string | null;
          tags?: string[] | null;
          storage_path?: string;
          visibility?: string;
          layout?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          created_at?: string | null;
          image_urls?: string[];
          caption?: string | null;
          tags?: string[] | null;
          storage_path?: string;
          visibility?: string;
          layout?: string;
        };
        Relationships: [];
      };
      posts_memes: {
        Row: {
          id: string;
          user_id: string;
          created_at: string | null;
          image_url: string;
          top_text: string | null;
          bottom_text: string | null;
          category: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          created_at?: string | null;
          image_url: string;
          top_text?: string | null;
          bottom_text?: string | null;
          category?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          created_at?: string | null;
          image_url?: string;
          top_text?: string | null;
          bottom_text?: string | null;
          category?: string | null;
        };
        Relationships: [];
      };
      posts_reels: {
        Row: {
          id: string;
          user_id: string;
          created_at: string | null;
          video_url: string;
          original_audio_volume: number | null;
          overlay_audio_volume: number | null;
          allow_duets: boolean | null;
          allow_comments: boolean | null;
          duration: number | null;
          audio_url: string | null;
          caption: string | null;
          tags: string[] | null;
          audio_type: string | null;
          thumbnail_url?: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          created_at?: string | null;
          video_url: string;
          original_audio_volume?: number | null;
          overlay_audio_volume?: number | null;
          allow_duets?: boolean | null;
          allow_comments?: boolean | null;
          duration?: number | null;
          audio_url?: string | null;
          caption?: string | null;
          tags?: string[] | null;
          audio_type?: string | null;
          thumbnail_url?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          created_at?: string | null;
          video_url?: string;
          original_audio_volume?: number | null;
          overlay_audio_volume?: number | null;
          allow_duets?: boolean | null;
          allow_comments?: boolean | null;
          duration?: number | null;
          audio_url?: string | null;
          caption?: string | null;
          tags?: string[] | null;
          audio_type?: string | null;
          thumbnail_url?: string | null;
        };
        Relationships: [];
      };
    };
  };
};

// Re-export as Database to maintain compatibility
export type Database = ExtendedDatabase;
