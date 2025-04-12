
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { trackAnalyticEvent } from "@/services/analytics-service";
import { toast } from "sonner";
import {
  fetchFollowingFeed,
  fetchTrendingFeed,
  fetchMusicFeed,
  fetchCollabsFeed,
  fetchPersonalizedFeed
} from './feed-fetchers';

// Define the post type
interface Post {
  id: string;
  created_at: string;
  type?: 'image' | 'text' | 'reel' | 'collab';
  [key: string]: any;
}

interface FeedOptions {
  feedType?: 'forYou' | 'following' | 'trending' | 'music' | 'collabs';
  limit?: number;
  tags?: string[];
}

export const useFeed = (options: FeedOptions = {}) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [offset, setOffset] = useState<number>(0);
  const { user, profile } = useAuth();
  
  const { 
    feedType = 'forYou', 
    limit = 10,
    tags
  } = options;
  
  const fetchFeed = useCallback(async (reset: boolean = false) => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const newOffset = reset ? 0 : offset;
      let newPosts: Post[] = [];
      
      switch (feedType) {
        case 'following':
          newPosts = await fetchFollowingFeed(user.id, limit, newOffset);
          break;
          
        case 'trending':
          newPosts = await fetchTrendingFeed(limit, newOffset);
          break;
          
        case 'music':
          newPosts = await fetchMusicFeed(limit, newOffset);
          break;
          
        case 'collabs':
          newPosts = await fetchCollabsFeed(limit, newOffset);
          break;
          
        case 'forYou':
        default:
          newPosts = await fetchPersonalizedFeed(user.id, profile?.interests, limit, newOffset);
          break;
      }
      
      setHasMore(newPosts.length === limit);
      
      if (reset) {
        setPosts(newPosts);
      } else {
        setPosts(prev => [...prev, ...newPosts]);
      }
      
      if (reset) {
        setOffset(limit);
      } else {
        setOffset(offset + limit);
      }
      
      trackAnalyticEvent(user.id, 'feed_view', { feed_type: feedType, offset: newOffset, limit });
    } catch (err: any) {
      console.error("Error fetching feed:", err);
      setError(err.message || "Failed to load feed");
      toast.error("Failed to load feed");
    } finally {
      setLoading(false);
    }
  }, [user, profile, feedType, limit, offset, tags]);
  
  const fetchMore = useCallback(() => {
    if (loading || !hasMore) return;
    fetchFeed();
  }, [fetchFeed, loading, hasMore]);
  
  const refresh = useCallback(() => {
    fetchFeed(true);
  }, [fetchFeed]);
  
  useEffect(() => {
    if (user) {
      fetchFeed(true);
    }
  }, [user, feedType, tags]);
  
  return {
    posts,
    loading,
    error,
    hasMore,
    fetchMore,
    refresh
  };
};
