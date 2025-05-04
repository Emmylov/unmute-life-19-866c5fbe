
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { createSafeProfile } from '@/utils/safe-data-utils';

export interface Reel {
  id: string;
  user_id: string;
  video_url: string;
  caption?: string | null;
  thumbnail_url?: string | null;
  created_at: string;
  tags?: string[] | null;
  visibility?: string;
  audio?: string | null;
  audio_type?: string | null;
  audio_url?: string | null;
  duration?: number | null;
  original_audio_volume?: number | null;
  overlay_audio_volume?: number | null;
  profiles?: {
    id: string;
    username: string | null;
    avatar: string | null;
    full_name: string | null;
  } | null;
}

export const useReel = (reelId: string) => {
  const [reel, setReel] = useState<Reel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchReel = async () => {
    if (!reelId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('reel_posts')
        .select(`
          *,
          profiles:user_id (
            id, username, avatar, full_name
          )
        `)
        .eq('id', reelId)
        .single();

      if (error) throw error;

      if (!data) {
        throw new Error('Reel not found');
      }
      
      // Create a properly typed safe reel object with default values
      const safeReel: Reel = {
        id: data.id,
        user_id: data.user_id,
        video_url: data.video_url,
        caption: data.caption || null,
        thumbnail_url: data.thumbnail_url || null,
        created_at: data.created_at,
        tags: data.tags || null,
        visibility: data.visibility || 'public',
        audio_type: data.audio_type || null,
        audio_url: data.audio_url || null,
        // Handle fields that might not exist in the database schema with safe defaults
        audio: data.audio_url || null, // Fallback to audio_url
        // Handle optional fields with null default values
        duration: data.duration || null,
        original_audio_volume: data.original_audio_volume || null,
        overlay_audio_volume: data.overlay_audio_volume || null,
        // Handle profiles data safely
        profiles: data.profiles ? createSafeProfile(data.profiles) : null
      };

      setReel(safeReel);
    } catch (err) {
      console.error('Error fetching reel:', err);
      setError(err instanceof Error ? err : new Error('Failed to load reel'));
      toast.error('Could not load the reel. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReel();
  }, [reelId]);

  const refetch = () => {
    fetchReel();
  };

  return { reel, isLoading, error, refetch };
};
