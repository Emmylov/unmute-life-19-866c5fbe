
import { useState, useEffect, useCallback } from 'react';
import { searchUsers, searchContent, searchCommunities } from '@/services/search-service';
import { trackEvent } from '@/services/analytics-service';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface SearchOptions {
  includeUsers?: boolean;
  includeContent?: boolean;
  includeCommunities?: boolean;
  contentType?: 'images' | 'text' | 'reels' | 'all';
  limit?: number;
}

export const useSearch = (options: SearchOptions = {}) => {
  const { 
    includeUsers = true, 
    includeContent = true, 
    includeCommunities = true,
    contentType = 'all',
    limit = 20
  } = options;
  
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<{
    users: any[];
    content: any[];
    communities: any[];
  }>({
    users: [],
    content: [],
    communities: []
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  
  const search = useCallback(async (searchQuery: string) => {
    if (!searchQuery || searchQuery.length < 2) {
      setResults({ users: [], content: [], communities: [] });
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const promises = [];
      
      // Search for users if included
      if (includeUsers) {
        promises.push(searchUsers(searchQuery, limit));
      } else {
        promises.push(Promise.resolve([]));
      }
      
      // Search for content if included
      if (includeContent) {
        promises.push(searchContent(searchQuery, { contentType, limit }));
      } else {
        promises.push(Promise.resolve({ items: [], total: 0 }));
      }
      
      // Search for communities if included
      if (includeCommunities) {
        promises.push(searchCommunities(searchQuery, limit));
      } else {
        promises.push(Promise.resolve([]));
      }
      
      const [usersResults, contentResults, communitiesResults] = await Promise.all(promises);
      
      setResults({
        users: usersResults || [],
        content: contentResults.items || [],
        communities: communitiesResults || []
      });
      
      // Track search event
      if (user) {
        trackEvent(user.id, {
          event_type: 'search',
          data: { 
            query: searchQuery,
            results_count: {
              users: usersResults?.length || 0,
              content: contentResults.items?.length || 0,
              communities: communitiesResults?.length || 0
            }
          }
        });
      }
    } catch (err: any) {
      console.error('Error performing search:', err);
      setError(err.message || 'An error occurred during search');
      toast.error('Search failed', {
        description: 'We encountered an issue with your search. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  }, [includeUsers, includeContent, includeCommunities, contentType, limit, user]);
  
  // Handle search query changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query) {
        search(query);
      } else {
        setResults({ users: [], content: [], communities: [] });
      }
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [query, search]);
  
  return {
    query,
    setQuery,
    results,
    loading,
    error,
    search
  };
};
