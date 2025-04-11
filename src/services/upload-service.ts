
import { supabase, STORAGE_BUCKETS } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";

// Upload an image to storage and return the URL
export const uploadImage = async (file: File, bucket: string = STORAGE_BUCKETS.POSTS): Promise<string> => {
  try {
    if (!file) {
      throw new Error("No file provided");
    }
    
    // Generate a unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = fileName;
    
    // Upload the file to the specified bucket
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);
    
    if (uploadError) {
      throw uploadError;
    }
    
    // Get the public URL
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);
    
    return data.publicUrl;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

// Upload a video for a reel
export const uploadReelVideo = async (file: File): Promise<{ videoUrl: string, storagePath: string }> => {
  try {
    if (!file) {
      throw new Error("No video file provided");
    }
    
    // Generate a unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = fileName;
    
    // Upload the video to the reels bucket
    const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKETS.REELS)
      .upload(filePath, file);
    
    if (uploadError) {
      throw uploadError;
    }
    
    // Get the public URL
    const { data } = supabase.storage
      .from(STORAGE_BUCKETS.REELS)
      .getPublicUrl(filePath);
    
    return {
      videoUrl: data.publicUrl,
      storagePath: filePath
    };
  } catch (error) {
    console.error("Error uploading reel video:", error);
    throw error;
  }
};
