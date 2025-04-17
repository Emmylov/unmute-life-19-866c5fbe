
import React from 'react';
import RewardCard from './RewardCard';
import { Button } from '@/components/ui/button';

export interface Reward {
  id: string;
  name: string;
  description: string;
  icon: string;
  claimed: boolean;
}

interface RewardsListProps {
  rewards: Reward[];
  onClaimReward: (rewardId: string) => Promise<void>;
  onClaimAll: () => Promise<void>;
  loading: boolean;
}

const RewardsList = ({ rewards, onClaimReward, onClaimAll, loading }: RewardsListProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        {rewards.map((reward) => (
          <RewardCard
            key={reward.id}
            {...reward}
            onClaim={onClaimReward}
            loading={loading}
          />
        ))}
      </div>
      
      <Button
        onClick={onClaimAll}
        className="unmute-primary-button w-full"
        disabled={loading || rewards.every(r => r.claimed)}
      >
        Claim All Rewards
      </Button>
      
      <p className="text-xs text-muted-foreground text-center">
        These rewards are exclusive to users who joined during our launch period.
      </p>
    </div>
  );
};

export default RewardsList;
