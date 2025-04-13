
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ReelView from '@/components/reels/ReelView';
import ReelsSkeleton from '@/components/reels/ReelsSkeleton';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useSwipeable } from 'react-swipeable';
import { ReelWithUser } from '@/types/reels';

interface ReelsProps {
  initialReelId?: string | null;
}

const Reels: React.FC<ReelsProps> = ({ initialReelId }) => {
  const [reels, setReels] = useState<ReelWithUser[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const reelContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchReels();
  }, []);

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
      const { data, error } = await supabase
        .from('reels')
        .select('*, profiles:user_id(*)')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        throw error;
      }

      if (data) {
        const formattedReels: ReelWithUser[] = data.map(item => ({
          reel: {
            id: item.id,
            user_id: item.user_id,
            created_at: item.created_at,
            video_url: item.video_url,
            thumbnail_url: item.thumbnail_url || null,
            caption: item.caption || null,
            audio: item.audio || null,
            audio_type: null,
            audio_url: null,
            duration: null,
            original_audio_volume: 1,
            overlay_audio_volume: 0,
            tags: [],
            allow_comments: true,
            allow_duets: true,
            vibe_tag: null,
            mood_vibe: null,
          },
          user: {
            id: item.profiles?.id || '',
            username: item.profiles?.username || '',
            avatar: item.profiles?.avatar || '',
            full_name: item.profiles?.full_name || '',
          },
        }));

        setReels(formattedReels);
        setHasMore(data.length === 10);
      } else {
        setReels([]);
        setHasMore(false);
      }
    } catch (err) {
      console.error('Error fetching reels:', err);
      setError('Failed to load reels');
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
      
      const { data, error } = await supabase
        .from('reels')
        .select('*, profiles:user_id(*)')
        .lt('created_at', lastCreatedAt)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        const formattedReels: ReelWithUser[] = data.map(item => ({
          reel: {
            id: item.id,
            user_id: item.user_id,
            created_at: item.created_at,
            video_url: item.video_url,
            thumbnail_url: item.thumbnail_url || null,
            caption: item.caption || null,
            audio: item.audio || null,
            audio_type: null,
            audio_url: null,
            duration: null,
            original_audio_volume: 1,
            overlay_audio_volume: 0,
            tags: [],
            allow_comments: true,
            allow_duets: true,
            vibe_tag: null,
            mood_vibe: null,
          },
          user: {
            id: item.profiles?.id || '',
            username: item.profiles?.username || '',
            avatar: item.profiles?.avatar || '',
            full_name: item.profiles?.full_name || '',
          },
        }));
        
        setReels(prevReels => [...prevReels, ...formattedReels]);
        setHasMore(data.length === 10);
      } else {
        setHasMore(false);
      }
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
    } else if (hasMore) {
      loadMoreReels();
    }
  };

  const goToPreviousReel = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prevIndex => prevIndex - 1);
    }
  };

  const handleSwipe = (direction: string) => {
    if (direction === "up") {
      goToNextReel();
    } else if (direction === "down") {
      goToPreviousReel();
    }
  };

  const handlers = useSwipeable({
    onSwipedUp: () => goToNextReel(),
    onSwipedDown: () => goToPreviousReel(),
    preventDefaultTouchmoveEvent: true,
    trackMouse: false
  });

  if (loading && reels.length === 0) {
    return <ReelsSkeleton />;
  }

  if (error && reels.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-black text-white p-4">
        <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
        <p className="mb-4 text-center">{error}</p>
        <button 
          onClick={() => fetchReels()}
          className="px-4 py-2 bg-primary text-white rounded-full"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (reels.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-black text-white p-4">
        <h2 className="text-xl font-bold mb-2">No reels found</h2>
        <p className="mb-4 text-center">Be the first to create a reel!</p>
        <button
          onClick={() => navigate('/create')}
          className="px-4 py-2 bg-primary text-white rounded-full"
        >
          Create a Reel
        </button>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-black" {...handlers} ref={reelContainerRef}>
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
    </div>
  );
};

export default Reels;
