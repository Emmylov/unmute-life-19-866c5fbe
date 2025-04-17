import React from 'react';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Gift } from 'lucide-react';
import DailyReward from './DailyReward';
interface DailyRewardModalProps {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}
const DailyRewardModal = ({
  trigger,
  open,
  onOpenChange
}: DailyRewardModalProps) => {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const handleOpenChange = (value: boolean) => {
    setDialogOpen(value);
    if (onOpenChange) {
      onOpenChange(value);
    }
  };
  return <Dialog open={open !== undefined ? open : dialogOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogTitle className="sr-only">Daily Reward</DialogTitle>
        <DailyReward onClose={() => handleOpenChange(false)} />
      </DialogContent>
    </Dialog>;
};
export default DailyRewardModal;