
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getInitials } from "@/lib/utils";
import { Tables } from "@/integrations/supabase/types";
import { supabase } from "@/integrations/supabase/client";
import { toggleFollowUser } from "@/integrations/supabase/profile-functions";
import { useToast } from "@/hooks/use-toast";

interface ReelUserInfoProps {
  user: Tables<"profiles">;
}

const ReelUserInfo = ({ user }: ReelUserInfoProps) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setCurrentUser(session?.user || null);
    };
    
    getSession();
  }, []);

  // Check if current user is following this user
  useEffect(() => {
    const checkIfFollowing = async () => {
      if (!currentUser || !user) return;
      
      try {
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/user_follows?follower_id=eq.${currentUser.id}&following_id=eq.${user.id}`,
          {
            headers: {
              'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
              'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
            }
          }
        );
        
        if (response.ok) {
          const data = await response.json();
          setIsFollowing(data && data.length > 0);
        }
      } catch (error) {
        console.error("Error checking follow status:", error);
      }
    };
    
    if (currentUser && user) {
      checkIfFollowing();
    }
  }, [currentUser, user]);

  const handleFollowToggle = async () => {
    if (!currentUser) {
      toast({
        title: "Sign in required",
        description: "Please sign in to follow users",
        variant: "destructive"
      });
      return;
    }

    try {
      const result = await toggleFollowUser(currentUser.id, user.id);
      setIsFollowing(result);
      
      toast({
        title: result ? "Following" : "Unfollowed",
        description: result 
          ? `You are now following ${user.username || user.full_name || 'this user'}`
          : `You unfollowed ${user.username || user.full_name || 'this user'}`,
      });
    } catch (error) {
      console.error("Error toggling follow:", error);
      toast({
        title: "Error",
        description: "Failed to follow/unfollow. Please try again.",
        variant: "destructive"
      });
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
    </div>
  );
};

export default ReelUserInfo;
