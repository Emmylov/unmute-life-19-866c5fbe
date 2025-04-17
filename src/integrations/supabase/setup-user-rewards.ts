
// This file contains code to check if the user_rewards table exists
// and SQL to create it if needed

import { supabase } from "@/integrations/supabase/client";

export const checkAndSetupUserRewards = async () => {
  try {
    // Instead of checking information_schema, let's try to fetch data from the rewards table
    // If it doesn't exist, it will fail gracefully
    const { error: rewardsError } = await supabase
      .from('rewards')
      .select('id')
      .limit(1);
    
    const { error: userRewardsError } = await supabase
      .from('user_rewards')
      .select('id')
      .limit(1);
    
    // Check if any of the tables don't exist by looking at the error code
    const tablesMissing = 
      (rewardsError && rewardsError.code === "42P01") || 
      (userRewardsError && userRewardsError.code === "42P01");
    
    if (tablesMissing) {
      console.warn('Rewards system tables do not exist. Rewards functionality will be limited.');
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error checking rewards tables:', error);
    return false;
  }
};

// Call this function when the app starts
export const setupUserRewardsSystem = () => {
  checkAndSetupUserRewards()
    .then(exists => {
      if (!exists) {
        console.warn('The rewards system requires the rewards and user_rewards tables to be set up in Supabase.');
      } else {
        console.log('Rewards system is ready.');
      }
    })
    .catch(err => {
      console.error('Error setting up rewards system:', err);
    });
};

// The actual SQL to create the table would be run by the admin in Supabase SQL Editor:
/*
CREATE TABLE IF NOT EXISTS public.user_rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  reward_id UUID NOT NULL,
  claimed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  CONSTRAINT fk_user
    FOREIGN KEY(user_id)
    REFERENCES auth.users(id)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  points_required INTEGER DEFAULT 0,
  image_url TEXT,
  reward_type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.user_rewards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own rewards" 
  ON public.user_rewards 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can claim rewards" 
  ON public.user_rewards 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);
*/
