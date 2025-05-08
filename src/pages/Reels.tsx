
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ReelView from '@/components/reels/ReelView';
import ReelsSkeleton from '@/components/reels/ReelsSkeleton';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useSwipeable } from 'react-swipeable';
import { ReelWithUser } from '@/types/reels';
import { useScreenSize } from '@/hooks/use-responsive';
import { createSafeProfile } from '@/hooks/feed/feed-utils';
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';
import { motion } from 'framer-motion';

interface ReelsProps {
  initialReelId?: string | null;
}

const Reels: React.FC<ReelsProps> = ({ initialReelId }) => {
  const [reels, setReels] = useState<ReelWithUser[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'vertical' | 'horizontal'>('vertical');
  const [retryCount, setRetryCount] = useState(0);
  const reelContainerRef = useRef<HTMLDivElement>(null);
  const horizontalScrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isMobile, isTablet, isDesktop } = useScreenSize();

  useEffect(() => {
    // Set view mode based on screen size
    if (isDesktop) {
      setViewMode('horizontal');
    } else {
      setViewMode('vertical');
    }
  }, [isDesktop]);

  useEffect(() => {
    fetchReels();
  }, [retryCount]);

  useEffect(() => {
    if (initialReelId && reels.length > 0) {
      const index = reels.findIndex(reel => reel.reel.id === initialReelId);
      if (index !== -1) {
        setCurrentIndex(index);
      }
    }
  }, [initialReelId, reels]);

  const fetchReels = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching reels...');
      
      // Check that the table and columns exist before querying
      const { data: reelsData, error: reelsError } = await supabase
        .from('reel_posts')
        .select(`
          id, user_id, created_at, video_url, thumbnail_url, caption, 
          tags, visibility, audio_type, audio_url
        `)
        .order('created_at', { ascending: false })
        .limit(10);

      if (reelsError) {
        console.error('Error fetching reels:', reelsError);
        throw reelsError;
      }

      if (!reelsData || reelsData.length === 0) {
        setReels([]);
        setHasMore(false);
        console.log('No reels found');
        setLoading(false);
        return;
      }

      // Fetch user profiles in a separate query
      const userIds = reelsData.map(reel => reel.user_id);
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username, avatar, full_name')
        .in('id', userIds);

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        // Continue anyway, we'll use placeholders for missing profiles
      }

      // Create a map of user_id to profile for quick lookup
      const profileMap = new Map();
      if (profilesData) {
        profilesData.forEach(profile => {
          profileMap.set(profile.id, profile);
        });
      }

      // Map profiles to reels with proper type safety and error handling
      const formattedReels: ReelWithUser[] = reelsData.map(item => {
        // Use the profile from map, or create a placeholder
        const profile = profileMap.get(item.user_id);
        const userProfile = profile 
          ? createSafeProfile(profile)
          : {
              id: item.user_id,
              username: 'Anonymous',
              avatar: '',
              full_name: 'Unknown User'
            };

        return {
          reel: {
            id: item.id || 'unknown-id',
            user_id: item.user_id || 'unknown-user',
            created_at: item.created_at || new Date().toISOString(),
            video_url: item.video_url || '',
            thumbnail_url: item.thumbnail_url || null,
            caption: item.caption || null,
            audio: null, // These fields may not exist in the database schema
            audio_type: item.audio_type || null,
            audio_url: item.audio_url || null,
            duration: null, // These fields may not exist in the database schema
            original_audio_volume: 1, // Default value
            overlay_audio_volume: 0, // Default value
            tags: item.tags || [],
            allow_comments: true,
            allow_duets: true,
            vibe_tag: null,
            mood_vibe: null,
          },
          user: userProfile
        };
      });

      setReels(formattedReels);
      setHasMore(formattedReels.length === 10);
      console.log('Fetched reels count:', formattedReels.length);
    } catch (err) {
      console.error('Error fetching reels:', err);
      setError('Failed to load reels. Please try again.');
      toast({
        title: 'Error',
        description: 'Failed to load reels. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadMoreReels = async () => {
    if (!hasMore || loading || reels.length === 0) return;
    
    try {
      const lastCreatedAt = reels[reels.length - 1].reel.created_at;
      
      const { data: reelsData, error: reelsError } = await supabase
        .from('reel_posts')
        .select(`
          id, user_id, created_at, video_url, thumbnail_url, caption, 
          tags, visibility, audio_type, audio_url
        `)
        .lt('created_at', lastCreatedAt)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (reelsError) throw reelsError;
      
      if (!reelsData || reelsData.length === 0) {
        setHasMore(false);
        return;
      }

      // Fetch user profiles
      const userIds = reelsData.map(reel => reel.user_id);
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, username, avatar, full_name')
        .in('id', userIds);

      // Create a map of user_id to profile
      const profileMap = new Map();
      if (profilesData) {
        profilesData.forEach(profile => {
          profileMap.set(profile.id, profile);
        });
      }

      // Map to properly typed ReelWithUser objects
      const formattedReels: ReelWithUser[] = reelsData.map(item => {
        const profile = profileMap.get(item.user_id);
        const userProfile = profile 
          ? createSafeProfile(profile)
          : {
              id: item.user_id,
              username: 'Anonymous',
              avatar: '',
              full_name: 'Unknown User'
            };

        return {
          reel: {
            id: item.id || 'unknown-id',
            user_id: item.user_id || 'unknown-user',
            created_at: item.created_at || new Date().toISOString(),
            video_url: item.video_url || '',
            thumbnail_url: item.thumbnail_url || null,
            caption: item.caption || null,
            audio: null,
            audio_type: item.audio_type || null,
            audio_url: item.audio_url || null,
            duration: null,
            original_audio_volume: 1,
            overlay_audio_volume: 0,
            tags: item.tags || [],
            allow_comments: true,
            allow_duets: true,
            vibe_tag: null,
            mood_vibe: null,
          },
          user: userProfile
        };
      });
      
      setReels(prevReels => [...prevReels, ...formattedReels]);
      setHasMore(formattedReels.length === 10);
    } catch (err) {
      console.error('Error loading more reels:', err);
      toast({
        title: 'Error',
        description: 'Failed to load more reels. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const goToNextReel = () => {
    if (currentIndex < reels.length - 1) {
      setCurrentIndex(prevIndex => prevIndex + 1);
      
      // If in horizontal mode, scroll to the next reel
      if (viewMode === 'horizontal' && horizontalScrollRef.current) {
        const scrollTo = (currentIndex + 1) * horizontalScrollRef.current.clientWidth;
        horizontalScrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
      }
    } else if (hasMore) {
      loadMoreReels();
    }
  };

  const goToPreviousReel = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prevIndex => prevIndex - 1);
      
      // If in horizontal mode, scroll to the previous reel
      if (viewMode === 'horizontal' && horizontalScrollRef.current) {
        const scrollTo = (currentIndex - 1) * horizontalScrollRef.current.clientWidth;
        horizontalScrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
      }
    }
  };

  const handleSwipe = (direction: string) => {
    if (direction === "up" || direction === "left") {
      goToNextReel();
    } else if (direction === "down" || direction === "right") {
      goToPreviousReel();
    }
  };

  // Enhanced keyboard navigation support for desktop
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'k' || e.key === 'ArrowLeft') {
        goToPreviousReel();
      } else if (e.key === 'ArrowDown' || e.key === 'j' || e.key === 'ArrowRight') {
        goToNextReel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentIndex, reels.length]);

  // Enhanced scroll snap for horizontal layout
  useEffect(() => {
    if (viewMode === 'horizontal' && horizontalScrollRef.current) {
      const handleScroll = () => {
        if (horizontalScrollRef.current) {
          const scrollPos = horizontalScrollRef.current.scrollLeft;
          const reelWidth = horizontalScrollRef.current.clientWidth;
          const newIndex = Math.round(scrollPos / reelWidth);
          
          if (newIndex !== currentIndex && newIndex >= 0 && newIndex < reels.length) {
            setCurrentIndex(newIndex);
          }
        }
      };
      
      const scrollContainer = horizontalScrollRef.current;
      scrollContainer.addEventListener('scrollend', handleScroll);
      
      return () => {
        scrollContainer.removeEventListener('scrollend', handleScroll);
      };
    }
  }, [viewMode, horizontalScrollRef.current, reels.length, currentIndex]);

  // Enhanced wheel event for vertical scrolling
  useEffect(() => {
    if (viewMode === 'vertical') {
      const handleWheel = (e: WheelEvent) => {
        e.preventDefault();
        // Debounce wheel events to prevent too many rapid changes
        if (e.deltaY > 50) {
          goToNextReel();
        } else if (e.deltaY < -50) {
          goToPreviousReel();
        }
      };

      const currentRef = reelContainerRef.current;
      if (currentRef) {
        currentRef.addEventListener('wheel', handleWheel, { passive: false });
      }
      
      return () => {
        if (currentRef) {
          currentRef.removeEventListener('wheel', handleWheel);
        }
      };
    }
  }, [viewMode, currentIndex, reels.length]);

  const handlers = useSwipeable({
    onSwipedUp: () => viewMode === 'vertical' && goToNextReel(),
    onSwipedDown: () => viewMode === 'vertical' && goToPreviousReel(),
    onSwipedLeft: () => viewMode === 'horizontal' && goToNextReel(),
    onSwipedRight: () => viewMode === 'horizontal' && goToPreviousReel(),
    trackMouse: false,
    trackTouch: true
  });

  const handleReelClick = (index: number) => {
    setCurrentIndex(index);
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  if (loading && reels.length === 0) {
    return <ReelsSkeleton />;
  }

  if (error && reels.length === 0) {
    return (
      <motion.div 
        className="flex flex-col items-center justify-center h-screen bg-black text-white p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="bg-black/60 backdrop-blur-md rounded-xl p-8 flex flex-col items-center max-w-md w-full">
          <svg className="h-16 w-16 text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
          <p className="mb-6 text-center text-gray-300">{error}</p>
          <Button 
            onClick={handleRetry}
            className="px-4 py-2 bg-primary text-white rounded-full flex items-center gap-2 hover:bg-primary/80"
          >
            <RefreshCcw className="h-4 w-4" />
            Try Again
          </Button>
        </div>
      </motion.div>
    );
  }

  if (reels.length === 0) {
    return (
      <motion.div 
        className="flex flex-col items-center justify-center h-screen bg-black text-white p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="bg-black/60 backdrop-blur-md rounded-xl p-8 flex flex-col items-center max-w-md w-full">
          <svg className="h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <h2 className="text-xl font-bold mb-2">No reels found</h2>
          <p className="mb-6 text-center text-gray-300">Be the first to create a reel!</p>
          <Button
            onClick={() => navigate('/create')}
            className="px-4 py-2 bg-primary text-white rounded-full hover:bg-primary/80"
          >
            Create a Reel
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div 
      className="h-screen w-full bg-black overflow-hidden reels-container" 
      {...(viewMode === 'vertical' ? handlers : {})} 
      ref={reelContainerRef}
    >
      {/* Navigation hint */}
      <div className="hidden md:block absolute top-6 left-1/2 transform -translate-x-1/2 bg-black/30 text-white/90 px-6 py-2.5 rounded-full z-10 backdrop-blur-md transition-opacity duration-300 hover:opacity-0">
        <p className="text-sm font-medium flex items-center gap-2">
          {viewMode === 'vertical' 
            ? <span>↑ Use arrow keys or scroll to navigate ↓</span>
            : <span>← Use arrow keys or scroll to navigate →</span>
          }
        </p>
      </div>

      {/* Toggle view mode button (only show on desktop) */}
      {isDesktop && (
        <button
          onClick={() => setViewMode(prev => prev === 'vertical' ? 'horizontal' : 'vertical')}
          className="absolute top-6 right-6 z-10 bg-black/30 text-white/90 p-2.5 rounded-full backdrop-blur-md hover:bg-black/50 transition-colors"
        >
          {viewMode === 'vertical' ? 'Switch to Grid View' : 'Switch to Full View'}
        </button>
      )}
      
      {/* Vertical scrolling view (traditional TikTok style) */}
      {viewMode === 'vertical' ? (
        <ReelView 
          reelWithUser={reels[currentIndex]} 
          onNext={goToNextReel}
          onPrevious={goToPreviousReel}
          onSwipe={handleSwipe}
          hasNext={currentIndex < reels.length - 1 || hasMore}
          hasPrevious={currentIndex > 0}
          currentIndex={currentIndex}
          totalReels={reels.length}
        />
      ) : (
        /* Horizontal scrolling view for desktop/tablet */
        <div 
          ref={horizontalScrollRef}
          className="flex w-full h-full overflow-x-auto snap-x snap-mandatory scrollbar-hide"
          {...handlers}
        >
          {reels.map((reel, index) => (
            <div 
              key={reel.reel.id}
              className={`min-w-full h-full flex-shrink-0 snap-center ${
                index === currentIndex ? 'opacity-100' : 'opacity-80'
              }`}
              onClick={() => handleReelClick(index)}
            >
              <div className="w-full h-full max-w-2xl mx-auto flex items-center justify-center p-4">
                <div className="w-full h-[calc(100vh-80px)] max-h-[calc(100vh-80px)] aspect-[9/16] relative rounded-2xl overflow-hidden shadow-2xl">
                  <ReelView 
                    reelWithUser={reel} 
                    onNext={goToNextReel}
                    onPrevious={goToPreviousReel}
                    onSwipe={handleSwipe}
                    hasNext={index < reels.length - 1 || hasMore}
                    hasPrevious={index > 0}
                    currentIndex={index}
                    totalReels={reels.length}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reels;
