import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format, differenceInHours } from 'date-fns';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Gift, Star, Calendar, Clock, Check } from 'lucide-react';
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import SuccessConfetti from "@/components/content-creator/SuccessConfetti";
import DailyRewardSound from './DailyRewardSound';

interface DailyRewardProps {
  onClose?: () => void;
}

interface UserSettings {
  settings: {
    rewards?: {
      lastClaimed?: string;
      streak?: number;
      totalClaimed?: number;
    }
  }
}

const DailyReward = ({ onClose }: DailyRewardProps) => {
  const [isClaimable, setIsClaimable] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<string | null>(null);
  const [streak, setStreak] = useState(0);
  const [playSound, setPlaySound] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      checkRewardStatus();
    }
  }, [user]);

  const checkRewardStatus = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data: userSettings } = await supabase
        .from('user_settings')
        .select('settings')
        .eq('user_id', user.id)
        .single();

      const now = new Date();
      const settings = userSettings?.settings as UserSettings['settings'] || {};
      
      const lastClaimed = settings?.rewards?.lastClaimed 
        ? new Date(settings.rewards.lastClaimed)
        : null;
      const currentStreak = settings?.rewards?.streak || 0;
      
      setStreak(currentStreak);

      if (!lastClaimed || differenceInHours(now, lastClaimed) >= 20) {
        setIsClaimable(true);
      } else {
        const nextReward = new Date(lastClaimed);
        nextReward.setHours(nextReward.getHours() + 24);
        const hoursRemaining = Math.max(0, differenceInHours(nextReward, now));
        const minutesRemaining = Math.max(0, Math.floor((differenceInHours(nextReward, now) - hoursRemaining) * 60));
        
        setTimeRemaining(`${hoursRemaining}h ${minutesRemaining}m`);
        setIsClaimable(false);
      }
    } catch (error) {
      console.error("Error checking reward status:", error);
    } finally {
      setLoading(false);
    }
  };

  const claimReward = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const now = new Date();
      
      const { data: currentSettings } = await supabase
        .from('user_settings')
        .select('settings, id')
        .eq('user_id', user.id)
        .maybeSingle();
        
      const currentSettingsData = currentSettings?.settings as UserSettings['settings'] || {};
      const rewardsData = currentSettingsData?.rewards || {};
      
      const updatedSettings = {
        ...currentSettingsData,
        rewards: {
          ...rewardsData,
          lastClaimed: now.toISOString(),
          streak: (rewardsData?.streak || 0) + 1,
          totalClaimed: (rewardsData?.totalClaimed || 0) + 1
        }
      };
      
      if (currentSettings?.id) {
        await supabase
          .from('user_settings')
          .update({ settings: updatedSettings })
          .eq('id', currentSettings.id);
      } else {
        await supabase
          .from('user_settings')
          .insert({ user_id: user.id, settings: updatedSettings });
      }
      
      setStreak(updatedSettings.rewards.streak);
      setIsClaimable(false);
      setShowConfetti(true);
      
      let rewardMessage = "You received a daily reward!";
      let rewardPoints = 10;
      
      if (updatedSettings.rewards.streak % 7 === 0) {
        rewardMessage = "🎉 Weekly streak bonus! +50 points!";
        rewardPoints = 50;
      } else if (updatedSettings.rewards.streak % 30 === 0) {
        rewardMessage = "🏆 Monthly streak achieved! +200 points!";
        rewardPoints = 200;
      } else if (updatedSettings.rewards.streak === 100) {
        rewardMessage = "🌟 100 DAY STREAK! Amazing dedication! +500 points!";
        rewardPoints = 500;
      }
      
      toast({
        title: rewardMessage,
        description: `You now have a ${updatedSettings.rewards.streak} day streak!`,
        duration: 5000,
      });
      
      setTimeout(() => {
        setShowConfetti(false);
        if (onClose) onClose();
      }, 3000);
      
      const nextReward = new Date();
      nextReward.setHours(nextReward.getHours() + 24);
      const hoursRemaining = Math.max(0, differenceInHours(nextReward, now));
      const minutesRemaining = Math.max(0, Math.floor((differenceInHours(nextReward, now) - hoursRemaining) * 60));
      setTimeRemaining(`${hoursRemaining}h ${minutesRemaining}m`);
      
      setPlaySound(true);
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
  };

  return (
    <motion.div 
      className="bg-white rounded-xl shadow-lg p-6 max-w-md mx-auto"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <DailyRewardSound 
        play={playSound} 
        onEnd={() => setPlaySound(false)} 
      />
      
      <div className="text-center mb-6">
        <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Gift className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold">Daily Rewards</h2>
        <p className="text-gray-600 mt-1">Come back every day to build your streak!</p>
      </div>

      <div className="flex items-center justify-center gap-2 mb-6">
        <Calendar className="w-5 h-5 text-gray-500" />
        <span>Today: {format(new Date(), 'MMMM d, yyyy')}</span>
      </div>

      <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg mb-6">
        <div className="flex items-center">
          <Star className="w-5 h-5 text-yellow-500 mr-2" />
          <span className="font-medium">Current Streak</span>
        </div>
        <span className="text-xl font-bold">{streak} days</span>
      </div>

      {loading ? (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2">Checking reward status...</p>
        </div>
      ) : isClaimable ? (
        <Button 
          onClick={claimReward} 
          className="w-full py-6 text-lg bg-primary hover:bg-primary/90"
          disabled={loading}
        >
          <Gift className="w-5 h-5 mr-2" />
          Claim Daily Reward
        </Button>
      ) : (
        <div className="text-center py-4 bg-gray-50 rounded-lg">
          <div className="flex justify-center items-center mb-2">
            <Clock className="w-5 h-5 text-gray-500 mr-2" />
            <p className="text-gray-700">Next reward available in:</p>
          </div>
          <p className="text-xl font-bold">{timeRemaining}</p>
          <div className="mt-4 flex items-center justify-center text-green-600">
            <Check className="w-5 h-5 mr-1" />
            <span>You've claimed today's reward!</span>
          </div>
        </div>
      )}

      {showConfetti && <SuccessConfetti />}
      
      <div className="mt-6 text-center text-sm text-gray-500">
        <p>💡 Tip: Log in every day to maintain your streak and unlock special rewards!</p>
      </div>
      
      {onClose && (
        <Button 
          variant="ghost" 
          className="mt-4 w-full"
          onClick={onClose}
        >
          Close
        </Button>
      )}
    </motion.div>
  );
};

export default DailyReward;
