export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      chat_messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          read: boolean | null
          receiver_id: string | null
          sender_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          read?: boolean | null
          receiver_id?: string | null
          sender_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          read?: boolean | null
          receiver_id?: string | null
          sender_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      interests: {
        Row: {
          category: string
          created_at: string | null
          icon: string
          id: string
          name: string
        }
        Insert: {
          category: string
          created_at?: string | null
          icon: string
          id?: string
          name: string
        }
        Update: {
          category?: string
          created_at?: string | null
          icon?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      post_comments: {
        Row: {
          content: string
          created_at: string | null
          id: string
          post_id: string | null
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          post_id?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          post_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "post_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      post_likes: {
        Row: {
          created_at: string | null
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          cause: string | null
          content: string
          created_at: string | null
          id: string
          image_url: string | null
          storage_path: string | null
          user_id: string | null
        }
        Insert: {
          cause?: string | null
          content: string
          created_at?: string | null
          id?: string
          image_url?: string | null
          storage_path?: string | null
          user_id?: string | null
        }
        Update: {
          cause?: string | null
          content?: string
          created_at?: string | null
          id?: string
          image_url?: string | null
          storage_path?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      posts_images: {
        Row: {
          caption: string | null
          created_at: string | null
          id: string
          image_urls: string[]
          tags: string[] | null
          user_id: string
        }
        Insert: {
          caption?: string | null
          created_at?: string | null
          id?: string
          image_urls: string[]
          tags?: string[] | null
          user_id: string
        }
        Update: {
          caption?: string | null
          created_at?: string | null
          id?: string
          image_urls?: string[]
          tags?: string[] | null
          user_id?: string
        }
        Relationships: []
      }
      posts_memes: {
        Row: {
          bottom_text: string | null
          category: string | null
          created_at: string | null
          id: string
          image_url: string
          top_text: string | null
          user_id: string
        }
        Insert: {
          bottom_text?: string | null
          category?: string | null
          created_at?: string | null
          id?: string
          image_url: string
          top_text?: string | null
          user_id: string
        }
        Update: {
          bottom_text?: string | null
          category?: string | null
          created_at?: string | null
          id?: string
          image_url?: string
          top_text?: string | null
          user_id?: string
        }
        Relationships: []
      }
      posts_reels: {
        Row: {
          allow_comments: boolean | null
          allow_duets: boolean | null
          audio_type: string | null
          audio_url: string | null
          caption: string | null
          created_at: string | null
          duration: number | null
          id: string
          original_audio_volume: number | null
          overlay_audio_volume: number | null
          tags: string[] | null
          user_id: string
          video_url: string
        }
        Insert: {
          allow_comments?: boolean | null
          allow_duets?: boolean | null
          audio_type?: string | null
          audio_url?: string | null
          caption?: string | null
          created_at?: string | null
          duration?: number | null
          id?: string
          original_audio_volume?: number | null
          overlay_audio_volume?: number | null
          tags?: string[] | null
          user_id: string
          video_url: string
        }
        Update: {
          allow_comments?: boolean | null
          allow_duets?: boolean | null
          audio_type?: string | null
          audio_url?: string | null
          caption?: string | null
          created_at?: string | null
          duration?: number | null
          id?: string
          original_audio_volume?: number | null
          overlay_audio_volume?: number | null
          tags?: string[] | null
          user_id?: string
          video_url?: string
        }
        Relationships: []
      }
      posts_text: {
        Row: {
          body: string
          created_at: string | null
          emoji_mood: string | null
          id: string
          tags: string[] | null
          title: string | null
          user_id: string
          visibility: string | null
        }
        Insert: {
          body: string
          created_at?: string | null
          emoji_mood?: string | null
          id?: string
          tags?: string[] | null
          title?: string | null
          user_id: string
          visibility?: string | null
        }
        Update: {
          body?: string
          created_at?: string | null
          emoji_mood?: string | null
          id?: string
          tags?: string[] | null
          title?: string | null
          user_id?: string
          visibility?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar: string | null
          bio: string | null
          created_at: string | null
          followers: number | null
          following: number | null
          full_name: string | null
          id: string
          interests: string[] | null
          is_activist: boolean | null
          is_onboarded: boolean | null
          location: string | null
          notification_count: number | null
          onboarding_step: string | null
          tutorial_completed: boolean | null
          username: string | null
          website: string | null
        }
        Insert: {
          avatar?: string | null
          bio?: string | null
          created_at?: string | null
          followers?: number | null
          following?: number | null
          full_name?: string | null
          id: string
          interests?: string[] | null
          is_activist?: boolean | null
          is_onboarded?: boolean | null
          location?: string | null
          notification_count?: number | null
          onboarding_step?: string | null
          tutorial_completed?: boolean | null
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar?: string | null
          bio?: string | null
          created_at?: string | null
          followers?: number | null
          following?: number | null
          full_name?: string | null
          id?: string
          interests?: string[] | null
          is_activist?: boolean | null
          is_onboarded?: boolean | null
          location?: string | null
          notification_count?: number | null
          onboarding_step?: string | null
          tutorial_completed?: boolean | null
          username?: string | null
          website?: string | null
        }
        Relationships: []
      }
      reel_comments: {
        Row: {
          content: string
          created_at: string | null
          id: string
          reel_id: string | null
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          reel_id?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          reel_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reel_comments_reel_id_fkey"
            columns: ["reel_id"]
            isOneToOne: false
            referencedRelation: "reels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reel_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      reel_likes: {
        Row: {
          created_at: string | null
          reel_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          reel_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          reel_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reel_likes_reel_id_fkey"
            columns: ["reel_id"]
            isOneToOne: false
            referencedRelation: "reels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reel_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      reels: {
        Row: {
          audio: string | null
          caption: string | null
          created_at: string | null
          id: string
          storage_path: string | null
          thumbnail_storage_path: string | null
          thumbnail_url: string | null
          user_id: string | null
          video_url: string
        }
        Insert: {
          audio?: string | null
          caption?: string | null
          created_at?: string | null
          id?: string
          storage_path?: string | null
          thumbnail_storage_path?: string | null
          thumbnail_url?: string | null
          user_id?: string | null
          video_url: string
        }
        Update: {
          audio?: string | null
          caption?: string | null
          created_at?: string | null
          id?: string
          storage_path?: string | null
          thumbnail_storage_path?: string | null
          thumbnail_url?: string | null
          user_id?: string | null
          video_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "reels_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_files: {
        Row: {
          bucket_id: string
          content_type: string | null
          created_at: string | null
          filename: string
          id: string
          metadata: Json | null
          size: number | null
          storage_path: string
          user_id: string | null
        }
        Insert: {
          bucket_id: string
          content_type?: string | null
          created_at?: string | null
          filename: string
          id?: string
          metadata?: Json | null
          size?: number | null
          storage_path: string
          user_id?: string | null
        }
        Update: {
          bucket_id?: string
          content_type?: string | null
          created_at?: string | null
          filename?: string
          id?: string
          metadata?: Json | null
          size?: number | null
          storage_path?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_files_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_interests: {
        Row: {
          created_at: string | null
          interest_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          interest_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          interest_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_interests_interest_id_fkey"
            columns: ["interest_id"]
            isOneToOne: false
            referencedRelation: "interests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_interests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
