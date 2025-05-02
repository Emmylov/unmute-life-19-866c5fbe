
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useProfileCounters = () => {
  const [isUpdating, setIsUpdating] = useState(false);

  /**
   * Increment a counter field in a profile
   */
  const incrementProfileCounter = async (
    profileId: string,
    field: 'followers' | 'following',
  ): Promise<boolean> => {
    setIsUpdating(true);
    
    try {
      // First get the current count
      const { data: profile, error: fetchError } = await supabase
        .from('profiles')
        .select(field)
        .eq('id', profileId)
        .single();
      
      if (fetchError) {
        console.error(`Error fetching ${field} count:`, fetchError);
        return false;
      }
      
      // Now update with the incremented value
      const currentCount = profile[field] || 0;
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ [field]: currentCount + 1 })
        .eq('id', profileId);
      
      if (updateError) {
        console.error(`Error incrementing ${field} count:`, updateError);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error(`Error in incrementProfileCounter (${field}):`, error);
      return false;
    } finally {
      setIsUpdating(false);
    }
  };
  
  /**
   * Decrement a counter field in a profile
   */
  const decrementProfileCounter = async (
    profileId: string,
    field: 'followers' | 'following',
  ): Promise<boolean> => {
    setIsUpdating(true);
    
    try {
      // First get the current count
      const { data: profile, error: fetchError } = await supabase
        .from('profiles')
        .select(field)
        .eq('id', profileId)
        .single();
      
      if (fetchError) {
        console.error(`Error fetching ${field} count:`, fetchError);
        return false;
      }
      
      // Now update with the decremented value (min 0)
      const currentCount = profile[field] || 0;
      const newCount = Math.max(0, currentCount - 1);
      
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ [field]: newCount })
        .eq('id', profileId);
      
      if (updateError) {
        console.error(`Error decrementing ${field} count:`, updateError);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error(`Error in decrementProfileCounter (${field}):`, error);
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    incrementProfileCounter,
    decrementProfileCounter,
    isUpdating
  };
};
