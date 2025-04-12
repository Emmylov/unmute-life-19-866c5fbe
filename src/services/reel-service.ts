
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Define interfaces for our RPC function parameters
interface ReelIdUserIdParams {
  p_reel_id: string;
  p_user_id: string;
}

interface SaveReelParams extends ReelIdUserIdParams {
  p_created_at: string;
}

interface RepostReelParams extends SaveReelParams {
  p_original_user_id: string;
}

interface ReportContentParams {
  p_content_id: string;
  p_user_id: string;
  p_content_type: string;
  p_reason: string;
  p_created_at: string;
}

// Check if a reel is liked by the current user
export const checkReelLikeStatus = async (reelId: string, userId: string) => {
  try {
    const { data, error } = await supabase
      .from("reel_likes")
      .select("*")
      .eq("reel_id", reelId)
      .eq("user_id", userId)
      .maybeSingle();
      
    if (error) throw error;
    return !!data;
  } catch (error) {
    console.error("Error checking reel like status:", error);
    return false;
  }
};

// Toggle like on a reel
export const toggleReelLike = async (reelId: string, userId: string) => {
  try {
    // Check if already liked
    const { data: existingLike } = await supabase
      .from("reel_likes")
      .select("*")
      .eq("reel_id", reelId)
      .eq("user_id", userId)
      .maybeSingle();
    
    if (existingLike) {
      // Unlike
      const { error } = await supabase
        .from("reel_likes")
        .delete()
        .eq("reel_id", reelId)
        .eq("user_id", userId);
        
      if (error) throw error;
      return false;
    } else {
      // Like
      const { error } = await supabase
        .from("reel_likes")
        .insert({ reel_id: reelId, user_id: userId });
        
      if (error) throw error;
      return true;
    }
  } catch (error) {
    console.error("Error toggling reel like:", error);
    throw error;
  }
};

// Check if a reel is saved by the current user
export const checkReelSaveStatus = async (reelId: string, userId: string) => {
  try {
    const params: ReelIdUserIdParams = {
      p_reel_id: reelId,
      p_user_id: userId
    };
    
    // Using type assertion with correct generic type parameters
    const { data, error } = await (supabase.rpc as any)<boolean, ReelIdUserIdParams>(
      "is_reel_saved", 
      params
    );
      
    if (error) throw error;
    return !!data;
  } catch (error) {
    console.error("Error checking reel save status:", error);
    return false;
  }
};

// Toggle save on a reel
export const toggleReelSave = async (reelId: string, userId: string) => {
  try {
    // Check if already saved
    const isSaved = await checkReelSaveStatus(reelId, userId);
    
    if (isSaved) {
      // Unsave
      const params: ReelIdUserIdParams = {
        p_reel_id: reelId,
        p_user_id: userId
      };
      
      const { error } = await supabase.rpc(
        "unsave_reel", 
        params
      );
        
      if (error) throw error;
      return false;
    } else {
      // Save
      const params: SaveReelParams = {
        p_reel_id: reelId,
        p_user_id: userId,
        p_created_at: new Date().toISOString()
      };
      
      const { error } = await supabase.rpc(
        "save_reel", 
        params
      );
        
      if (error) throw error;
      return true;
    }
  } catch (error) {
    console.error("Error toggling reel save:", error);
    throw error;
  }
};

// Check if a reel is already reposted by the user
export const checkReelRepostStatus = async (reelId: string, userId: string) => {
  try {
    const params: ReelIdUserIdParams = {
      p_reel_id: reelId,
      p_user_id: userId
    };
    
    // Using type assertion with correct generic type parameters
    const { data } = await (supabase.rpc as any)<boolean, ReelIdUserIdParams>(
      "is_reel_reposted", 
      params
    );
    
    return !!data;
  } catch (error) {
    console.error("Error checking repost status:", error);
    return false;
  }
};

// Repost a reel
export const repostReel = async (reelId: string, userId: string, originalUserId: string) => {
  try {
    // Check if already reposted
    const isReposted = await checkReelRepostStatus(reelId, userId);
    
    if (isReposted) {
      toast.info("You've already reposted this reel");
      return false;
    }
    
    // Repost
    const params: RepostReelParams = {
      p_reel_id: reelId,
      p_user_id: userId,
      p_original_user_id: originalUserId,
      p_created_at: new Date().toISOString()
    };
    
    const { error } = await supabase.rpc(
      "repost_reel", 
      params
    );
      
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error reposting reel:", error);
    throw error;
  }
};

// Report a reel
export const reportReel = async (reelId: string, userId: string, reason: string = "inappropriate content") => {
  try {
    const params: ReportContentParams = {
      p_content_id: reelId,
      p_user_id: userId,
      p_content_type: 'reel',
      p_reason: reason,
      p_created_at: new Date().toISOString()
    };
    
    const { error } = await supabase.rpc(
      "report_content", 
      params
    );
      
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error reporting reel:", error);
    throw error;
  }
};
