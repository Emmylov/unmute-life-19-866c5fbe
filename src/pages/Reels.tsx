
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase, listBucketFiles, getPublicUrl, STORAGE_BUCKETS } from "@/integrations/supabase/client";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Tables } from "@/integrations/supabase/types";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import ReelView from "@/components/reels/ReelView";
import { Video, Film, LoaderCircle } from "lucide-react";
import ReelsSkeleton from "@/components/reels/ReelsSkeleton";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useIsMobile, useIsTablet, useIsDesktop } from "@/hooks/use-responsive";
import { v4 as uuidv4 } from "uuid";

interface ReelContent {
  id: string;
  user_id: string;
  created_at: string;
  video_url: string;
  thumbnail_url?: string | null;
  caption?: string | null;
  audio?: string | null;
  audio_type?: string | null;
  audio_url?: string | null; 
  duration?: number | null;
  original_audio_volume?: number | null;
  overlay_audio_volume?: number | null;
  tags?: string[] | null;
  allow_comments?: boolean | null;
  allow_duets?: boolean | null;
}

interface ReelWithUser {
  reel: ReelContent;
  user: Tables<"profiles">;
}

interface ReelsProps {
  initialReelId?: string | null;
}

const Reels = ({ initialReelId }: ReelsProps = {}) => {
  const [reels, setReels] = useState<ReelWithUser[]>([]);
  const [currentReelIndex, setCurrentReelIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const isDesktop = useIsDesktop();

  useEffect(() => {
    fetchReels();
  }, []);

  useEffect(() => {
    // If initialReelId is provided, find and set the corresponding reel
    if (initialReelId && reels.length > 0) {
      const reelIndex = reels.findIndex(item => item.reel.id === initialReelId);
      if (reelIndex !== -1) {
        setCurrentReelIndex(reelIndex);
      }
    }
  }, [initialReelId, reels]);

  // Update URL when current reel changes
  useEffect(() => {
    if (reels.length > 0) {
      const currentReel = reels[currentReelIndex];
      if (currentReel) {
        setSearchParams({ reel: currentReel.reel.id });
      }
    }
  }, [currentReelIndex, reels, setSearchParams]);

  const fetchReels = async () => {
    try {
      setLoading(true);
      
      const { data: reelsData, error: reelsError } = await supabase
        .from("posts_reels")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (reelsError) {
        console.error("Error fetching reels from database:", reelsError);
        toast({
          title: "Error loading reels",
          description: "Could not fetch reels from database.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
      
      console.log("Reels from database:", reelsData);
      
      if (reelsData && reelsData.length > 0) {
        const processedReels = await Promise.all(
          reelsData.map(async (reel) => {
            const { data: userData, error: userError } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", reel.user_id)
              .maybeSingle();
              
            if (userError) {
              console.error("Error fetching user:", userError);
            }
            
            // Ensure video_url is properly formed and valid
            let videoUrl = reel.video_url;
            console.log("Original video URL:", videoUrl);
            
            if (!videoUrl) {
              console.error("Missing video URL for reel:", reel.id);
              videoUrl = ""; // Set to empty string to trigger error handling in ReelVideo
            } else if (!videoUrl.startsWith('http') && !videoUrl.startsWith('blob:')) {
              // If URL doesn't start with http or blob, it might be a storage path
              console.log("Converting relative path to full URL:", videoUrl);
              videoUrl = getPublicUrl(STORAGE_BUCKETS.REELS, videoUrl);
              console.log("Converted to public URL:", videoUrl);
            }
            
            // Ensure thumbnail_url is properly formed
            let thumbnailUrl = reel.thumbnail_url;
            if (thumbnailUrl && !thumbnailUrl.startsWith('http') && !thumbnailUrl.startsWith('blob:')) {
              // If URL doesn't start with http, it might be a storage path
              thumbnailUrl = getPublicUrl(STORAGE_BUCKETS.REELS, thumbnailUrl);
            }
            
            return {
              reel: {
                ...reel,
                video_url: videoUrl,
                thumbnail_url: thumbnailUrl
              } as ReelContent,
              user: userData || { 
                id: reel.user_id, 
                username: "Unknown User", 
                avatar: null 
              } as Tables<"profiles">
            };
          })
        );
        
        console.log("Processed reels:", processedReels);
        setReels(processedReels);
        setLoading(false);
        return;
      }
      
      console.log("No reels found in database, checking storage...");
      const storageFiles = await listBucketFiles(STORAGE_BUCKETS.REELS);
      console.log("Storage files from reels bucket:", storageFiles);
      
      if (!storageFiles || storageFiles.length === 0) {
        console.log("No reels found in storage");
        setLoading(false);
        setReels([]);
        return;
      }
      
      const videoFiles = storageFiles.filter(file => 
        file && file.name && (
          file.name.endsWith('.mp4') || 
          file.name.endsWith('.mov') || 
          file.name.endsWith('.webm')
        ) && 
        !file.name.endsWith('-thumb.jpg')
      );
      
      console.log("Video files filtered:", videoFiles);

      if (videoFiles.length === 0) {
        console.log("No video files found");
        setLoading(false);
        setReels([]);
        return;
      }

      const processedReels = await Promise.all(
        videoFiles.map(async (file) => {
          const pathParts = file.name ? file.name.split('/') : ['unknown'];
          const userId = pathParts[0] || 'unknown';
          
          const thumbnailFile = storageFiles.find(f => 
            f && f.name && 
            f.name.includes(file.name!.replace(/\.(mp4|mov|webm)$/i, '')) && 
            f.name.includes('-thumb.jpg')
          );
          
          const videoUrl = file.name ? getPublicUrl(STORAGE_BUCKETS.REELS, file.name) : '';
          console.log("Generated video URL:", videoUrl); // Log the generated URL
          
          const thumbnailUrl = thumbnailFile && thumbnailFile.name ? 
            getPublicUrl(STORAGE_BUCKETS.REELS, thumbnailFile.name) : undefined;
          
          const reelContent: ReelContent = {
            id: file.id || file.name || uuidv4(),
            user_id: userId,
            created_at: file.created_at || new Date().toISOString(),
            video_url: videoUrl,
            thumbnail_url: thumbnailUrl,
            caption: null,
            audio_type: "original",
            audio_url: null, 
            duration: 0,
            original_audio_volume: 1,
            overlay_audio_volume: 0,
            tags: [],
            allow_comments: true,
            allow_duets: true
          };
          
          const { data: userData, error: userError } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", userId)
            .maybeSingle();
            
          if (userError) {
            console.error("Error fetching user:", userError);
          }
          
          return {
            reel: reelContent,
            user: userData || { 
              id: userId, 
              username: "Unknown User", 
              avatar: null 
            } as Tables<"profiles">
          };
        })
      );
      
      setReels(processedReels);
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

  const handleReelSwipe = (direction: string) => {
    if (direction === "up" && currentReelIndex < reels.length - 1) {
      setCurrentReelIndex(currentReelIndex + 1);
    } else if (direction === "down" && currentReelIndex > 0) {
      setCurrentReelIndex(currentReelIndex - 1);
    }
  };

  // Determine the height based on device
  const getContainerHeight = () => {
    if (isMobile) return "h-[calc(100vh-12rem)]";
    if (isTablet) return "h-[calc(100vh-10rem)]";
    return "h-[calc(100vh-8rem)]";
  };

  return (
    <AppLayout pageTitle="Reels">
      <div className={`${getContainerHeight()} relative overflow-hidden md:rounded-xl bg-gradient-to-br from-primary/90 via-primary to-secondary/80`}>
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <div className="glass-card p-8 rounded-2xl flex flex-col items-center">
              <LoaderCircle className="h-8 w-8 text-white animate-spin mb-4" />
              <p className="text-white font-medium">Loading reels...</p>
            </div>
          </div>
        ) : reels.length > 0 ? (
          <AnimatePresence mode="wait">
            <motion.div 
              key={`reel-${currentReelIndex}`}
              className="h-full w-full relative"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ReelView 
                reelWithUser={reels[currentReelIndex]}
                onNext={handleNextReel}
                onPrevious={handlePrevReel}
                onSwipe={handleReelSwipe}
                hasNext={currentReelIndex < reels.length - 1}
                hasPrevious={currentReelIndex > 0}
                currentIndex={currentReelIndex}
                totalReels={reels.length}
              />
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-white p-8 text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="glass-card bg-white/10 p-8 rounded-2xl max-w-md backdrop-blur-sm"
            >
              <div className="mb-6 flex justify-center">
                <div className="p-4 bg-primary/30 rounded-full">
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
        
        {/* Progress indicator for reels */}
        {reels.length > 1 && (
          <div className="absolute top-2 left-2 right-2 z-10 flex justify-center">
            <div className="flex gap-1">
              {reels.map((_, index) => (
                <div
                  key={`progress-${index}`}
                  className={`h-1 rounded-full ${
                    currentReelIndex === index 
                      ? 'w-8 bg-white' 
                      : 'w-4 bg-white/40'
                  } transition-all duration-300`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Reels;
