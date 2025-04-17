
// This file contains code to check if the user_rewards table exists
// and SQL to create it if needed

import { supabase } from "@/integrations/supabase/client";

export const checkAndSetupUserRewards = async () => {
  try {
    // Check if user_rewards table exists
    const { data: tablesData } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'user_rewards');

    // If table doesn't exist, we'd handle it in the UI by showing
    // appropriate messaging rather than trying to create it from client-side
    const tableExists = tablesData && tablesData.length > 0;
    
    if (!tableExists) {
      console.warn('user_rewards table does not exist. Rewards functionality will be limited.');
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error checking user_rewards table:', error);
    return false;
  }
};

// Call this function when the app starts
export const setupUserRewardsSystem = () => {
  checkAndSetupUserRewards()
    .then(exists => {
      if (!exists) {
        console.warn('The rewards system requires the user_rewards table to be set up in Supabase.');
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
