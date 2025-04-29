
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { UserPlus, Heart, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useSocialActions } from "@/hooks/use-social-actions";
import { getInitials } from "@/lib/utils";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { motion, AnimatePresence } from "framer-motion";

const SuggestedUsers = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toggleFollow, loadingFollowState } = useSocialActions();
  const [reactionStates, setReactionStates] = useState<Record<string, boolean>>({});
  
  useEffect(() => {
    let isMounted = true;
    
    const fetchSuggestedUsers = async () => {
      if (!user) {
        if (isMounted) {
          setLoading(false);
          setUsers([]);
        }
        return;
      }
      
      try {
        if (isMounted) setLoading(true);
        
        // Fetch users with error handling
        try {
          const { data, error } = await supabase
            .from("profiles")
            .select("id, username, full_name, avatar")
            .neq("id", user.id)
            .order("created_at", { ascending: false })
            .limit(5);
          
          if (error) throw error;
        
          if (data && isMounted) {
            // Load follow states from localStorage for UI persistence
            const usersWithFollowStatus = await Promise.all(data.map(async (suggestedUser) => {
              const localStorageKey = `follow_${user.id}_${suggestedUser.id}`;
              const savedFollowState = localStorage.getItem(localStorageKey);
              
              // Initialize with localStorage value if available
              const initialFollowState = savedFollowState === 'true';
              
              return {
                ...suggestedUser, 
                isFollowing: initialFollowState
              };
            }));
            
            setUsers(usersWithFollowStatus);
          }
        } catch (error) {
          console.error("Error fetching suggested users:", error);
          // Set empty array in case of error
          if (isMounted) setUsers([]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    
    fetchSuggestedUsers();
    
    return () => {
      isMounted = false;
    };
  }, [user]);
  
  const handleFollow = async (userId: string) => {
    if (!user) {
      toast.error("Please sign in to follow users");
      return;
    }
    
    // Get current follow state before changing it
    const currentUser = users.find(u => u.id === userId);
    if (!currentUser) return;
    
    const previousFollowState = currentUser.isFollowing;
    
    // Update local state immediately (optimistic update)
    setUsers(users.map(suggestedUser => 
      suggestedUser.id === userId 
        ? { ...suggestedUser, isFollowing: !previousFollowState } 
        : suggestedUser
    ));
    
    // Store in localStorage for persistence
    const localStorageKey = `follow_${user.id}_${userId}`;
    localStorage.setItem(localStorageKey, (!previousFollowState).toString());
    
    // Show reaction animation
    setReactionStates(prev => ({
      ...prev,
      [userId]: true
    }));
    
    // Hide reaction after 1 second
    setTimeout(() => {
      setReactionStates(prev => ({
        ...prev,
        [userId]: false
      }));
    }, 1000);
    
    try {
      const result = await toggleFollow(userId);
      
      // Update with server result
      setUsers(users.map(suggestedUser => 
        suggestedUser.id === userId 
          ? { ...suggestedUser, isFollowing: result } 
          : suggestedUser
      ));
      
      // Update localStorage with server result
      localStorage.setItem(localStorageKey, result.toString());
    } catch (error) {
      console.error("Error following user:", error);
      
      // Revert to previous state if error
      setUsers(users.map(suggestedUser => 
        suggestedUser.id === userId 
          ? { ...suggestedUser, isFollowing: previousFollowState } 
          : suggestedUser
      ));
      
      // Update localStorage with previous state
      localStorage.setItem(localStorageKey, previousFollowState.toString());
    }
  };

  if (loading) {
    return (
      <Card className="mb-4 shadow-sm border-none overflow-hidden rounded-xl">
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold mb-3">Suggested for you</h3>
          <div className="flex justify-center py-6">
            <LoadingSpinner size="small" color="purple" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (users.length === 0) {
    return (
      <Card className="mb-4 shadow-sm border-none overflow-hidden rounded-xl">
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold mb-3">Suggested for you</h3>
          
          <div className="empty-state bg-dream-mist py-5 px-4 rounded-lg">
            <div className="flex justify-center mb-2">
              <UserPlus className="h-8 w-8 text-primary/40" />
            </div>
            <p className="text-center text-sm text-gray-500">
              We're looking for people you might like to follow
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-4 shadow-sm border-none overflow-hidden rounded-xl">
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-3">Suggested for you</h3>
        
        <div className="space-y-3">
          {users.map((suggestedUser) => (
            <div key={suggestedUser.id} className="flex items-center justify-between relative">
              <AnimatePresence>
                {reactionStates[suggestedUser.id] && (
                  <motion.div 
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1.5, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
                  >
                    {suggestedUser.isFollowing ? (
                      <Check className="text-green-500 h-8 w-8" />
                    ) : (
                      <Heart className="text-red-500 h-8 w-8" />
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
              
              <Link 
                to={`/profile/${suggestedUser.username || suggestedUser.id}`} 
                className="flex items-center"
              >
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarImage src={suggestedUser.avatar || ""} />
                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                    {getInitials(suggestedUser.full_name || suggestedUser.username || "U")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm">{suggestedUser.full_name || suggestedUser.username || "User"}</p>
                  {suggestedUser.username && (
                    <p className="text-gray-500 text-xs">@{suggestedUser.username}</p>
                  )}
                </div>
              </Link>
              
              <Button 
                size="sm" 
                variant={suggestedUser.isFollowing ? "outline" : "default"}
                className={`rounded-full text-xs h-8 ${suggestedUser.isFollowing ? 'hover:bg-red-50' : ''}`}
                onClick={() => handleFollow(suggestedUser.id)}
                disabled={loadingFollowState[suggestedUser.id]}
              >
                {loadingFollowState[suggestedUser.id] ? "..." : suggestedUser.isFollowing ? "Following" : "Follow"}
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SuggestedUsers;
