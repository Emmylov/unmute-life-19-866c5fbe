
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getCurrentUser } from '@/services/auth-service';
import { toast } from 'sonner';
import { getUnifiedFeedPosts } from '@/services/unified-post-service';

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
  const [hasFetchedData, setHasFetchedData] = useState(false);

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
      
      // If user exists, try the unified posts approach first
      if (currentUser) {
        try {
          const unifiedPosts = await getUnifiedFeedPosts(currentUser.id, limit);
          
          if (unifiedPosts && unifiedPosts.length > 0) {
            // Validate posts to ensure they're valid
            const validPosts = unifiedPosts.filter(post => post && post.id && post.user_id);
            
            setPosts(validPosts);
            setHasFetchedData(true);
            setLoading(false);
            return;
          }
        } catch (err) {
          console.error("Error with unified feed:", err);
          
          if (err instanceof Error && err.message.includes('Failed to fetch')) {
            console.error('Network error when fetching unified posts:', err);
            setNetworkError(true);
            throw err;
          }
        }
      }
      
      // Try to fetch from general posts table as fallback
      try {
        const { data: generalPosts, error: generalError } = await supabase
          .from('posts')
          .select('*, profiles(*)')
          .order('created_at', { ascending: false })
          .limit(limit);
          
        if (generalError) {
          console.error('Error with general posts query:', generalError);
        } else if (generalPosts && generalPosts.length > 0) {
          // Filter out any potentially invalid posts
          const validPosts = generalPosts.filter(post => post && post.id && post.user_id);
          setPosts(validPosts);
          setHasFetchedData(true);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.error('Error with general posts query:', err);
      }
      
      // Try posts_text table as another fallback
      try {
        const { data: textPosts, error: textError } = await supabase
          .from('posts_text')
          .select('*, profiles(*)')
          .order('created_at', { ascending: false })
          .limit(limit);
          
        if (textError) {
          console.error('Error with text posts query:', textError);
        } else if (textPosts && textPosts.length > 0) {
          // Filter out invalid posts
          const validPosts = textPosts.filter(post => post && post.id && post.user_id);
          
          // Transform posts to ensure they have a content field
          const formattedPosts = validPosts.map(post => ({
            ...post,
            content: post.body || ''
          }));
          
          setPosts(formattedPosts);
          setHasFetchedData(true);
          setLoading(false);
          return;
        }
      } catch (textErr) {
        console.error('Error with text posts fallback:', textErr);
      }
      
      // If all else fails, set empty posts
      console.log("No posts found from any source");
      setPosts([]);
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
  }, [fetchFeed, refreshTrigger]);

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
