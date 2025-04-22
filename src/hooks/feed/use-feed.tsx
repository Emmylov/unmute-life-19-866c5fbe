
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
      
      // Fetch general posts first as most reliable approach
      try {
        const { data: generalPosts, error: generalError } = await supabase
          .from('posts')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(limit);
          
        if (generalError) {
          console.error('Error with general posts query:', generalError);
        } else if (generalPosts && generalPosts.length > 0) {
          setPosts(generalPosts);
          setHasFetchedData(true);
          setLoading(false);
          
          // Try to fetch user profiles separately for these posts
          const userIds = [...new Set(generalPosts.map(post => post.user_id))];
          if (userIds.length > 0) {
            try {
              const { data: profilesData } = await supabase
                .from("profiles")
                .select("id, username, avatar, full_name, is_og")
                .in("id", userIds);
                
              if (profilesData && profilesData.length > 0) {
                // Create a map of profiles for easy lookup
                const profileMap = new Map();
                profilesData.forEach(profile => {
                  profileMap.set(profile.id, profile);
                });
                
                // Merge post data with profile data
                const postsWithProfiles = generalPosts.map(post => {
                  const userProfile = profileMap.get(post.user_id);
                  return {
                    ...post,
                    profiles: userProfile || null
                  };
                });
                
                setPosts(postsWithProfiles);
              }
            } catch (profileError) {
              console.error("Error fetching profiles:", profileError);
              // We already have posts, so don't set an error state
            }
          }
          
          return;
        }
      } catch (err) {
        console.error('Error with general posts query:', err);
        // Continue to other approaches
      }
      
      // If user exists, try the personalized feed
      if (currentUser) {
        try {
          const feedPosts = await getFeedPosts(currentUser.id, limit);
          if (feedPosts && feedPosts.length > 0) {
            setPosts(feedPosts);
            setHasFetchedData(true);
            return;
          }
        } catch (err) {
          console.error("Error with primary feed query:", err);
          
          if (err instanceof Error && err.message.includes('Failed to fetch')) {
            console.error('Network error when fetching feed posts:', err);
            setNetworkError(true);
            throw err;
          }
        }
      }
      
      // Try posts_text table as a fallback
      try {
        console.log("Using text posts fallback query");
        const { data: textPosts, error: textError } = await supabase
          .from('posts_text')
          .select('id, body, title, created_at, user_id, emoji_mood, tags')
          .order('created_at', { ascending: false })
          .limit(limit);
          
        if (textError) {
          console.error('Error with text posts query:', textError);
        } else if (textPosts && textPosts.length > 0) {
          // Transform posts to ensure they have a content field
          const formattedPosts = textPosts.map(post => ({
            ...post,
            content: post.body || ''
          }));
          
          setPosts(formattedPosts);
          setHasFetchedData(true);
          
          // Try to fetch user profiles for these posts
          const userIds = [...new Set(textPosts.map(post => post.user_id))];
          if (userIds.length > 0) {
            try {
              const { data: profilesData } = await supabase
                .from("profiles")
                .select("id, username, avatar, full_name, is_og")
                .in("id", userIds);
                
              if (profilesData && profilesData.length > 0) {
                // Create a map of profiles for easy lookup
                const profileMap = new Map();
                profilesData.forEach(profile => {
                  profileMap.set(profile.id, profile);
                });
                
                // Merge post data with profile data
                const postsWithProfiles = formattedPosts.map(post => {
                  const userProfile = profileMap.get(post.user_id);
                  return {
                    ...post,
                    profiles: userProfile || null
                  };
                });
                
                setPosts(postsWithProfiles);
              }
            } catch (profileError) {
              console.error("Error fetching profiles for text posts:", profileError);
            }
          }
          
          return;
        }
      } catch (textErr) {
        console.error('Error with text posts fallback:', textErr);
      }
      
      // If all else fails, set empty posts
      console.log("No posts found from any source");
      setPosts([]);
      
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
