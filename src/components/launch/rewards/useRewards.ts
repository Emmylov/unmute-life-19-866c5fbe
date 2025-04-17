
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Reward } from './RewardsList';
import { 
  checkEarlyAdopterStatus, 
  claimReward as claimRewardService,
  getUserRewards 
} from '@/services/reward-service';

export const useRewards = () => {
  const [isEligible, setIsEligible] = useState<boolean | null>(null);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, profile, refreshProfile } = useAuth();
  const { toast } = useToast();

  const launchDate = new Date("2025-04-18T00:00:00");
  const launchPeriodDays = 7;

  const checkEligibility = async () => {
    if (!user || !profile) return;
    
    try {
      const userJoinDate = new Date(profile.created_at);
      const launchEndDate = new Date(launchDate);
      launchEndDate.setDate(launchEndDate.getDate() + launchPeriodDays);
      
      const isEarlyAdopter = userJoinDate >= launchDate && userJoinDate <= launchEndDate;
      setIsEligible(isEarlyAdopter);
    } catch (error) {
      console.error("Error checking eligibility:", error);
      setIsEligible(false);
    }
  };

  const fetchRewards = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      const availableRewards: Reward[] = [
        {
          id: "wallpaper",
          name: "Exclusive Wallpapers",
          description: "Custom phone & desktop designs",
          icon: "gift",
          claimed: false
        },
        {
          id: "guidebook",
          name: "Digital Guidebook",
          description: "Wellness tips & platform secrets",
          icon: "book",
          claimed: false
        },
        {
          id: "playlist",
          name: "Focus Playlist",
          description: "Curated tracks for mindfulness",
          icon: "music",
          claimed: false
        },
        {
          id: "badge",
          name: "OG Badge",
          description: "Lifetime profile verification",
          icon: "award",
          claimed: false
        }
      ];
      
      const userRewards = await getUserRewards(user.id);
      const claimedRewardIds = userRewards.map(r => r.reward_id);
      
      setRewards(
        availableRewards.map(reward => ({
          ...reward,
          claimed: claimedRewardIds.includes(reward.id)
        }))
      );
    } catch (error) {
      console.error("Error fetching rewards:", error);
      toast({
        title: "Error loading rewards",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const markRewardAsSeen = async () => {
    if (!user) return;
    
    try {
      const { data: settings } = await supabase
        .from('user_settings')
        .select('settings')
        .eq('user_id', user.id)
        .single();
      
      const currentSettings = settings?.settings || {};
      const typedSettings = currentSettings as Record<string, any>;
      
      await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          settings: {
            ...typedSettings,
            launch: { 
              ...(typedSettings.launch || {}),
              seenRewards: true 
            }
          }
        });
    } catch (error) {
      console.error("Error marking reward as seen:", error);
    }
  };

  useEffect(() => {
    if (user) {
      checkEligibility();
      fetchRewards();
    }
  }, [user]);

  return {
    isEligible,
    rewards,
    loading,
    markRewardAsSeen,
    claimReward: async (rewardId: string) => {
      if (!user) return;
      
      try {
        setLoading(true);
        const success = await claimRewardService(user.id, rewardId);
        
        if (!success) {
          throw new Error("Failed to claim reward");
        }
        
        setRewards(prev => 
          prev.map(reward => 
            reward.id === rewardId 
              ? { ...reward, claimed: true } 
              : reward
          )
        );
        
        toast({
          title: "Reward claimed!",
          description: "Check your profile to access your new reward.",
        });
        
        await refreshProfile();
        
      } catch (error) {
        console.error("Error claiming reward:", error);
        toast({
          title: "Failed to claim reward",
          description: "Please try again later",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    },
    claimAllRewards: async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        const unclaimedRewards = rewards.filter(reward => !reward.claimed);
        
        if (unclaimedRewards.length === 0) {
          toast({
            title: "No rewards to claim",
            description: "You've already claimed all available rewards.",
          });
          return;
        }
        
        const allClaimed = await Promise.all(
          unclaimedRewards.map(reward => claimRewardService(user.id, reward.id))
        );
        
        if (allClaimed.some(success => !success)) {
          throw new Error("Some rewards failed to claim");
        }
        
        setRewards(prev => 
          prev.map(reward => ({ ...reward, claimed: true }))
        );
        
        toast({
          title: "All rewards claimed!",
          description: "Thank you for being an early adopter!",
        });
        
        await refreshProfile();
        
      } catch (error) {
        console.error("Error claiming rewards:", error);
        toast({
          title: "Failed to claim rewards",
          description: "Please try again later",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
  };
};
