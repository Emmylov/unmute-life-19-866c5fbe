
import { supabase } from "@/integrations/supabase/client";
import { FeedPost } from "@/types/feed-post";
import { adaptToFeedPost } from "./utils";

export const fetchFollowingFeed = async (lastId?: string | null): Promise<FeedPost[]> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user || !user.user) {
      throw new Error("User not authenticated");
    }

    // First, get the users that the current user is following
    const { data: followingData, error: followingError } = await supabase
      .from("user_follows")
      .select("following_id")
      .eq("follower_id", user.user.id);

    if (followingError) {
      throw followingError;
    }

    // If not following anyone, return empty array
    if (!followingData || followingData.length === 0) {
      return [];
    }

    // Extract the IDs of followed users
    const followingIds = followingData.map((follow) => follow.following_id);

    // Fetch posts from followed users
    let query = supabase
      .from("posts")
      .select(
        `
        id,
        user_id,
        post_type,
        content,
        title,
        image_urls,
        video_url,
        caption,
        thumbnail_url,
        emoji_mood,
        created_at,
        visibility,
        likes_count,
        comments_count,
        profiles (
          id,
          username,
          avatar,
          full_name
        ),
        tags
        `
      )
      .in("user_id", followingIds)
      .eq("visibility", "public")
      .order("created_at", { ascending: false })
      .limit(10);

    if (lastId) {
      query = query.lt("id", lastId);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    if (!data || data.length === 0) {
      return [];
    }

    // Transform the data to match the FeedPost type
    const feedPosts: FeedPost[] = data.map((post) => {
      return adaptToFeedPost(post);
    });

    return feedPosts;
  } catch (error) {
    console.error("Error fetching following feed:", error);
    throw error;
  }
};
