
import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const useReel = () => {
  const [reels, setReels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();
  
  const fetchReels = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('reels')
        .select(`
          *,
          profiles (
            id,
            username,
            avatar,
            full_name
          )
        `)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      
      if (data) {
        // Map the data to include optional properties with defaults
        const processedReels = data.map(reel => ({
          ...reel,
          audio: reel.audio || null,
          duration: reel.duration || 0,
          original_audio_volume: reel.original_audio_volume || 1.0,
          overlay_audio_volume: reel.overlay_audio_volume || 0.5,
        }));
        setReels(processedReels);
      }
      
      setLoading(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch reels';
      console.error('Error fetching reels:', errorMessage);
      setError(errorMessage);
      setLoading(false);
      toast.error('Could not load reels');
    }
  };
  
  const nextReel = () => {
    if (currentIndex < reels.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };
  
  const prevReel = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };
  
  const goToProfile = (username: string) => {
    if (!username) return;
    navigate(`/profile/${username}`);
  };
  
  useEffect(() => {
    fetchReels();
  }, []);
  
  return {
    reels,
    loading,
    error,
    currentIndex,
    currentReel: reels[currentIndex],
    nextReel,
    prevReel,
    goToProfile,
    fetchReels
  };
};

export default useReel;
