
import React from "react";
import { MoreHorizontal, Flag, VolumeX, Download, Send, Copy, Ban } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface ReelMoreActionsMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onShare: () => void;
  shareData: { title: string; text: string; url: string };
  reelId: string;
  onReport?: () => void;
  onMuteUser?: () => void;
  onDownload?: () => void;
  onCopyLink?: () => void;
  onNotInterested?: () => void;
}

const ReelMoreActionsMenu: React.FC<ReelMoreActionsMenuProps> = ({
  isOpen,
  onClose,
  onShare,
  shareData,
  reelId,
  onReport,
  onMuteUser,
  onDownload,
  onCopyLink,
  onNotInterested
}) => {
  // Default handlers that show toast messages
  const handleReport = () => {
    if (onReport) {
      onReport();
    } else {
      toast.info("Content reported. Thank you for helping keep our community safe.");
      onClose();
    }
  };

  const handleMuteUser = () => {
    if (onMuteUser) {
      onMuteUser();
    } else {
      toast.success("You won't see posts from this user anymore.");
      onClose();
    }
  };

  const handleDownload = () => {
    if (onDownload) {
      onDownload();
    } else {
      toast.info("Download started");
      onClose();
    }
  };

  const handleCopyLink = () => {
    if (onCopyLink) {
      onCopyLink();
    } else {
      navigator.clipboard.writeText(shareData.url || window.location.href);
      toast.success("Link copied to clipboard!");
      onClose();
    }
  };

  const handleSendTo = () => {
    onShare();
    onClose();
  };

  const handleNotInterested = () => {
    if (onNotInterested) {
      onNotInterested();
    } else {
      toast.success("We'll show you less content like this");
      onClose();
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DropdownMenuTrigger asChild>
        <motion.button
          className="w-11 h-11 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/40"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!isOpen) onClose();
          }}
        >
          <MoreHorizontal className="w-5 h-5" />
        </motion.button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-black/80 backdrop-blur-md border-gray-700 text-white w-48">
        <DropdownMenuItem onClick={handleSendTo} className="cursor-pointer hover:bg-white/10">
          <Send className="mr-2 h-4 w-4" />
          <span>Send to...</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleCopyLink} className="cursor-pointer hover:bg-white/10">
          <Copy className="mr-2 h-4 w-4" />
          <span>Copy link</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDownload} className="cursor-pointer hover:bg-white/10">
          <Download className="mr-2 h-4 w-4" />
          <span>Download</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-gray-700" />
        <DropdownMenuItem onClick={handleNotInterested} className="cursor-pointer hover:bg-white/10">
          <Ban className="mr-2 h-4 w-4" />
          <span>Not interested</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleMuteUser} className="cursor-pointer hover:bg-white/10">
          <VolumeX className="mr-2 h-4 w-4" />
          <span>Mute user</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleReport} className="cursor-pointer hover:bg-white/10 text-red-400">
          <Flag className="mr-2 h-4 w-4" />
          <span>Report</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ReelMoreActionsMenu;
