
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Sparkles } from 'lucide-react';

interface EarlyAccessBadgeProps {
  className?: string;
}

const EarlyAccessBadge = ({ className }: EarlyAccessBadgeProps) => {
  return (
    <Badge 
      className={`bg-gradient-to-r from-[#9b87f5] to-[#D946EF] text-white flex items-center gap-1.5 ${className}`}
    >
      <Sparkles className="h-3 w-3" />
      Early Access
    </Badge>
  );
};

export default EarlyAccessBadge;
