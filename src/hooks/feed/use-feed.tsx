
import { useState, useEffect } from "react";
import { FeedPost } from "@/types/feed-post";
import { supabase } from "@/integrations/supabase/client";
import { fetchFollowingFeed } from "./feed-fetchers/following-feed";
import { fetchPersonalizedFeed } from "./feed-fetchers/personalized-feed";
import { fetchTrendingFeed } from "./feed-fetchers/trending-feed";
import { toast } from "sonner";
import { adaptToFeedPost } from "./feed-fetchers/utils";

export type FeedType = "personalized" | "following" | "trending" | "music" | "collabs";

export const useFeed = (feedType: FeedType = "personalized") => {
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchNextPage = async () => {
    if (loading || !hasMore) return;
    
    try {
      setLoading(true);
      let newPosts: FeedPost[] = [];
      
      // Determine the last post id for pagination
      const lastPostId = posts.length > 0 ? posts[posts.length - 1].id : null;
      
      switch (feedType) {
        case "following":
          newPosts = await fetchFollowingFeed(lastPostId);
          break;
        case "trending":
          newPosts = await fetchTrendingFeed(lastPostId);
          break;
        case "personalized":
        default:
          newPosts = await fetchPersonalizedFeed(lastPostId);
          break;
      }
      
      if (newPosts.length === 0) {
        setHasMore(false);
      } else {
        setPosts([...posts, ...newPosts]);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch feed';
      console.error("Error fetching feed:", errorMessage);
      setError(errorMessage);
      toast.error("Could not load feed");
    } finally {
      setLoading(false);
    }
  };

  const refreshFeed = async () => {
    try {
      setLoading(true);
      setPosts([]);
      setHasMore(true);
      setError(null);
      
      let newPosts: FeedPost[] = [];
      
      switch (feedType) {
        case "following":
          newPosts = await fetchFollowingFeed();
          break;
        case "trending":
          newPosts = await fetchTrendingFeed();
          break;
        case "personalized":
        default:
          newPosts = await fetchPersonalizedFeed();
          break;
      }
      
      // Properly adapt all posts to ensure they match the FeedPost type
      const adaptedPosts = newPosts.map(post => adaptToFeedPost(post));
      
      setPosts(adaptedPosts);
      setHasMore(newPosts.length > 0);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to refresh feed';
      console.error("Error refreshing feed:", errorMessage);
      setError(errorMessage);
      toast.error("Could not refresh feed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshFeed();
  }, [feedType]);

  return {
    posts,
    loading,
    error,
    hasMore,
    fetchNextPage,
    refreshFeed
  };
};
