
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase, listBucketFiles, getPublicUrl, STORAGE_BUCKETS, matchStorageWithDatabaseMetadata } from "@/integrations/supabase/client";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Tables } from "@/integrations/supabase/types";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import ReelView from "@/components/reels/ReelView";
import { Video, Film, ArrowLeft, ArrowRight } from "lucide-react";
import ReelsSkeleton from "@/components/reels/ReelsSkeleton";

// Define the reel content types expected by our components
interface ReelContent {
  id: string;
  user_id: string;
  created_at: string;
  video_url: string;
  thumbnail_url?: string;
  caption?: string;
  audio_type?: string;
  audio_url?: string; 
  duration?: number;
  original_audio_volume?: number;
  overlay_audio_volume?: number;
  tags?: string[];
  allow_comments?: boolean;
  allow_duets?: boolean;
}

interface ReelWithUser {
  reel: ReelContent;
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
      
      // Fetch files from storage bucket "reels"
      const storageFiles = await listBucketFiles(STORAGE_BUCKETS.REELS);
      console.log("Storage files from reels bucket:", storageFiles);
      
      if (!storageFiles || storageFiles.length === 0) {
        console.log("No reels found in storage");
        setLoading(false);
        setReels([]);
        return;
      }
      
      // Filter for only video files - with proper null checks
      const videoFiles = storageFiles.filter(file => 
        file && file.id && 
        (file.id.endsWith('.mp4') || file.id.endsWith('.mov') || file.id.endsWith('.webm')) && 
        !file.id.endsWith('-thumb.jpg') && 
        (file.metadata?.mimetype?.startsWith('video/') || 
         (typeof file.name === 'string' && 
          /\.(mp4|mov|webm)$/i.test(file.name)))
      );
      
      console.log("Video files filtered:", videoFiles);

      if (videoFiles.length === 0) {
        console.log("No video files found");
        setLoading(false);
        setReels([]);
        return;
      }

      // Process storage files and match with database metadata
      const processedReels = await Promise.all(
        videoFiles.map(async (file) => {
          // Extract user_id from the file path (usually the first segment)
          const pathParts = file.name ? file.name.split('/') : ['unknown'];
          const userId = pathParts[0] || 'unknown';
          const fileId = file.id || file.name || '';
          
          // Find thumbnail file if available
          const thumbnailFile = storageFiles.find(f => 
            f && f.name && fileId && 
            f.name.includes(fileId.replace(/\.(mp4|mov|webm)$/i, '')) && 
            f.name.includes('-thumb.jpg')
          );
          
          // Check both posts_reels and reels tables for metadata
          const { data: reelsMetadata, error: reelsError } = await supabase
            .from("posts_reels")
            .select("*")
            .or(`video_url.ilike.%${fileId}%,id.eq.${fileId}`);
            
          const { data: olderReelsData, error: olderReelsError } = await supabase
            .from("reels")
            .select("*")
            .or(`video_url.ilike.%${fileId}%,id.eq.${fileId}`);
          
          // Get metadata from either table
          let metadata = 
            (reelsMetadata && reelsMetadata.length > 0 ? reelsMetadata[0] : null) || 
            (olderReelsData && olderReelsData.length > 0 ? olderReelsData[0] : null);
          
          // Create a standardized reel content object
          let reelContent: ReelContent = {
            id: fileId,
            user_id: userId,
            created_at: file.created_at || new Date().toISOString(),
            video_url: getPublicUrl(STORAGE_BUCKETS.REELS, file.name || ''),
            thumbnail_url: thumbnailFile ? getPublicUrl(STORAGE_BUCKETS.REELS, thumbnailFile.name || '') : undefined,
            caption: "",
            audio_type: "original",
            audio_url: "", 
            duration: 0,
            original_audio_volume: 1,
            overlay_audio_volume: 0,
            tags: [],
            allow_comments: true,
            allow_duets: true
          };
          
          // If we have metadata, override defaults with actual values
          if (metadata) {
            reelContent = {
              ...reelContent,
              ...metadata,
              // Ensure these URLs are full public URLs
              video_url: metadata.video_url?.startsWith('http') 
                ? metadata.video_url 
                : getPublicUrl(STORAGE_BUCKETS.REELS, file.name || ''),
              thumbnail_url: metadata.thumbnail_url?.startsWith('http') 
                ? metadata.thumbnail_url 
                : thumbnailFile ? getPublicUrl(STORAGE_BUCKETS.REELS, thumbnailFile.name || '') : undefined
            };
          }
          
          // Get user profile
          const { data: userData, error: userError } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", reelContent.user_id)
            .maybeSingle();
            
          if (userError) {
            console.error("Error fetching user:", userError);
          }
          
          return {
            reel: reelContent,
            user: userData || { 
              id: reelContent.user_id, 
              username: "Unknown User", 
              avatar: null 
            } as Tables<"profiles">
          };
        })
      );
      
      // Sort by created_at (newest first)
      const sortedReels = processedReels.sort((a, b) => {
        return new Date(b.reel.created_at).getTime() - new Date(a.reel.created_at).getTime();
      });
      
      setReels(sortedReels);
      console.log("Processed and sorted reels:", sortedReels);
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

  return (
    <AppLayout pageTitle="Reels">
      <div className="h-[calc(100vh-12rem)] md:h-[calc(100vh-8rem)] relative overflow-hidden md:rounded-xl bg-gradient-to-br from-primary/90 via-primary to-secondary/80">
        {loading ? (
          <ReelsSkeleton />
        ) : reels.length > 0 ? (
          <motion.div 
            className="h-full w-full relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Full-screen immersive view for reels */}
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

export default Reels;
