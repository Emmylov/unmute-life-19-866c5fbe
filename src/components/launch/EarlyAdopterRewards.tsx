
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { Gift, Award, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import SuccessConfetti from "@/components/content-creator/SuccessConfetti";

interface Reward {
  id: string;
  name: string;
  description: string;
  icon: string;
  claimed: boolean;
}

const EarlyAdopterRewards = () => {
  const [isEligible, setIsEligible] = useState<boolean | null>(null);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const { user, profile, refreshProfile } = useAuth();
  const { toast } = useToast();
  
  const launchDate = new Date("2025-04-18T00:00:00");
  const launchPeriodDays = 7; // First 7 days are considered "launch period"

  useEffect(() => {
    if (user) {
      checkEarlyAdopterStatus();
      fetchRewards();
    }
  }, [user]);

  const checkEarlyAdopterStatus = async () => {
    if (!user || !profile) return;
    
    try {
      // Check if user joined within launch period
      const userJoinDate = new Date(profile.created_at);
      const launchEndDate = new Date(launchDate);
      launchEndDate.setDate(launchEndDate.getDate() + launchPeriodDays);
      
      const isEarlyAdopter = userJoinDate >= launchDate && userJoinDate <= launchEndDate;
      setIsEligible(isEarlyAdopter);
      
      // Auto-open dialog for eligible users who haven't seen it yet
      const { data: settings } = await supabase
        .from('user_settings')
        .select('settings')
        .eq('user_id', user.id)
        .single();
        
      const hasSeenRewards = settings?.settings?.launch?.seenRewards || false;
      
      if (isEarlyAdopter && !hasSeenRewards) {
        setOpen(true);
        // Mark as seen
        await supabase
          .from('user_settings')
          .upsert({
            user_id: user.id,
            settings: {
              ...(settings?.settings || {}),
              launch: { 
                ...(settings?.settings?.launch || {}),
                seenRewards: true 
              }
            }
          });
      }
    } catch (error) {
      console.error("Error checking early adopter status:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRewards = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Check if user has claimed rewards already
      const { data: userRewards } = await supabase
        .from('user_rewards')
        .select('*')
        .eq('user_id', user.id);
      
      // Define available rewards
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
      
      // Mark rewards as claimed if user has claimed them
      const processedRewards = availableRewards.map(reward => {
        const claimed = userRewards?.some(ur => ur.reward_id === reward.id) || false;
        return { ...reward, claimed };
      });
      
      setRewards(processedRewards);
    } catch (error) {
      console.error("Error fetching rewards:", error);
    } finally {
      setLoading(false);
    }
  };

  const claimReward = async (rewardId: string) => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Record the claim
      await supabase
        .from('user_rewards')
        .insert({
          user_id: user.id,
          reward_id: rewardId,
          claimed_at: new Date().toISOString()
        });
      
      // Update local state
      setRewards(prev => 
        prev.map(reward => 
          reward.id === rewardId 
            ? { ...reward, claimed: true } 
            : reward
        )
      );
      
      // Show success animation
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
      
      // Show toast
      toast({
        title: "Reward claimed!",
        description: "Check your profile to access your new reward.",
      });
      
      // Refresh profile to get updated rewards
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
  };

  const claimAllRewards = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Get unclaimed rewards
      const unclaimedRewards = rewards.filter(reward => !reward.claimed);
      
      if (unclaimedRewards.length === 0) {
        toast({
          title: "No rewards to claim",
          description: "You've already claimed all available rewards.",
        });
        return;
      }
      
      // Record all claims
      const claims = unclaimedRewards.map(reward => ({
        user_id: user.id,
        reward_id: reward.id,
        claimed_at: new Date().toISOString()
      }));
      
      await supabase.from('user_rewards').insert(claims);
      
      // Update local state
      setRewards(prev => 
        prev.map(reward => ({ ...reward, claimed: true }))
      );
      
      // Show success animation
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
      
      // Show toast
      toast({
        title: "All rewards claimed!",
        description: "Thank you for being an early adopter!",
      });
      
      // Refresh profile to get updated rewards
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
      
      <Dialog open={open} onOpenChange={setOpen}>
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
            
            <div className="grid grid-cols-2 gap-4 my-6">
              {rewards.map((reward) => (
                <motion.div
                  key={reward.id}
                  className={`p-4 border rounded-lg ${
                    reward.claimed ? 'bg-primary/10 border-primary/20' : 'bg-white'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex flex-col items-center text-center gap-2">
                    {reward.icon === 'gift' && <Gift className="h-8 w-8 text-unmute-purple mb-2" />}
                    {reward.icon === 'book' && <Clock className="h-8 w-8 text-unmute-coral mb-2" />}
                    {reward.icon === 'music' && <Clock className="h-8 w-8 text-unmute-blue mb-2" />}
                    {reward.icon === 'award' && <Award className="h-8 w-8 text-unmute-lavender mb-2" />}
                    
                    <h4 className="font-medium text-sm">{reward.name}</h4>
                    <p className="text-xs text-muted-foreground">{reward.description}</p>
                    
                    {reward.claimed ? (
                      <span className="text-xs text-primary mt-2 inline-flex items-center">
                        Claimed ✓
                      </span>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        className="mt-2"
                        onClick={() => claimReward(reward.id)}
                        disabled={loading}
                      >
                        Claim
                      </Button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
            
            <Button
              onClick={claimAllRewards}
              className="unmute-primary-button w-full"
              disabled={loading || rewards.every(r => r.claimed)}
            >
              Claim All Rewards
            </Button>
            
            <p className="text-xs text-muted-foreground mt-4">
              These rewards are exclusive to users who joined during our launch period.
            </p>
          </div>
        </DialogContent>
      </Dialog>
      
      {showConfetti && <SuccessConfetti />}
    </>
  );
};

export default EarlyAdopterRewards;
