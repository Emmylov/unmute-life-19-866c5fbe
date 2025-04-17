
-- Create table for user rewards
CREATE TABLE IF NOT EXISTS public.user_rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reward_id TEXT NOT NULL,
  claimed_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE (user_id, reward_id)
);

-- Enable RLS on the user_rewards table
ALTER TABLE public.user_rewards ENABLE ROW LEVEL SECURITY;

-- Create policy that allows users to view their own rewards
CREATE POLICY "Users can view their own rewards" ON public.user_rewards
  FOR SELECT USING (auth.uid() = user_id);

-- Create policy that allows users to insert their own rewards
CREATE POLICY "Users can claim their own rewards" ON public.user_rewards
  FOR INSERT WITH CHECK (auth.uid() = user_id);
