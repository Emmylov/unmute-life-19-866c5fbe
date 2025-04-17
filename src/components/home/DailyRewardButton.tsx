
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Gift, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { differenceInHours } from 'date-fns';

interface DailyRewardButtonProps {
  onClick: () => void;
}

const DailyRewardButton = ({ onClick }: DailyRewardButtonProps) => {
  const [isClaimable, setIsClaimable] = useState(false);
  const [streak, setStreak] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      checkRewardStatus();
    }
  }, [user]);

  const checkRewardStatus = async () => {
    if (!user) return;

    try {
      // Get user settings to check last reward claim
      const { data: userSettings } = await supabase
        .from('user_settings')
        .select('settings')
        .eq('user_id', user.id)
        .single();

      const now = new Date();
      const lastClaimed = userSettings?.settings?.rewards?.lastClaimed 
        ? new Date(userSettings.settings.rewards.lastClaimed)
        : null;
      const currentStreak = userSettings?.settings?.rewards?.streak || 0;
      
      setStreak(currentStreak);

      // Check if a day has passed since last claim
      if (!lastClaimed || differenceInHours(now, lastClaimed) >= 20) {
        setIsClaimable(true);
      } else {
        setIsClaimable(false);
      }
    } catch (error) {
      console.error("Error checking reward status:", error);
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Button
        onClick={onClick}
        className={`relative flex items-center gap-2 font-medium ${
          isClaimable ? "bg-primary hover:bg-primary/90" : "bg-gray-100 hover:bg-gray-200 text-gray-700"
        }`}
        size="sm"
      >
        {isClaimable ? (
          <>
            <motion.div
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"
            />
            <Gift className="h-4 w-4" />
            Claim Reward
          </>
        ) : (
          <>
            <Gift className="h-4 w-4" />
            Daily Reward
          </>
        )}
        {streak >= 3 && (
          <div className="flex items-center text-yellow-500 ml-1">
            <Star className="h-3 w-3" />
            <span className="text-xs ml-0.5">{streak}</span>
          </div>
        )}
      </Button>
    </motion.div>
  );
};

export default DailyRewardButton;
