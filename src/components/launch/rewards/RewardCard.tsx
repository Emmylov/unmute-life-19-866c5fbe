
import React from 'react';
import { motion } from 'framer-motion';
import { Gift, Clock, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RewardCardProps {
  id: string;
  name: string;
  description: string;
  icon: string;
  claimed: boolean;
  onClaim: (rewardId: string) => void;
  loading?: boolean;
}

const RewardCard = ({ id, name, description, icon, claimed, onClaim, loading }: RewardCardProps) => {
  const IconComponent = {
    gift: Gift,
    book: Clock,
    music: Clock,
    award: Award
  }[icon] || Gift;

  return (
    <motion.div
      className={`p-4 border rounded-lg ${
        claimed ? 'bg-primary/10 border-primary/20' : 'bg-white'
      }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex flex-col items-center text-center gap-2">
        <IconComponent className={`h-8 w-8 ${
          icon === 'gift' ? 'text-unmute-purple' :
          icon === 'book' ? 'text-unmute-coral' :
          icon === 'music' ? 'text-unmute-blue' :
          'text-unmute-lavender'
        } mb-2`} />
        
        <h4 className="font-medium text-sm">{name}</h4>
        <p className="text-xs text-muted-foreground">{description}</p>
        
        {claimed ? (
          <span className="text-xs text-primary mt-2 inline-flex items-center">
            Claimed ✓
          </span>
        ) : (
          <Button
            size="sm"
            variant="outline"
            className="mt-2"
            onClick={() => onClaim(id)}
            disabled={loading}
          >
            Claim
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default RewardCard;
