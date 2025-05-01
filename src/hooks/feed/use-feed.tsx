
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getCurrentUser } from '@/services/auth-service';
import { toast } from 'sonner';
import { getUnifiedFeedPosts } from '@/services/unified-post-service';
import { getFeedPosts } from '@/services/post-service';

interface UseFeedProps {
  limit?: number;
  type?: 'following' | 'trending' | 'personalized';
  refreshTrigger?: any;
  userId?: string; // Added userId parameter for profile pages
}

export const useFeed = ({ 
  limit = 10, 
  type = 'personalized', 
  refreshTrigger,
  userId // Use this for profile pages
}: UseFeedProps = {}) => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [networkError, setNetworkError] = useState(false);
  const refreshCountRef = useRef(0);
  const attemptsRef = useRef(0);
  const maxAttempts = 3;
  const [hasFetchedData, setHasFetchedData] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

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
      // First try to get the current user if userId not provided
      let currentUser;
      let targetUserId = userId;
      
      if (!targetUserId) {
        try {
          currentUser = await getCurrentUser();
          console.log("Current user fetched:", currentUser?.id);
          targetUserId = currentUser?.id;
        } catch (err) {
          console.warn('Error getting current user:', err);
          // Continue without user - will use general feed
        }
      }
      
      let fetchedPosts: any[] = [];
      
      // Set up a timeout promise
      const timeoutPromise = new Promise<null>((resolve) => {
        setTimeout(() => {
          console.warn('Feed fetch timeout reached');
          resolve(null);
        }, 8000); // 8 second timeout
      });
      
      // If user exists, try multiple approaches to fetch posts
      if (targetUserId) {
        try {
          // Approach 1: Use unified posts service
          console.log("Fetching unified posts for user:", targetUserId);
          
          const postsPromise = getUnifiedFeedPosts(
            targetUserId, 
            limit,
            forceRefresh ? { cache: 'no-cache' } : undefined
          );
          
          // Race against timeout
          const unifiedPosts = await Promise.race([postsPromise, timeoutPromise]);
          
          if (unifiedPosts && Array.isArray(unifiedPosts) && unifiedPosts.length > 0) {
            console.log(`Fetched ${unifiedPosts.length} posts from unified posts service`);
            // Validate posts to ensure they're valid
            fetchedPosts = unifiedPosts.filter(post => post && post.id && post.user_id);
            console.log(`After validation: ${fetchedPosts.length} valid posts`);
          } else {
            console.log("No posts returned from unified posts service");
          }
        } catch (unifiedErr) {
          console.error("Error with unified feed:", unifiedErr);
          
          if (unifiedErr instanceof Error && unifiedErr.message.includes('Failed to fetch')) {
            setNetworkError(true);
          }
          
          // Continue with other approaches
        }
        
        // If no posts from unified service, try the legacy approach
        if (fetchedPosts.length === 0) {
          try {
            console.log("Falling back to legacy feed service");
            const legacyPosts = await getFeedPosts(targetUserId, limit);
            if (legacyPosts && legacyPosts.length > 0) {
              console.log(`Fetched ${legacyPosts.length} posts from legacy feed service`);
              fetchedPosts = legacyPosts;
            } else {
              console.log("No posts returned from legacy feed service");
            }
          } catch (legacyErr) {
            console.error("Error with legacy feed:", legacyErr);
          }
        }
      }
      
      // If we have posts, set them and mark as fetched
      if (fetchedPosts.length > 0) {
        console.log(`Setting ${fetchedPosts.length} posts in feed`);
        setPosts(fetchedPosts);
        setHasFetchedData(true);
        attemptsRef.current = 0; // Reset attempts on success
        setLoading(false);
        return;
      }
      
      // Last resort: fetch from posts_text directly
      try {
        console.log("Attempting direct query to posts_text table");
        const { data: textPosts, error: textError } = await supabase
          .from('posts_text')
          .select(`
            id, 
            user_id,
            created_at,
            body,
            title,
            emoji_mood,
            tags
          `)
          .order('created_at', { ascending: false })
          .limit(limit);
          
        if (textError) {
          console.error('Error with text posts query:', textError);
        } else if (textPosts && textPosts.length > 0) {
          console.log(`Fetched ${textPosts.length} posts from posts_text table`);
          // Get unique user IDs to fetch profiles
          const userIds = [...new Set(textPosts.map(post => post.user_id))];
          
          // Fetch profiles separately
          const { data: profilesData } = await supabase
            .from("profiles")
            .select("id, username, avatar, full_name")
            .in("id", userIds);
            
          // Create a map of profiles
          const profileMap = new Map();
          if (profilesData) {
            profilesData.forEach(profile => {
              profileMap.set(profile.id, profile);
            });
          }
          
          // Combine posts with profiles
          const formattedTextPosts = textPosts.map(post => ({
            ...post,
            content: post.body || '',
            post_type: 'text',
            profiles: profileMap.get(post.user_id) || null,
            is_deleted: false // Explicitly mark as not deleted since we know they exist
          }));
          
          setPosts(formattedTextPosts);
          setHasFetchedData(true);
          attemptsRef.current = 0; // Reset attempts on success
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
      setHasFetchedData(true);
      
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
  }, [limit, type, userId]); // Added userId to dependencies

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
