
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tables } from "@/integrations/supabase/types";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Video, Film, ArrowLeft, ArrowRight, Heart, MessageCircle, Share2, Bookmark } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ReelWithUser {
  reel: Tables<"reels"> | {
    id: string;
    user_id: string;
    created_at: string;
    video_url: string;
    thumbnail_url?: string;
    caption?: string;
    allow_comments?: boolean;
    allow_duets?: boolean;
    audio_type?: string;
    audio_url?: string;
    duration?: number;
    original_audio_volume?: number;
    overlay_audio_volume?: number;
    tags?: string[];
  };
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
      setLoading(true);
      
      // First try to get reels from posts_reels table (new structure)
      let { data: newerReelsData, error: newerReelsError } = await supabase
        .from("posts_reels")
        .select("*")
        .order("created_at", { ascending: false });

      // Then get reels from the reels table (older structure)
      let { data: olderReelsData, error: olderReelsError } = await supabase
        .from("reels")
        .select("*")
        .order("created_at", { ascending: false });

      if (newerReelsError && olderReelsError) {
        throw newerReelsError || olderReelsError;
      }

      const reelsData = [];
      
      // Add data from newer reels structure if available
      if (newerReelsData && newerReelsData.length > 0) {
        // Map the newer reels structure to match the expected format
        const mappedNewerReels = newerReelsData.map(reel => ({
          id: reel.id,
          user_id: reel.user_id,
          created_at: reel.created_at,
          video_url: reel.video_url,
          thumbnail_url: null, // This might be available in the actual data
          caption: reel.caption || "",
          // Handle audio field differently for newer reels
          audio_url: reel.audio_url || "",
          audio_type: reel.audio_type || "original",
          duration: reel.duration,
          allow_comments: reel.allow_comments,
          allow_duets: reel.allow_duets,
          original_audio_volume: reel.original_audio_volume,
          overlay_audio_volume: reel.overlay_audio_volume,
          tags: reel.tags
        }));
        
        reelsData.push(...mappedNewerReels);
      }
      
      // Add data from older reels structure if available
      if (olderReelsData && olderReelsData.length > 0) {
        reelsData.push(...olderReelsData);
      }
      
      console.log("Fetched reels data:", reelsData);

      if (reelsData.length > 0) {
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
        console.log("Reels with users:", reelsWithUsers);
      } else {
        setReels([]);
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

  const handlePrevReel = () => {
    if (currentReelIndex > 0) {
      setCurrentReelIndex(currentReelIndex - 1);
    }
  };

  const handleNextReel = () => {
    if (currentReelIndex < reels.length - 1) {
      setCurrentReelIndex(currentReelIndex + 1);
    }
  };

  const getAudioDisplay = (reel: ReelWithUser['reel']) => {
    // Handle different reel structures for audio display
    if ('audio' in reel && reel.audio) {
      return reel.audio;
    } else if ('audio_url' in reel && reel.audio_url) {
      return reel.audio_type === 'original' ? 'Original Audio' : reel.audio_url;
    }
    return 'Original Audio';
  };

  return (
    <AppLayout pageTitle="Reels">
      <div className="h-[calc(100vh-12rem)] relative overflow-hidden md:rounded-xl bg-gradient-to-br from-primary/90 via-primary to-secondary/80">
        {loading ? (
          <ReelsSkeleton />
        ) : reels.length > 0 ? (
          <motion.div 
            className="h-full w-full relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-full h-full max-w-md max-h-[80vh] mx-auto">
                <video
                  src={reels[currentReelIndex].reel.video_url}
                  poster={reels[currentReelIndex].reel.thumbnail_url || undefined}
                  className="w-full h-full object-cover rounded-lg"
                  controls
                  autoPlay
                  loop
                  muted
                />
                
                {/* Reel Controls UI */}
                <div className="absolute bottom-4 left-4 right-4 text-white p-4 bg-black/30 backdrop-blur-sm rounded-lg">
                  <div className="flex items-center mb-3">
                    <Avatar className="h-8 w-8 mr-2 ring-2 ring-white">
                      <AvatarImage src={reels[currentReelIndex].user.avatar || ''} alt={reels[currentReelIndex].user.username || ''} />
                      <AvatarFallback className="bg-unmute-purple-dark">
                        {reels[currentReelIndex].user.username?.substring(0, 1).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{reels[currentReelIndex].user.username || 'Unknown User'}</p>
                      <p className="text-xs opacity-80">Original audio</p>
                    </div>
                  </div>
                  
                  <p className="text-sm mb-3">{reels[currentReelIndex].reel.caption || ''}</p>
                  
                  <div className="flex justify-between">
                    <div className="flex space-x-4">
                      <button className="flex flex-col items-center">
                        <Heart className="h-5 w-5" />
                        <span className="text-xs mt-1">23k</span>
                      </button>
                      <button className="flex flex-col items-center">
                        <MessageCircle className="h-5 w-5" />
                        <span className="text-xs mt-1">142</span>
                      </button>
                      <button className="flex flex-col items-center">
                        <Share2 className="h-5 w-5" />
                        <span className="text-xs mt-1">Share</span>
                      </button>
                    </div>
                    <button className="flex flex-col items-center">
                      <Bookmark className="h-5 w-5" />
                      <span className="text-xs mt-1">Save</span>
                    </button>
                  </div>
                </div>
                
                {/* Navigation buttons */}
                {currentReelIndex > 0 && (
                  <button 
                    onClick={handlePrevReel}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/30 text-white p-2 rounded-full backdrop-blur-sm hover:bg-black/50 transition-colors"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </button>
                )}
                
                {currentReelIndex < reels.length - 1 && (
                  <button 
                    onClick={handleNextReel}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/30 text-white p-2 rounded-full backdrop-blur-sm hover:bg-black/50 transition-colors"
                  >
                    <ArrowRight className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
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
                <div className="p-4 bg-unmute-purple/30 rounded-full">
                  <Film className="h-12 w-12" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-4">No reels yet</h3>
              <p className="mb-6 text-white/80">Be the first to create an awesome reel!</p>
              <Button 
                onClick={() => navigate("/create")} 
                className="px-6 py-3 bg-white text-primary hover:bg-white/90 transition-all shadow-lg rounded-full font-medium"
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
