
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Crown } from 'lucide-react';

interface OGBadgeProps {
  className?: string;
}

const OGBadge = ({ className }: OGBadgeProps) => {
  return (
    <Badge 
      className={`bg-gradient-to-r from-yellow-400 to-yellow-600 text-white flex items-center gap-1.5 ${className}`}
    >
      <Crown className="h-3 w-3" />
      OG
    </Badge>
  );
};

export default OGBadge;
