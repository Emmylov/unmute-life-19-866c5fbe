
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

// Define type for reel data
interface ReelData {
  id: string;
  user_id: string;
  created_at: string;
  video_url: string;
  thumbnail_url?: string;
  caption?: string;
  audio?: string;
  storage_path?: string;
  thumbnail_storage_path?: string;
  // Add these properties as optional since they might not exist in the database
  duration?: number;
  original_audio_volume?: number;
  overlay_audio_volume?: number;
  profiles?: {
    id: string;
    username?: string;
    avatar?: string;
    full_name?: string;
  };
}

export const useReel = (reelId?: string) => {
  const [reels, setReels] = useState<ReelData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reel, setReel] = useState<ReelData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
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
          // Set default values for properties that might not exist in the database
          duration: reel.duration !== undefined ? reel.duration : 0, 
          original_audio_volume: reel.original_audio_volume !== undefined ? reel.original_audio_volume : 1.0,
          overlay_audio_volume: reel.overlay_audio_volume !== undefined ? reel.overlay_audio_volume : 0.5,
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

  const fetchSingleReel = async (id: string) => {
    try {
      setIsLoading(true);
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
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      if (data) {
        // Add default values for potentially missing properties
        const processedReel = {
          ...data,
          audio: data.audio || null,
          // Ensure these properties have default values if they don't exist
          duration: data.duration !== undefined ? data.duration : 0,
          original_audio_volume: data.original_audio_volume !== undefined ? data.original_audio_volume : 1.0,
          overlay_audio_volume: data.overlay_audio_volume !== undefined ? data.overlay_audio_volume : 0.5,
        };
        setReel(processedReel);
      }
      
      setIsLoading(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch reel';
      console.error('Error fetching reel:', errorMessage);
      setError(errorMessage);
      setIsLoading(false);
      toast.error('Could not load reel');
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
  
  const refetch = () => {
    if (reelId) {
      fetchSingleReel(reelId);
    } else {
      fetchReels();
    }
  };
  
  useEffect(() => {
    // If reelId is provided, fetch just that one reel
    if (reelId) {
      fetchSingleReel(reelId);
    } else {
      // Otherwise fetch all reels
      fetchReels();
    }
  }, [reelId]);
  
  return {
    reels,
    loading,
    error,
    currentIndex,
    currentReel: reels[currentIndex],
    nextReel,
    prevReel,
    goToProfile,
    fetchReels,
    // Add these properties needed by ReelView
    reel,
    isLoading,
    refetch
  };
};

export default useReel;
