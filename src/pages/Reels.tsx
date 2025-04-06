
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tables } from "@/integrations/supabase/types";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Video, Film } from "lucide-react";

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

  return (
    <AppLayout>
      <div className="h-[calc(100vh-12rem)] relative overflow-hidden md:rounded-xl bg-gradient-to-br from-primary/90 via-primary to-secondary/80">
        {loading ? (
          <ReelsSkeleton />
        ) : reels.length > 0 ? (
          <motion.div 
            className="h-full w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Reels content would go here */}
          </motion.div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-white p-8 text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="glass-card bg-white/10 p-8 rounded-2xl max-w-md backdrop-blur-sm"
            >
              <div className="mb-6 flex justify-center">
                <div className="p-4 bg-white/20 rounded-full">
                  <Film className="h-12 w-12" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-4">No reels yet</h3>
              <p className="mb-6 text-white/80">Be the first to create an awesome reel!</p>
              <Button 
                onClick={() => navigate("/create")} 
                className="px-6 py-3 bg-white text-primary rounded-full font-medium hover:bg-white/90 transition-all shadow-lg"
                size="lg"
              >
                <Video className="h-5 w-5 mr-2" />
                Create Reel
              </Button>
            </motion.div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

const ReelsSkeleton = () => {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center">
      <div className="max-w-md w-full px-8">
        <Skeleton className="w-12 h-12 rounded-full mb-4 mx-auto" />
        <Skeleton className="w-2/3 h-5 mb-2 mx-auto" />
        <Skeleton className="w-4/5 h-20 mb-4 mx-auto" />
        <div className="flex justify-center space-x-2">
          <Skeleton className="w-10 h-10 rounded-full" />
          <Skeleton className="w-10 h-10 rounded-full" />
          <Skeleton className="w-10 h-10 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default Reels;
