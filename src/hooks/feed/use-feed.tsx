
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
  const refreshCountRef = useRef(0);

  const fetchFeed = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const currentUser = await getCurrentUser();
      
      if (!currentUser) {
        // If no user, get some general posts
        // Use posts table directly instead of posts_images which seems to have an issue with the profiles relation
        const { data, error } = await supabase
          .from('posts')
          .select('*, profiles:user_id(*)')
          .order('created_at', { ascending: false })
          .limit(limit);
          
        if (error) throw error;
        setPosts(data || []);
        return;
      }
      
      // Get feed posts based on who the user follows
      const feedPosts = await getFeedPosts(currentUser.id, limit);
      console.log("Feed posts fetched:", feedPosts);
      setPosts(feedPosts || []);
    } catch (err) {
      console.error('Error fetching feed:', err);
      
      // Fallback to simple posts query if there's an error
      try {
        console.log("Using fallback posts query");
        const { data: fallbackPosts } = await supabase
          .from('posts')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(limit);
          
        if (fallbackPosts && fallbackPosts.length > 0) {
          setPosts(fallbackPosts);
          return;
        }
      } catch (fallbackErr) {
        console.error("Fallback query failed too:", fallbackErr);
      }
      
      setError(err instanceof Error ? err : new Error('Failed to fetch feed'));
      toast.error('Failed to load feed. Please try refreshing the page.');
    } finally {
      setLoading(false);
    }
  }, [limit, type]);

  // Refresh function that can be called manually
  const refresh = useCallback(() => {
    console.log("Refreshing feed...");
    refreshCountRef.current += 1;
    fetchFeed();
  }, [fetchFeed]);

  // Initial fetch
  useEffect(() => {
    fetchFeed();
  }, [fetchFeed, refreshTrigger, refreshCountRef.current]);

  return { posts, loading, error, refresh };
};

export default useFeed;
