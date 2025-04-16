
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getInitials } from "@/lib/utils";
import { toggleFollowUser, checkIsFollowing } from "@/integrations/supabase/profile-functions";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { ProfileSummary, ReelContent } from "@/types/reels";

interface ReelUserInfoProps {
  user: ProfileSummary;
  reel: ReelContent; // Adding the missing prop to the interface
}

const ReelUserInfo = ({ user, reel }: ReelUserInfoProps) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    const checkFollowStatus = async () => {
      if (!currentUser || !user) return;
      
      try {
        const isUserFollowing = await checkIsFollowing(currentUser.id, user.id);
        setIsFollowing(isUserFollowing);
      } catch (error) {
        console.error("Error checking follow status:", error);
      }
    };
    
    if (currentUser && user && currentUser.id !== user.id) {
      checkFollowStatus();
    }
  }, [currentUser, user]);

  const handleFollowToggle = async () => {
    if (!currentUser) {
      toast.error("Please sign in to follow users");
      return;
    }

    try {
      const result = await toggleFollowUser(currentUser.id, user.id);
      setIsFollowing(result);
      
      toast.success(result 
        ? `You are now following ${user.username || user.full_name || 'this user'}`
        : `You unfollowed ${user.username || user.full_name || 'this user'}`
      );
    } catch (error) {
      console.error("Error toggling follow:", error);
      toast.error("Failed to update follow status");
    }
  };

  return (
    <div className="flex justify-between items-center pointer-events-auto z-10">
      <Link to={`/profile/${user?.username || user?.id}`} className="flex items-center space-x-2">
        <Avatar className="h-10 w-10 border-2 border-white">
          <AvatarImage src={user?.avatar || ""} alt={user?.username || "User"} />
          <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
            {getInitials(user?.full_name || user?.username || "U")}
          </AvatarFallback>
        </Avatar>
        <div>
          <h4 className="text-white font-medium text-sm">
            {user?.full_name || user?.username || "User"}
          </h4>
          <p className="text-white/80 text-xs">@{user?.username || "username"}</p>
        </div>
      </Link>
      
      {currentUser && currentUser.id !== user?.id && (
        <Button 
          size="sm" 
          variant={isFollowing ? "destructive" : "secondary"} 
          className={`rounded-full text-xs h-8 ${isFollowing 
            ? 'bg-white/20 text-white hover:bg-white/30' 
            : 'bg-white/20 backdrop-blur-md hover:bg-white/30 text-white'}`}
          onClick={handleFollowToggle}
        >
          {isFollowing ? "Following" : "Follow"}
        </Button>
      )}
    </div>
  );
};

export default ReelUserInfo;
