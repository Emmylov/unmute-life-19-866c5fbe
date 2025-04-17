
// This file contains temporary type patches to handle tables that
// may not have been properly typed in the supabase TypeScript definitions

// Explicitly define types for tables that might be missing in the auto-generated types
export type Database = {
  public: {
    Tables: {
      rewards: {
        Row: {
          id: string;
          name: string;
          description: string;
          points_required: number;
          image_url?: string;
          reward_type: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          points_required?: number;
          image_url?: string;
          reward_type: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          points_required?: number;
          image_url?: string;
          reward_type?: string;
          created_at?: string;
        };
      };
      user_rewards: {
        Row: {
          id: string;
          user_id: string;
          reward_id: string;
          claimed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          reward_id: string;
          claimed_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          reward_id?: string;
          claimed_at?: string | null;
          created_at?: string;
        };
      };
      posts_text: {
        Row: {
          id: string;
          user_id: string;
          title?: string;
          body: string;
          tags?: string[];
          emoji_mood?: string;
          visibility?: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title?: string;
          body: string;
          tags?: string[];
          emoji_mood?: string;
          visibility?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          body?: string;
          tags?: string[];
          emoji_mood?: string;
          visibility?: string;
          created_at?: string;
        };
      };
    };
  };
};
