
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import AppLayout from "@/components/layout/AppLayout";
import ReelView from "@/components/reels/ReelView";
import ReelsSkeleton from "@/components/reels/ReelsSkeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { Tables } from "@/integrations/supabase/types";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

interface ReelWithUser {
  reel: Tables<"reels">;
  user: Tables<"profiles">;
}

const Reels = () => {
  const [reels, setReels] = useState<ReelWithUser[]>([]);
  const [currentReelIndex, setCurrentReelIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchReels();
  }, []);

  const fetchReels = async () => {
    try {
      const { data: reelsData, error: reelsError } = await supabase
        .from("reels")
        .select("*")
        .order("created_at", { ascending: false });

      if (reelsError) throw reelsError;

      if (reelsData && reelsData.length > 0) {
        // Fetch user profiles for each reel
        const reelsWithUsers = await Promise.all(
          reelsData.map(async (reel) => {
            const { data: userData, error: userError } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", reel.user_id)
              .single();

            if (userError) {
              console.error("Error fetching user:", userError);
              return {
                reel,
                user: { 
                  id: reel.user_id || "", 
                  username: "Unknown User",
                  avatar: null 
                } as Tables<"profiles">
              };
            }

            return {
              reel,
              user: userData as Tables<"profiles">
            };
          })
        );

        setReels(reelsWithUsers);
      }
    } catch (error) {
      console.error("Error loading reels:", error);
      toast({
        title: "Error loading reels",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNextReel = () => {
    if (currentReelIndex < reels.length - 1) {
      setCurrentReelIndex(currentReelIndex + 1);
    }
  };

  const handlePreviousReel = () => {
    if (currentReelIndex > 0) {
      setCurrentReelIndex(currentReelIndex - 1);
    }
  };

  // Handle swipe gestures
  const handleSwipe = (direction: string) => {
    if (direction === "up") {
      handleNextReel();
    } else if (direction === "down") {
      handlePreviousReel();
    }
  };

  return (
    <AppLayout>
      <div className="h-[calc(100vh-12rem)] relative overflow-hidden md:rounded-xl bg-gradient-to-br from-purple-900 via-violet-800 to-purple-800">
        {loading ? (
          <ReelsSkeleton />
        ) : reels.length > 0 ? (
          <motion.div 
            className="h-full w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <ReelView 
              reelWithUser={reels[currentReelIndex]} 
              onNext={handleNextReel}
              onPrevious={handlePreviousReel}
              onSwipe={handleSwipe}
              hasNext={currentReelIndex < reels.length - 1}
              hasPrevious={currentReelIndex > 0}
              currentIndex={currentReelIndex}
              totalReels={reels.length}
            />
            
            {/* Pagination indicator */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 flex space-x-1">
              {reels.map((_, index) => (
                <motion.div
                  key={index}
                  className={`h-1 rounded-full ${
                    index === currentReelIndex ? "w-4 bg-white" : "w-2 bg-white/50"
                  }`}
                  initial={false}
                  animate={{
                    width: index === currentReelIndex ? 16 : 8,
                    opacity: index === currentReelIndex ? 1 : 0.5,
                  }}
                  transition={{ duration: 0.3 }}
                />
              ))}
            </div>
          </motion.div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-white p-8 text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-2xl font-bold mb-4">No reels yet</h3>
              <p className="mb-6">Be the first to create an awesome reel!</p>
              <button 
                onClick={() => navigate("/create-reel")} 
                className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full font-medium hover:opacity-90 transition-all"
              >
                Create Reel
              </button>
            </motion.div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Reels;
