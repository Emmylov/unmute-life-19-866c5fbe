
import { useState, useEffect } from 'react';
import { fetchUserRewards, fetchAllRewards, claimReward } from '@/services/reward-service';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

/**
 * Custom hook for managing rewards
 */
export const useRewards = () => {
  const { user } = useAuth();
  const [userRewards, setUserRewards] = useState<any[]>([]);
  const [availableRewards, setAvailableRewards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Load user rewards and all available rewards
  useEffect(() => {
    const loadRewards = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        const [userRewardsData, allRewardsData] = await Promise.all([
          fetchUserRewards(user.id),
          fetchAllRewards()
        ]);
        
        setUserRewards(userRewardsData || []);
        setAvailableRewards(allRewardsData || []);
      } catch (error) {
        console.error('Error loading rewards data:', error);
        toast.error('Failed to load rewards data');
      } finally {
        setLoading(false);
      }
    };
    
    loadRewards();
  }, [user]);
  
  // Function to claim a reward
  const claimUserReward = async (rewardId: string) => {
    if (!user) {
      toast.error('You must be logged in to claim rewards');
      return false;
    }
    
    try {
      const result = await claimReward(user.id, rewardId);
      
      if (result) {
        // Refresh rewards
        const freshUserRewards = await fetchUserRewards(user.id);
        setUserRewards(freshUserRewards || []);
      }
      
      return result;
    } catch (error) {
      console.error('Error claiming reward:', error);
      return false;
    }
  };
  
  // Check if a reward has been claimed
  const hasClaimedReward = (rewardId: string) => {
    return userRewards.some(reward => reward.reward_id === rewardId);
  };
  
  return {
    userRewards,
    availableRewards,
    loading,
    claimReward: claimUserReward,
    hasClaimedReward
  };
};

export default useRewards;
