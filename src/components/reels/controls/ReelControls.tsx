
import React from "react";
import { useIsMobile } from "@/hooks/use-responsive";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageCircle, MoreVertical } from "lucide-react";
import { motion } from "framer-motion";
import { ReelWithUser } from "@/types/reels";
import { useNavigate } from "react-router-dom";
import ReelUserInfo from "./ReelUserInfo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ReelControlsProps {
  reelWithUser: ReelWithUser;
  selectedEmotion: string | null;
  onEmotionSelect: (emotion: string) => void;
  openUnmuteThread: () => void;
}

const ReelControls: React.FC<ReelControlsProps> = ({ 
  reelWithUser,
  selectedEmotion,
  onEmotionSelect,
  openUnmuteThread
}) => {
  const { reel, user } = reelWithUser;
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  
  const handleViewProfile = () => {
    navigate(`/profile/${user.username}`);
  };

  return (
    <div className="flex justify-between items-start w-full">
      {/* User info section */}
      <motion.div
        className="flex items-center gap-3"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full p-0 h-auto w-auto"
          onClick={handleViewProfile}
        >
          <Avatar className={`${isMobile ? 'h-8 w-8' : 'h-10 w-10'} border-2 border-white`}>
            <AvatarImage src={user.avatar} alt={user.username} />
            <AvatarFallback>{user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
        </Button>
        <ReelUserInfo user={user} reel={reel} />
      </motion.div>

      {/* Combined actions in a dropdown to reduce vertical elements */}
      <div className="flex items-center space-x-2">
        {/* Unmute Thread button */}
        <motion.button
          onClick={openUnmuteThread}
          className="bg-white/20 backdrop-blur-md rounded-full px-3 py-1.5 text-white text-sm font-medium flex items-center gap-1.5"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <MessageCircle className="w-4 h-4" />
          <span>Unmute</span>
        </motion.button>

        {/* More actions dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white hover:bg-white/20 rounded-full"
            >
              <MoreVertical className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-black/80 backdrop-blur-md border-white/10">
            <DropdownMenuItem 
              onSelect={() => onEmotionSelect('Love')} 
              className="focus:bg-white/10 cursor-pointer"
            >
              Love Reaction
            </DropdownMenuItem>
            <DropdownMenuItem 
              onSelect={() => onEmotionSelect('Laugh')} 
              className="focus:bg-white/10 cursor-pointer"
            >
              Laugh Reaction
            </DropdownMenuItem>
            {/* Add more emotion options as needed */}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default ReelControls;
