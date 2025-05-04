
import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { FeedPost, getFeedPosts } from '@/services/post-service';

interface UseFeedProps {
  limit?: number;
  type?: 'following' | 'trending' | 'personalized';
  refreshTrigger?: any;
  userId?: string;
}

export const useFeed = ({ 
  limit = 10, 
  type = 'personalized', 
  refreshTrigger,
  userId
}: UseFeedProps = {}) => {
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [networkError, setNetworkError] = useState(false);
  const refreshCountRef = useRef(0);
  const attemptsRef = useRef(0);
  const maxAttempts = 3;
  const [hasFetchedData, setHasFetchedData] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const { user } = useAuth();

  const fetchFeed = useCallback(async (forceRefresh = false) => {
    // Cancel any in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Create new abort controller for this request
    abortControllerRef.current = new AbortController();
    
    setLoading(true);
    setError(null);
    setNetworkError(false);
    
    console.log(`Fetching feed (attempt ${attemptsRef.current + 1}/${maxAttempts})${forceRefresh ? ' with force refresh' : ''}${userId ? ' for user: ' + userId : ''}`);
    
    // Don't try more than 3 times in quick succession unless forced
    if (attemptsRef.current >= maxAttempts && !forceRefresh) {
      console.log("Maximum fetch attempts reached, waiting before trying again");
      setTimeout(() => {
        attemptsRef.current = 0;
      }, 30000); // Reset after 30 seconds
      setLoading(false);
      return;
    }
    
    attemptsRef.current += 1;
    
    try {
      // Determine which user ID to use
      const targetUserId = userId || user?.id;
      
      if (!targetUserId) {
        console.log("No user ID available for feed fetch");
        setPosts([]);
        setLoading(false);
        return;
      }
      
      // Fetch posts with the new service
      const feedPosts = await getFeedPosts(targetUserId, limit);
      console.log(`Fetched ${feedPosts.length} posts for feed`);
      
      setPosts(feedPosts);
      setHasFetchedData(true);
      attemptsRef.current = 0; // Reset attempts on success
      setLoading(false);
    } catch (err) {
      console.error('Error fetching feed:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch feed'));
      
      if (err instanceof Error && err.message.includes('Failed to fetch')) {
        setNetworkError(true);
      }
      
      // Only show toast for non-network errors
      if (!(err instanceof Error && err.message.includes('Failed to fetch'))) {
        toast.error('Failed to load feed', {
          description: 'Please try refreshing the page.'
        });
      }
      
      setLoading(false);
      
      // Reset attempt counter after successful load or on final attempt
      if (!error || attemptsRef.current >= maxAttempts) {
        setTimeout(() => {
          attemptsRef.current = 0;
        }, 5000);
      }
    }
  }, [limit, userId, user?.id]);

  // Auto-retry once for network errors with backoff
  useEffect(() => {
    if (networkError && attemptsRef.current < maxAttempts) {
      const retryTimer = setTimeout(() => {
        console.log(`Retrying feed fetch after network error (attempt ${attemptsRef.current})`);
        fetchFeed();
      }, 2000 * attemptsRef.current); // Exponential backoff
      
      return () => clearTimeout(retryTimer);
    }
  }, [networkError, fetchFeed]);

  // Refresh function that can be called manually - now with force refresh option
  const refresh = useCallback(() => {
    console.log("Manually refreshing feed...");
    refreshCountRef.current += 1;
    attemptsRef.current = 0; // Reset attempts on manual refresh
    return fetchFeed(true); // Force refresh to bypass cache
  }, [fetchFeed]);

  // Initial fetch
  useEffect(() => {
    console.log("Initial feed fetch triggered");
    fetchFeed();
    
    return () => {
      // Cancel any pending request when component unmounts
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchFeed, refreshTrigger, user?.id]);

  return { 
    posts, 
    loading, 
    error, 
    refresh, 
    networkError,
    isRetrying: attemptsRef.current > 1 && attemptsRef.current < maxAttempts,
    hasFetchedData
  };
};

export default useFeed;
