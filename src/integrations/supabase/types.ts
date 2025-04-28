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
      notifications: {
        Row: {
          content: string
          created_at: string
          from_user_id: string | null
          id: string
          read: boolean | null
          reference_id: string | null
          reference_type: string | null
          type: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          from_user_id?: string | null
          id?: string
          read?: boolean | null
          reference_id?: string | null
          reference_type?: string | null
          type: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          from_user_id?: string | null
          id?: string
          read?: boolean | null
          reference_id?: string | null
          reference_type?: string | null
          type?: string
          user_id?: string
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
          audio: string | null
          audio_type: string | null
          audio_url: string | null
          caption: string | null
          created_at: string | null
          duration: number | null
          id: string
          original_audio_volume: number | null
          overlay_audio_volume: number | null
          tags: string[] | null
          thumbnail_url: string | null
          user_id: string
          video_url: string
        }
        Insert: {
          allow_comments?: boolean | null
          allow_duets?: boolean | null
          audio?: string | null
          audio_type?: string | null
          audio_url?: string | null
          caption?: string | null
          created_at?: string | null
          duration?: number | null
          id?: string
          original_audio_volume?: number | null
          overlay_audio_volume?: number | null
          tags?: string[] | null
          thumbnail_url?: string | null
          user_id: string
          video_url: string
        }
        Update: {
          allow_comments?: boolean | null
          allow_duets?: boolean | null
          audio?: string | null
          audio_type?: string | null
          audio_url?: string | null
          caption?: string | null
          created_at?: string | null
          duration?: number | null
          id?: string
          original_audio_volume?: number | null
          overlay_audio_volume?: number | null
          tags?: string[] | null
          thumbnail_url?: string | null
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
      profile_reactions: {
        Row: {
          created_at: string
          emoji: string
          from_user_id: string
          id: string
          to_user_id: string
        }
        Insert: {
          created_at?: string
          emoji: string
          from_user_id: string
          id?: string
          to_user_id: string
        }
        Update: {
          created_at?: string
          emoji?: string
          from_user_id?: string
          id?: string
          to_user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_reactions_from_user_id_fkey"
            columns: ["from_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profile_reactions_to_user_id_fkey"
            columns: ["to_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
          theme_color: string | null
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
          theme_color?: string | null
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
          theme_color?: string | null
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
      reported_content: {
        Row: {
          content_id: string
          content_type: string
          created_at: string | null
          id: string
          reason: string
          status: string
          user_id: string
        }
        Insert: {
          content_id: string
          content_type: string
          created_at?: string | null
          id?: string
          reason: string
          status?: string
          user_id: string
        }
        Update: {
          content_id?: string
          content_type?: string
          created_at?: string | null
          id?: string
          reason?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      reposted_reels: {
        Row: {
          created_at: string | null
          id: string
          original_user_id: string
          reel_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          original_user_id: string
          reel_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          original_user_id?: string
          reel_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reposted_reels_reel_id_fkey"
            columns: ["reel_id"]
            isOneToOne: false
            referencedRelation: "posts_reels"
            referencedColumns: ["id"]
          },
        ]
      }
      rewards: {
        Row: {
          created_at: string | null
          description: string
          id: string
          image_url: string | null
          name: string
          points_required: number | null
          reward_type: string
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          image_url?: string | null
          name: string
          points_required?: number | null
          reward_type: string
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          image_url?: string | null
          name?: string
          points_required?: number | null
          reward_type?: string
        }
        Relationships: []
      }
      saved_reels: {
        Row: {
          created_at: string | null
          id: string
          reel_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          reel_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          reel_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_reels_reel_id_fkey"
            columns: ["reel_id"]
            isOneToOne: false
            referencedRelation: "posts_reels"
            referencedColumns: ["id"]
          },
        ]
      }
      stories: {
        Row: {
          caption: string | null
          created_at: string
          id: string
          media_url: string
          mood: string | null
          storage_path: string | null
          user_id: string
        }
        Insert: {
          caption?: string | null
          created_at?: string
          id?: string
          media_url: string
          mood?: string | null
          storage_path?: string | null
          user_id: string
        }
        Update: {
          caption?: string | null
          created_at?: string
          id?: string
          media_url?: string
          mood?: string | null
          storage_path?: string | null
          user_id?: string
        }
        Relationships: []
      }
      unified_post_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          is_deleted: boolean | null
          post_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_deleted?: boolean | null
          post_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_deleted?: boolean | null
          post_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "unified_post_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "unified_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "unified_post_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "v_active_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      unified_post_likes: {
        Row: {
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "unified_post_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "unified_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "unified_post_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "v_active_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      unified_posts: {
        Row: {
          caption: string | null
          content: string | null
          created_at: string
          deleted_at: string | null
          emoji_mood: string | null
          id: string
          image_urls: string[] | null
          is_deleted: boolean | null
          post_type: string
          tags: string[] | null
          title: string | null
          updated_at: string
          user_id: string
          video_url: string | null
          visibility: string
        }
        Insert: {
          caption?: string | null
          content?: string | null
          created_at?: string
          deleted_at?: string | null
          emoji_mood?: string | null
          id?: string
          image_urls?: string[] | null
          is_deleted?: boolean | null
          post_type: string
          tags?: string[] | null
          title?: string | null
          updated_at?: string
          user_id: string
          video_url?: string | null
          visibility?: string
        }
        Update: {
          caption?: string | null
          content?: string | null
          created_at?: string
          deleted_at?: string | null
          emoji_mood?: string | null
          id?: string
          image_urls?: string[] | null
          is_deleted?: boolean | null
          post_type?: string
          tags?: string[] | null
          title?: string | null
          updated_at?: string
          user_id?: string
          video_url?: string | null
          visibility?: string
        }
        Relationships: []
      }
      user_analytics: {
        Row: {
          created_at: string | null
          event_data: Json | null
          event_type: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          event_data?: Json | null
          event_type: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          event_data?: Json | null
          event_type?: string
          id?: string
          user_id?: string
        }
        Relationships: []
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
      user_follows: {
        Row: {
          created_at: string
          follower_id: string
          following_id: string
        }
        Insert: {
          created_at?: string
          follower_id: string
          following_id: string
        }
        Update: {
          created_at?: string
          follower_id?: string
          following_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_follows_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_follows_following_id_fkey"
            columns: ["following_id"]
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
      user_rewards: {
        Row: {
          claimed_at: string | null
          created_at: string | null
          id: string
          reward_id: string
          user_id: string
        }
        Insert: {
          claimed_at?: string | null
          created_at?: string | null
          id?: string
          reward_id: string
          user_id: string
        }
        Update: {
          claimed_at?: string | null
          created_at?: string | null
          id?: string
          reward_id?: string
          user_id?: string
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          created_at: string | null
          id: string
          settings: Json
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          settings?: Json
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          settings?: Json
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      waitlist: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
    }
    Views: {
      v_active_posts: {
        Row: {
          caption: string | null
          content: string | null
          created_at: string | null
          deleted_at: string | null
          emoji_mood: string | null
          id: string | null
          image_urls: string[] | null
          is_deleted: boolean | null
          post_type: string | null
          tags: string[] | null
          title: string | null
          updated_at: string | null
          user_id: string | null
          video_url: string | null
          visibility: string | null
        }
        Insert: {
          caption?: string | null
          content?: string | null
          created_at?: string | null
          deleted_at?: string | null
          emoji_mood?: string | null
          id?: string | null
          image_urls?: string[] | null
          is_deleted?: boolean | null
          post_type?: string | null
          tags?: string[] | null
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
          video_url?: string | null
          visibility?: string | null
        }
        Update: {
          caption?: string | null
          content?: string | null
          created_at?: string | null
          deleted_at?: string | null
          emoji_mood?: string | null
          id?: string | null
          image_urls?: string[] | null
          is_deleted?: boolean | null
          post_type?: string | null
          tags?: string[] | null
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
          video_url?: string | null
          visibility?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_feed_posts: {
        Args: { user_uuid: string; post_limit?: number }
        Returns: {
          caption: string | null
          content: string | null
          created_at: string
          deleted_at: string | null
          emoji_mood: string | null
          id: string
          image_urls: string[] | null
          is_deleted: boolean | null
          post_type: string
          tags: string[] | null
          title: string | null
          updated_at: string
          user_id: string
          video_url: string | null
          visibility: string
        }[]
      }
      is_reel_reposted: {
        Args: { p_reel_id: string; p_user_id: string }
        Returns: boolean
      }
      is_reel_saved: {
        Args: { p_reel_id: string; p_user_id: string }
        Returns: boolean
      }
      like_posts_reel: {
        Args: { p_reel_id: string; p_user_id: string; p_created_at: string }
        Returns: boolean
      }
      report_content: {
        Args: {
          p_content_id: string
          p_user_id: string
          p_content_type: string
          p_reason: string
          p_created_at: string
        }
        Returns: undefined
      }
      repost_reel: {
        Args: {
          p_reel_id: string
          p_user_id: string
          p_original_user_id: string
          p_created_at: string
        }
        Returns: undefined
      }
      save_reel: {
        Args: { p_reel_id: string; p_user_id: string; p_created_at: string }
        Returns: undefined
      }
      soft_delete_post: {
        Args: { post_id: string }
        Returns: undefined
      }
      unsave_reel: {
        Args: { p_reel_id: string; p_user_id: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
