
import { Button } from "@/components/ui/button";
import { Gift } from "lucide-react";
import { useState, useEffect } from "react";

interface DailyRewardButtonProps {
  onClick: () => void;
}

const DailyRewardButton = ({ onClick }: DailyRewardButtonProps) => {
  const [hasUnclaimedReward, setHasUnclaimedReward] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  // Check if user has unclaimed rewards
  useEffect(() => {
    // This would usually come from an API call
    const checkForUnclaimedRewards = () => {
      // Simulate API call result
      setHasUnclaimedReward(true);
    };
    
    checkForUnclaimedRewards();
    
    // Animate button every 30 seconds to draw attention
    const animationInterval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setIsAnimating(false);
      }, 1500);
    }, 30000);
    
    return () => clearInterval(animationInterval);
  }, []);

  return (
    <Button
      variant="outline"
      size="sm"
      className={`flex items-center gap-2 border-2 border-amber-400 bg-amber-50 text-amber-700 hover:bg-amber-100 hover:text-amber-800 ${
        isAnimating ? 'animate-bounce' : ''
      } ${hasUnclaimedReward ? 'ring-2 ring-amber-200' : ''}`}
      onClick={onClick}
    >
      <Gift className="h-4 w-4 text-amber-500" />
      <span>Daily Gift</span>
      {hasUnclaimedReward && (
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
        </span>
      )}
    </Button>
  );
};

export default DailyRewardButton;
