import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase, listBucketFiles, getPublicUrl, STORAGE_BUCKETS } from "@/integrations/supabase/client";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Tables } from "@/integrations/supabase/types";
import { toast } from "@/components/ui/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import ReelView from "@/components/reels/ReelView";
import { Video, Film, LoaderCircle } from "lucide-react";
import ReelsSkeleton from "@/components/reels/ReelsSkeleton";
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
  vibe_tag?: string | null;
  mood_vibe?: string | null;
}

interface ReelWithUser {
  reel: ReelContent;
  user: Tables<"profiles">;
}

interface DatabaseReel {
  id: string;
  user_id: string;
  created_at?: string | null;
  video_url: string;
  thumbnail_url?: string | null;
  caption?: string | null;
  tags?: string[] | null;
  audio_type?: string | null;
  audio_url?: string | null;
  audio?: string | null;
  duration?: number | null;
  original_audio_volume?: number | null;
  overlay_audio_volume?: number | null;
  allow_duets?: boolean | null;
  allow_comments?: boolean | null;
  vibe_tag?: string | null;
  mood_vibe?: string | null;
}

interface ReelsProps {
  initialReelId?: string | null;
}

const Reels = ({ initialReelId }: ReelsProps = {}) => {
  const [reels, setReels] = useState<ReelWithUser[]>([]);
  const [currentReelIndex, setCurrentReelIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [reelsViewed, setReelsViewed] = useState(0);
  const [showBreakReminder, setShowBreakReminder] = useState(false);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

  useEffect(() => {
    const filterParam = searchParams.get("filter");
    if (filterParam) {
      setActiveFilter(filterParam);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchReels();
  }, [activeFilter]);

  useEffect(() => {
    if (initialReelId && reels.length > 0) {
      const reelIndex = reels.findIndex(item => item.reel.id === initialReelId);
      if (reelIndex !== -1) {
        setCurrentReelIndex(reelIndex);
      }
    }
  }, [initialReelId, reels]);

  useEffect(() => {
    if (reels.length > 0) {
      const currentReel = reels[currentReelIndex];
      if (currentReel) {
        if (activeFilter) {
          setSearchParams({ reel: currentReel.reel.id, filter: activeFilter });
        } else {
          setSearchParams({ reel: currentReel.reel.id });
        }
      }
    }
  }, [currentReelIndex, reels, setSearchParams, activeFilter]);

  useEffect(() => {
    const newCount = reelsViewed + 1;
    setReelsViewed(newCount);
    
    if (newCount % 10 === 0 && newCount > 0) {
      setShowBreakReminder(true);
      const timer = setTimeout(() => {
        setShowBreakReminder(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [currentReelIndex]);

  const fetchReels = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from("posts_reels")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (activeFilter) {
        if (['Uplifting', 'Raw', 'Funny', 'Vulnerable'].includes(activeFilter)) {
          query = query.eq('mood_vibe', activeFilter);
        } else if (['Mental Health', 'Faith', 'Identity', 'Social Justice'].includes(activeFilter)) {
          query = query.contains('tags', [activeFilter]);
        }
      }
      
      const { data: reelsData, error: reelsError } = await query;
      
      if (reelsError) {
        console.error("Error fetching reels from database:", reelsError);
        toast({
          title: "Error",
          description: "Could not fetch reels from database.",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }
      
      console.log("Reels from database:", reelsData);
      
      if (reelsData && reelsData.length > 0) {
        const processedReels: ReelWithUser[] = await Promise.all(
          (reelsData as DatabaseReel[]).map(async (reel) => {
            const { data: userData, error: userError } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", reel.user_id)
              .maybeSingle();
              
            if (userError) {
              console.error("Error fetching user:", userError);
            }
            
            let videoUrl = reel.video_url;
            console.log("Original video URL:", videoUrl);
            
            if (!videoUrl) {
              console.error("Missing video URL for reel:", reel.id);
              videoUrl = "";
            } else if (!videoUrl.startsWith('http') && !videoUrl.startsWith('blob:')) {
              console.log("Converting relative path to full URL:", videoUrl);
              videoUrl = getPublicUrl(STORAGE_BUCKETS.REELS, videoUrl);
              console.log("Converted to public URL:", videoUrl);
            }
            
            let thumbnailUrl = reel.thumbnail_url;
            if (thumbnailUrl && !thumbnailUrl.startsWith('http') && !thumbnailUrl.startsWith('blob:')) {
              thumbnailUrl = getPublicUrl(STORAGE_BUCKETS.REELS, thumbnailUrl);
            }

            const reelContent: ReelContent = {
              id: reel.id,
              user_id: reel.user_id,
              created_at: reel.created_at || new Date().toISOString(),
              video_url: videoUrl,
              thumbnail_url: thumbnailUrl,
              caption: reel.caption,
              audio: reel.audio,
              audio_type: reel.audio_type || "original",
              audio_url: reel.audio_url,
              duration: reel.duration,
              original_audio_volume: reel.original_audio_volume || 1,
              overlay_audio_volume: reel.overlay_audio_volume || 0,
              tags: reel.tags || [],
              allow_comments: reel.allow_comments !== false,
              allow_duets: reel.allow_duets !== false,
              vibe_tag: reel.vibe_tag || null,
              mood_vibe: reel.mood_vibe || "Raw"
            };
            
            return {
              reel: reelContent,
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
            allow_duets: true,
            vibe_tag: null,
            mood_vibe: "Raw"
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
        title: "Error",
        description: "Please try again later",
        variant: "destructive"
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

  const handleFilterChange = (filter: string) => {
    if (activeFilter === filter) {
      setActiveFilter(null);
      searchParams.delete('filter');
      setSearchParams(searchParams);
    } else {
      setActiveFilter(filter);
      searchParams.set('filter', filter);
      setSearchParams(searchParams);
    }
  };

  const getContainerHeight = () => {
    if (isMobile) return "h-[calc(100vh-10rem)]";
    if (isTablet) return "h-[calc(100vh-9rem)]";
    return "h-[calc(100vh-8rem)]";
  };

  const emotionFilters = ["Uplifting", "Raw", "Funny", "Vulnerable"];
  const topicFilters = ["Mental Health", "Faith", "Identity", "Social Justice"];

  return (
    <AppLayout pageTitle="Reels">
      <div className="flex overflow-x-auto pb-2 no-scrollbar gap-2 mb-2">
        <div className="flex gap-1.5">
          {emotionFilters.map(filter => (
            <Button
              key={filter}
              size="sm"
              variant={activeFilter === filter ? "default" : "outline"}
              className={`rounded-full text-xs px-3 whitespace-nowrap ${
                activeFilter === filter 
                  ? "bg-primary/90 text-white" 
                  : "bg-white/80 text-primary hover:bg-primary/20"
              }`}
              onClick={() => handleFilterChange(filter)}
            >
              {filter}
            </Button>
          ))}
        </div>
        <div className="h-6 border-r border-gray-200 mx-1"></div>
        <div className="flex gap-1.5">
          {topicFilters.map(filter => (
            <Button
              key={filter}
              size="sm"
              variant={activeFilter === filter ? "default" : "outline"}
              className={`rounded-full text-xs px-3 whitespace-nowrap ${
                activeFilter === filter 
                  ? "bg-primary/90 text-white" 
                  : "bg-white/80 text-primary hover:bg-primary/20"
              }`}
              onClick={() => handleFilterChange(filter)}
            >
              {filter}
            </Button>
          ))}
        </div>
      </div>
      
      <div className={`${getContainerHeight()} relative overflow-hidden rounded-xl bg-gradient-to-br from-unmute-purple/5 via-white/95 to-unmute-pink/5`}>
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <div className="glass-card p-8 rounded-2xl flex flex-col items-center">
              <LoaderCircle className="h-8 w-8 text-primary animate-spin mb-4" />
              <p className="text-gray-700 font-medium">Loading reels...</p>
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
          <div className="h-full flex flex-col items-center justify-center bg-gradient-to-b from-white/50 to-unmute-pink/5 p-8 text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="glass-card bg-white/70 p-8 rounded-2xl max-w-md backdrop-blur-sm shadow-lg"
            >
              <div className="mb-6 flex justify-center">
                <div className="p-4 bg-primary/20 rounded-full">
                  <Film className="h-12 w-12 text-primary" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-2 text-gray-800">No reels yet</h3>
              <p className="mb-6 text-gray-600">Be the first to create an awesome reel and express yourself!</p>
              <Button 
                onClick={() => navigate("/create")} 
                className="px-6 py-3 bg-primary hover:bg-primary/90 transition-all shadow-lg rounded-full font-medium"
                size="lg"
              >
                <Video className="h-5 w-5 mr-2" />
                Create Reel
              </Button>
            </motion.div>
          </div>
        )}
        
        <AnimatePresence>
          {showBreakReminder && (
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-md px-6 py-4 rounded-xl shadow-lg max-w-xs"
            >
              <p className="text-gray-700 text-center">
                Take a breath. You've seen a lot of emotions. Come back when you're ready to listen again.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
        
        {reels.length > 1 && (
          <div className="absolute top-2 left-2 right-2 z-10 flex justify-center">
            <div className="flex gap-1">
              {reels.map((_, index) => (
                <div
                  key={`progress-${index}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === currentReelIndex 
                      ? 'w-8 bg-primary/80' 
                      : 'w-4 bg-white/40'
                  }`}
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
