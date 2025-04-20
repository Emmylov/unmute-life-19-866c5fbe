
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
        // If no user, get general posts using a simpler query
        const { data: generalPosts, error: generalError } = await supabase
          .from('posts')
          .select(`
            *,
            user:user_id (
              id,
              email
            )
          `)
          .order('created_at', { ascending: false })
          .limit(limit);
          
        if (generalError) throw generalError;
        setPosts(generalPosts || []);
        return;
      }
      
      try {
        // First attempt with full relations
        const feedPosts = await getFeedPosts(currentUser.id, limit);
        setPosts(feedPosts || []);
      } catch (err) {
        console.error("Error with primary feed query:", err);
        
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
      }
    } catch (err) {
      console.error('Error fetching feed:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch feed'));
      toast.error('Failed to load feed', {
        description: 'Please try refreshing the page.'
      });
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
