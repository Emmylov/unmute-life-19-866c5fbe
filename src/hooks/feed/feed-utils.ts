
// Utility function to safely create a profile object
export const createSafeProfile = (profileData: any): {
  id: string;
  username: string | null;
  avatar: string | null;
  full_name: string | null;
} => {
  return {
    id: profileData?.id || '',
    username: profileData?.username || null,
    avatar: profileData?.avatar || null,
    full_name: profileData?.full_name || null
  };
};

// Add Post type definition needed by feed-fetchers
export interface Post {
  id: string;
  userId: string;
  user_id?: string; // Add snake_case version for compatibility
  type: 'text' | 'image' | 'reel' | 'meme';
  title?: string | null;
  body?: string | null;
  imageUrl?: string | null;
  videoUrl?: string | null;
  thumbnailUrl?: string | null;
  audioUrl?: string | null;
  audioType?: string | null;
  createdAt: string;
  created_at?: string; // Add snake_case version for compatibility
  user: {
    id: string;
    name: string | null;
    username: string | null;
    avatar: string | null;
  };
  stats: {
    likes: number;
    comments: number;
    shares: number;
  };
  tags?: string[];
  content?: string | null;
  caption?: string | null;
  imageUrls?: string[] | null;
}
