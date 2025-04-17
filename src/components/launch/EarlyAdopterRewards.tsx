
import React, { useState } from "react";
import { Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import SuccessConfetti from "@/components/content-creator/SuccessConfetti";
import { Gift } from "lucide-react";
import RewardsList from "./rewards/RewardsList";
import { useRewards } from "./rewards/useRewards";

const EarlyAdopterRewards = () => {
  const [open, setOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const { 
    isEligible,
    rewards,
    loading,
    markRewardAsSeen,
    claimReward,
    claimAllRewards 
  } = useRewards();

  const handleClaimReward = async (rewardId: string) => {
    await claimReward(rewardId);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const handleClaimAll = async () => {
    await claimAllRewards();
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen) {
      markRewardAsSeen();
    }
  };

  if (loading) return null;
  if (!isEligible && isEligible !== null) return null;

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="unmute-primary-button flex items-center gap-2"
      >
        <Gift className="w-4 h-4" />
        <span>Launch Rewards</span>
      </Button>
      
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl">OG Starter Pack</DialogTitle>
          </DialogHeader>
          
          <div className="py-4 text-center">
            <div className="flex justify-center mb-4">
              <Award className="h-12 w-12 text-unmute-purple" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              Congratulations, Early Adopter!
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              As one of our first users, you've unlocked the exclusive OG Starter Pack. Claim your rewards below!
            </p>
            
            <RewardsList
              rewards={rewards}
              onClaimReward={handleClaimReward}
              onClaimAll={handleClaimAll}
              loading={loading}
            />
          </div>
        </DialogContent>
      </Dialog>
      
      {showConfetti && <SuccessConfetti />}
    </>
  );
};

export default EarlyAdopterRewards;
