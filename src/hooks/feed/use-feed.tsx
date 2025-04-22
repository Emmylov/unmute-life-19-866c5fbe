
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getFeedPosts } from '@/services/post-service';
import { getCurrentUser } from '@/services/auth-service';
import { toast } from 'sonner';

interface UseFeedProps {
  limit?: number;
  type?: 'following' | 'trending' | 'personalized';
  refreshTrigger?: any;
}

export const useFeed = ({ limit = 10, type = 'personalized', refreshTrigger }: UseFeedProps = {}) => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [networkError, setNetworkError] = useState(false);
  const refreshCountRef = useRef(0);
  const attemptsRef = useRef(0);
  const maxAttempts = 3;

  const fetchFeed = useCallback(async () => {
    setLoading(true);
    setError(null);
    setNetworkError(false);
    
    // Don't try more than 3 times in quick succession
    if (attemptsRef.current >= maxAttempts) {
      console.log("Maximum fetch attempts reached, waiting before trying again");
      setTimeout(() => {
        attemptsRef.current = 0;
      }, 30000); // Reset after 30 seconds
      setLoading(false);
      return;
    }
    
    attemptsRef.current += 1;
    
    try {
      // First try to get the current user
      let currentUser;
      try {
        currentUser = await getCurrentUser();
      } catch (err) {
        console.warn('Error getting current user:', err);
        // Continue without user - will use general feed
      }
      
      if (!currentUser) {
        // If no user, get general posts using a simpler query
        try {
          const { data: generalPosts, error: generalError } = await supabase
            .from('posts')
            .select(`
              *,
              profiles:user_id (
                id,
                username,
                avatar
              )
            `)
            .order('created_at', { ascending: false })
            .limit(limit);
            
          if (generalError) throw generalError;
          setPosts(generalPosts || []);
          setLoading(false);
          return;
        } catch (err) {
          if (err instanceof Error && err.message.includes('Failed to fetch')) {
            console.error('Network error when fetching general posts:', err);
            setNetworkError(true);
            throw err;
          }
          
          console.error('Error with general posts query:', err);
          // Try the absolute simplest query as a last resort
          const { data: simpleData } = await supabase
            .from('posts')
            .select('id, content, created_at')
            .limit(5);
          
          if (simpleData && simpleData.length > 0) {
            setPosts(simpleData);
            return;
          }
          
          throw err;
        }
      }
      
      // If we have a user, try to get personalized feed
      try {
        const feedPosts = await getFeedPosts(currentUser.id, limit);
        setPosts(feedPosts || []);
      } catch (err) {
        console.error("Error with primary feed query:", err);
        
        if (err instanceof Error && err.message.includes('Failed to fetch')) {
          console.error('Network error when fetching feed posts:', err);
          setNetworkError(true);
          throw err;
        }
        
        // Fallback to simpler query if the relation query fails
        console.log("Using fallback posts query");
        const { data: fallbackPosts, error: fallbackError } = await supabase
          .from('posts')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(limit);
          
        if (fallbackError) throw fallbackError;
        
        if (fallbackPosts && fallbackPosts.length > 0) {
          setPosts(fallbackPosts);
          return;
        }
        
        // If still no posts, try the simplest query
        const { data: simpleData } = await supabase
          .from('posts')
          .select('id, content, created_at')
          .limit(5);
        
        if (simpleData && simpleData.length > 0) {
          setPosts(simpleData);
          return;
        }
        
        // If all else fails, set empty posts
        setPosts([]);
      }
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
    } finally {
      setLoading(false);
      
      // Reset attempt counter after successful load or on final attempt
      if (!error || attemptsRef.current >= maxAttempts) {
        setTimeout(() => {
          attemptsRef.current = 0;
        }, 5000);
      }
    }
  }, [limit, type]);

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

  // Refresh function that can be called manually
  const refresh = useCallback(() => {
    console.log("Refreshing feed...");
    refreshCountRef.current += 1;
    attemptsRef.current = 0; // Reset attempts on manual refresh
    fetchFeed();
  }, [fetchFeed]);

  // Initial fetch
  useEffect(() => {
    fetchFeed();
  }, [fetchFeed, refreshTrigger, refreshCountRef.current]);

  return { 
    posts, 
    loading, 
    error, 
    refresh, 
    networkError,
    isRetrying: attemptsRef.current > 1 && attemptsRef.current < maxAttempts
  };
};

export default useFeed;
